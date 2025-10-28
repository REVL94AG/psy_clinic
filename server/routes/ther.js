// server/routes/ther.js

const express = require('express');
const router = express.Router();

const {
    getTherapists,
    createTherapist,
    getTherapistById,
    updateTherapist,
    deleteTherapist
} = require('../controllers/ther.js'); // تأكد من المسار الصحيح

// استيراد وسطاء الحماية والصلاحيات
const { protect } = require('../middleware/authMiddleware.js'); // تأكد من المسار الصحيح
const { authorize } = require('../middleware/authorize.js'); // <-- 1. استيراد الوسيط الجديد

// --- تعريف المسارات ---

// مسارات عامة (لأي زائر)
router.get('/', getTherapists);
router.get('/:id', getTherapistById);

// مسارات محمية للأدمن فقط
// الآن، يجب أن يكون المستخدم مسجلاً دخوله (protect) وأن يكون أدمن (authorize)
router.post('/', protect, authorize('admin'), createTherapist);
router.put('/:id', protect, authorize('admin'), updateTherapist);
router.delete('/:id', protect, authorize('admin'), deleteTherapist);

module.exports = router;
