const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { return res.status(400).json({ message: 'الرجاء إدخال جميع الحقول' }); }
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) { return res.status(400).json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' }); }
        const user = await User.create({ name, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ success: true, token });
    } catch (error) { res.status(500).json({ message: 'خطأ في الخادم', error: error.message }); }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' }); }
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) { return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }); }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) { return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }); }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (error) { res.status(500).json({ message: 'خطأ في الخادم', error: error.message }); }
};

const getMe = async (req, res) => { res.status(200).json(req.user); };

module.exports = { register, login, getMe };
