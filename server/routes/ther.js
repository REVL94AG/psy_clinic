// routes/ther.js

const express = require('express');
const router = express.Router();

// استيراد الدوال من ملف الكنترولر
// لاحظ كيف قمنا بتحديث السطر التالي ليشمل الدالة الجديدة
const { getTherapists, createTherapist } = require('../controllers/ther.js');

// تعريف المسارات

// GET /api/ther/  (موجود لديك بالفعل)
router.get('/', getTherapists);

// POST /api/ther/ (هذا هو المسار الجديد)
router.post('/', createTherapist); // <--- أضف هذا السطر

// تصدير الراوتر
module.exports = router;