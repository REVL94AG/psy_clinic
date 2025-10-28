// index.js

// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // <-- 1. استيراد المكتبة الجديدة

// استيراد ملفات المسارات
const authRoutes = require('./routes/auth');
const therRoutes = require('./routes/ther');

// --- Load Env Vars ---
dotenv.config();

// --- App Initialization ---
const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cookieParser()); // <-- 2. استخدام المكتبة الجديدة

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

// --- Routes ---
app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});

app.use('/api/auth', authRoutes);
app.use('/api/ther', therRoutes);

// --- Server Activation ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});
