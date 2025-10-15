
// index.js

// --- Imports ---
const express = require('express');

// استيراد ملف المسارات الذي أنشأناه
const authRoutes = require('./routes/auth');


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


// --- Server Activation ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log('http://localhost:${PORT}');
});