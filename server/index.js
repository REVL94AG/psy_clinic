
// index.js

// --- Imports ---
const express = require('express');

// استيراد مسارات المصادقة
const authRoutes = require('./routes/auth');
// استيراد مسارات المعالجين
const therRoutes = require('./routes/ther'); // <--- هذا السطر الجديد

// --- App Initialization ---
const app = express();

// --- Middleware ---
// هذا السطر ضروري جدًا ليتمكن Express من فهم بيانات JSON القادمة في جسم الطلب (req.body)
app.use(express.json());

// --- Routes ---
// نقطة نهاية أساسية للترحيب للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('<h1>الخادم يعمل بنجاح!</h1>');
});

// أي طلب يبدأ بـ /api/auth سيتم توجيهه إلى ملف authRoutes
app.use('/api/auth', authRoutes);

// أي طلب يبدأ بـ /api/ther سيتم توجيهه إلى ملف therRoutes
app.use('/api/ther', therRoutes); // <--- وهذا السطر الجديد

// --- Server Activation ---
const PORT = 5000; // تأكد من أن البورت 5000 وليس 3000 كما ذكرت سابقاً
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}');
});