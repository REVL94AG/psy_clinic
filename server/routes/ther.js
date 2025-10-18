// routes/ther.js

const express = require('express');
const router = express.Router();

// استيراد جميع الدوال من ملف الكنترولر
const {
    getTherapists,
    createTherapist,
    getTherapistById,
    updateTherapist,
    deleteTherapist // <--- استيراد الدالة الجديدة
} = require('../controllers/ther.js');

// GET all therapists
router.get('/', getTherapists);

// POST a new therapist
router.post('/', createTherapist);

// GET a single therapist by ID
router.get('/:id', getTherapistById);

// PUT (update) a therapist by ID
router.put('/:id', updateTherapist);

// DELETE a therapist by ID (هذا هو المسار الجديد)
router.delete('/:id', deleteTherapist);

module.exports = router;