const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `ممنوع الوصول. هذا الإجراء يتطلب صلاحية: [${roles.join(', ')}]` });
        }
        next();
    };
};

module.exports = { authorize };
