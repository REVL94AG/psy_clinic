const mongoose = require('mongoose');

const TherapistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Therapist', TherapistSchema);
