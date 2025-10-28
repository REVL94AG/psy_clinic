// server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'الرجاء إدخال الاسم'] 
    },
    email: { 
        type: String, 
        required: [true, 'الرجاء إدخال البريد الإلكتروني'], 
        unique: true, 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'الرجاء إدخال بريد إلكتروني صالح'] 
    },
    // --- هذا هو الحقل الجديد ---
    role: {
        type: String,
        enum: ['user', 'admin'], // القيم المسموح بها فقط
        default: 'user' // القيمة الافتراضية عند إنشاء مستخدم جديد
    },
    password: { 
        type: String, 
        required: [true, 'الرجاء إدخال كلمة المرور'], 
        minlength: 6, 
        select: false 
    },
}, {
    timestamps: true 
});

// Hook لتشفير كلمة المرور قبل الحفظ
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// دالة لمقارنة كلمة المرور
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
