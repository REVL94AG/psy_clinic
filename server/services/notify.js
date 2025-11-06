const cron = require('node-cron');
const Appointment = require('../models/appt.js');

const startNotificationService = () => {
    console.log('Notification service started. Checking for appointments every minute.');
    cron.schedule('* * * * *', async () => {
        console.log('Running a check for upcoming appointments...');
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        try {
            const upcomingAppointments = await Appointment.find({ date: { $gte: now, $lte: oneHourFromNow }, status: 'scheduled', notificationSent: false }).populate('patient', 'name email').populate('therapist', 'name');
            if (upcomingAppointments.length > 0) { console.log(`Found ${upcomingAppointments.length} upcoming appointments to notify.`); }
            for (const appt of upcomingAppointments) {
                console.log(`--- Sending Notification ---`);
                console.log(`To Patient: ${appt.patient.name} (${appt.patient.email})`);
                console.log(`Reminder: Your appointment with ${appt.therapist.name} is at ${appt.date.toLocaleTimeString('ar-EG')}.`);
                console.log(`--- Notification Sent ---`);
                appt.notificationSent = true;
                await appt.save();
            }
        } catch (error) { console.error('Error in notification service:', error); }
    });
};

module.exports = { startNotificationService };
