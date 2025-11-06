// server/controllers/authController.js

const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

// --- دالة تسجيل مستخدم جديد ---
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'الرجاء إدخال جميع الحقول' });
    }
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' });
        }
        
        const user = await User.create({ name, email, password });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ success: true, token });

    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};


// --- دالة تسجيل الدخول (النسخة المصححة) ---
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
    }
    try {
        // الخطوة 1: جلب المستخدم مع كلمة المرور الخاصة به بشكل استثنائي
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // الخطوة 2: مقارنة كلمة المرور المدخلة باستخدام الدالة الموجودة في النموذج
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
        
        // الخطوة 3: إذا تطابقت كلمة المرور، قم بإنشاء وإرسال التوكن
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });

    } catch (error) {
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};


// --- دالة جلب بيانات المستخدم الحالي (محمية) ---
const getMe = async (req, res) => {
    // الوسيط 'protect' قد قام بالفعل بجلب المستخدم ووضعه في req.user
    // النموذج يضمن عدم إرسال كلمة المرور
    res.status(200).json(req.user);
};


// --- تصدير جميع الدوال ---
module.exports = {
    register,
    login,
    getMe,
};
