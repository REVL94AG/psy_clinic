const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user) { return res.status(401).json({ message: 'المستخدم غير موجود' }); }
      next();
    } catch (error) { res.status(401).json({ message: 'غير مصرح لك، التوكن فشل' }); }
  }
  if (!token) { res.status(401).json({ message: 'غير مصرح لك، لا يوجد توكن' }); }
};

module.exports = { protect };
