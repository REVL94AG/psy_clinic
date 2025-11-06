const Appointment = require('../models/appt.js');
const Therapist = require('../models/ther.js');

const createAppointment = async (req, res) => {
    const { therapistId, date, sessionType } = req.body;
    if (!therapistId || !date || !sessionType) { return res.status(400).json({ message: 'الرجاء إرسال جميع البيانات المطلوبة (المعالج، التاريخ، نوع الجلسة)' }); }
    try {
        const therapist = await Therapist.findById(therapistId);
        if (!therapist) { return res.status(404).json({ message: 'المعالج المحدد غير موجود' }); }
        const appointmentDate = new Date(date);
        const existingAppointment = await Appointment.findOne({ therapist: therapistId, date: appointmentDate, status: 'scheduled' });
        if (existingAppointment) { return res.status(409).json({ message: 'هذا الموعد محجوز بالفعل. الرجاء اختيار وقت آخر.' }); }
        const appointment = await Appointment.create({ therapist: therapistId, patient: req.user.id, date: appointmentDate, sessionType: sessionType });
        res.status(201).json(appointment);
    } catch (error) { console.error('Error creating appointment:', error); res.status(500).json({ message: 'خطأ في الخادم أثناء إنشاء الموعد' }); }
};

const getMyApointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id }).populate('therapist', 'name specialty').sort({ date: -1 });
        res.status(200).json(appointments);
    } catch (error) { console.error('Error fetching appointments:', error); res.status(500).json({ message: 'خطأ في الخادم أثناء جلب المواعيد' }); }
};

const getBookedTimes = async (req, res) => {
    try {
        const { therapistId, date } = req.params;
        const startOfDay = new Date(date); startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date); endOfDay.setUTCHours(23, 59, 59, 999);
        const appointments = await Appointment.find({ therapist: therapistId, date: { $gte: startOfDay, $lte: endOfDay }, status: 'scheduled' });
        const bookedTimes = appointments.map(appt => appt.date);
        res.status(200).json(bookedTimes);
    } catch (error) { console.error('Error fetching booked times:', error); res.status(500).json({ message: 'خطأ في الخادم أثناء جلب الأوقات المحجوزة' }); }
};

module.exports = { createAppointment, getMyApointments, getBookedTimes };
