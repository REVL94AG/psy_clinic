// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// وسيط لحماية المسارات
exports.protect = async (req, res, next) => {
    let token;

    // 1. التحقق من وجود التوكن في هيدر الطلب (Authorization Header)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // أو التحقق من وجود التوكن في الكوكيز (إذا كنت تستخدم متصفحاً)
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // 2. التأكد من وجود التوكن
    if (!token) {
        return res.status(401).json({ success: false, message: 'غير مصرح لك بالوصول، لا يوجد توكن' });
    }

    try {
        // 3. التحقق من صحة التوكن وفك تشفيره
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. إيجاد المستخدم المرتبط بالتوكن وإرفاقه بالطلب
        req.user = await User.findById(decoded.id);

        // 5. السماح للطلب بالمرور إلى الخطوة التالية (الكنترولر)
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'غير مصرح لك بالوصول، التوكن غير صالح' });
    }
};
