// server/controllers/appointmentController.js

const Appointment = require('../models/Appointment.js');
const Therapist = require('../models/Therapist.js');

// @desc    إنشاء موعد جديد (مع التحقق من التعارض)
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
    const { therapistId, date, sessionType } = req.body;

    if (!therapistId || !date || !sessionType) {
        return res.status(400).json({ message: 'الرجاء إرسال جميع البيانات المطلوبة (المعالج، التاريخ، نوع الجلسة)' });
    }

    try {
        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(404).json({ message: 'المعالج المحدد غير موجود' });
        }

        // --- هذا هو الكود الجديد لمنع الحجز المكرر ---
        const appointmentDate = new Date(date);

        // التحقق مما إذا كان هناك موعد محجوز بالفعل لهذا المعالج في نفس الوقت بالضبط
        const existingAppointment = await Appointment.findOne({
            therapist: therapistId,
            date: appointmentDate,
            status: 'scheduled' // تحقق فقط من المواعيد المجدولة
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'هذا الموعد محجوز بالفعل. الرجاء اختيار وقت آخر.' }); // 409 Conflict
        }
        // --- نهاية الكود الجديد ---

        const appointment = await Appointment.create({
            therapist: therapistId,
            patient: req.user.id,
            date: appointmentDate,
            sessionType: sessionType,
        });

        res.status(201).json(appointment);

    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'خطأ في الخادم أثناء إنشاء الموعد' });
    }
};

// @desc    جلب مواعيد المستخدم الحالي
// @route   GET /api/appointments/my
// @access  Private
const getMyApointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('therapist', 'name specialty')
            .sort({ date: -1 });

        res.status(200).json(appointments);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'خطأ في الخادم أثناء جلب المواعيد' });
    }
};

// @desc    جلب الأوقات المحجوزة لمعالج في يوم معين
// @route   GET /api/appointments/booked-times/:therapistId/:date
// @access  Private
const getBookedTimes = async (req, res) => {
    try {
        const { therapistId, date } = req.params;
        
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            therapist: therapistId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: 'scheduled'
        });

        const bookedTimes = appointments.map(appt => appt.date);
        res.status(200).json(bookedTimes);

    } catch (error) {
        console.error('Error fetching booked times:', error);
        res.status(500).json({ message: 'خطأ في الخادم أثناء جلب الأوقات المحجوزة' });
    }
};

// تصدير جميع الدوال
module.exports = {
    createAppointment,
    getMyApointments,
    getBookedTimes,
};
