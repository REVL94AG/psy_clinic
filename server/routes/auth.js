// server/routes/auth.js

const express = require('express');
const router = express.Router();

// 1. استيراد الدوال بالأسماء الصحيحة من المتحكم
const { register, login, getMe } = require('../controllers/authController.js');

// 2. استيراد الوسيط للحماية
const { protect } = require('../middleware/authMiddleware.js');

// المسارات العامة
router.post('/register', register);
router.post('/login', login);

// المسار المحمي
router.get('/me', protect, getMe);

module.exports = router;
