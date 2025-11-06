const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    therapist: { type: mongoose.Schema.ObjectId, ref: 'Therapist', required: true },
    patient: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    sessionType: { type: String, enum: ['video', 'audio', 'chat'], required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    notificationSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
