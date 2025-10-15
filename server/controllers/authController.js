const registerUser = (req, res) => {
  res.status(201).json({
    message: "تم استدعاء مسار التسجيل بنجاح!",
    data: { id: 1, name: "مستخدم جديد وهمي", email: "test@example.com" }
  });
};
module.exports = { registerUser };