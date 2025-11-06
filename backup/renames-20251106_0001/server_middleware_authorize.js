// server/middleware/authorize.js

/**
 * وسيط للتحقق من صلاحيات المستخدم (Roles)
 * @param  {...string} roles - قائمة الصلاحيات المسموح لها بالوصول (مثال: 'admin')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // هذا الوسيط يفترض أن الوسيط 'protect' قد تم استدعاؤه قبله
        // وبالتالي فإن req.user يجب أن يكون موجودًا
        if (!req.user || !roles.includes(req.user.role)) {
            // 403 Forbidden: العميل مصادق عليه ولكن ليس لديه الصلاحية اللازمة
            return res.status(403).json({ 
                message: `ممنوع الوصول. هذا الإجراء يتطلب صلاحية: [${roles.join(', ')}]` 
            });
        }
        // إذا كانت الصلاحية موجودة، اسمح للطلب بالمرور
        next();
    };
};

module.exports = { authorize };
