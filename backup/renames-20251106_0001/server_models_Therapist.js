// models/Therapist.js

const mongoose = require('mongoose');

// 1. تعريف الـ Schema (مخطط البيانات)
// هذا يحدد شكل وهيئة المستند (document) في قاعدة البيانات
const TherapistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // هذا الحقل إجباري
    },
    specialty: {
        type: String,
        required: true // هذا الحقل إجباري
    },
    // يمكننا إضافة حقول أخرى هنا في المستقبل
    // مثلاً: bio, yearsOfExperience, profileImage, etc.
    createdAt: {
        type: Date,
        default: Date.now // سيتم تسجيل تاريخ الإنشاء تلقائياً
    }
});

// 2. إنشاء وتصدير الـ Model
// الـ Model هو الواجهة التي نستخدمها في الكود للتعامل مع مجموعة "therapists"
// mongoose سيقوم تلقائياً بإنشاء مجموعة اسمها "therapists" (بصيغة الجمع والحروف الصغيرة)
module.exports = mongoose.model('Therapist', TherapistSchema);
