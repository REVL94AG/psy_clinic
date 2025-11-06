// server/services/notificationService.js

const cron = require('node-cron');
const Appointment = require('../models/Appointment.js');

// دالة لبدء خدمة الإشعارات
const startNotificationService = () => {
    console.log('Notification service started. Checking for appointments every minute.');

    // جدولة مهمة لتعمل كل دقيقة
    cron.schedule('* * * * *', async () => {
        console.log('Running a check for upcoming appointments...');
        
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // قبل ساعة من الآن

        try {
            // ابحث عن المواعيد المجدولة التي ستبدأ خلال الساعة القادمة ولم يتم إرسال إشعار لها
            const upcomingAppointments = await Appointment.find({
                date: { $gte: now, $lte: oneHourFromNow },
                status: 'scheduled',
                notificationSent: false
            }).populate('patient', 'name email').populate('therapist', 'name'); // جلب بيانات المريض والمعالج

            if (upcomingAppointments.length > 0) {
                console.log(`Found ${upcomingAppointments.length} upcoming appointments to notify.`);
            }

            for (const appt of upcomingAppointments) {
                // --- هنا يتم منطق إرسال الإشعار ---
                // حاليًا، سنقوم فقط بطباعة رسالة في الـ console
                console.log(`--- Sending Notification ---`);
                console.log(`To Patient: ${appt.patient.name} (${appt.patient.email})`);
                console.log(`Reminder: Your appointment with ${appt.therapist.name} is at ${appt.date.toLocaleTimeString('ar-EG')}.`);
                console.log(`--- Notification Sent ---`);
                // في المستقبل، يمكن استبدال هذا برمز لإرسال بريد إلكتروني أو إشعار دفع

                // تحديث الموعد للإشارة إلى أنه تم إرسال الإشعار
                appt.notificationSent = true;
                await appt.save();
            }

        } catch (error) {
            console.error('Error in notification service:', error);
        }
    });
};

module.exports = { startNotificationService };
