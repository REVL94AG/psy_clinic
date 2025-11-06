// server/routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const { createAppointment, getMyApointments, getBookedTimes } = require('../controllers/appt.js');
const { protect } = require('../middleware/guard.js');

// جميع هذه المسارات محمية وتتطلب تسجيل الدخول

// مسار لإنشاء موعد جديد
router.post('/', protect, createAppointment);

// مسار لجلب مواعيد المستخدم الحالي
router.get('/my', protect, getMyApointments);

// مسار لجلب الأوقات المحجوزة لمعالج في يوم معين
router.get('/booked-times/:therapistId/:date', protect, getBookedTimes);

module.exports = router;
