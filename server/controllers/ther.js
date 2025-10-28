// controllers/ther.js

// --- 1. استيراد النموذج ---
const Therapist = require('../models/Therapist.js');

// --- 2. جلب جميع المعالجين من قاعدة البيانات ---
const getTherapists = async (req, res) => {
    try {
        const therapists = await Therapist.find(); // .find() بدون شروط تجلب كل شيء
        res.status(200).json(therapists);
    } catch (error) {
        res.status(500).json({ message: "خطأ في الخادم", error: error.message });
    }
};

// --- 3. إنشاء معالج جديد وحفظه في قاعدة البيانات ---
const createTherapist = async (req, res) => {
    const { name, specialty } = req.body;
    if (!name || !specialty) {
        return res.status(400).json({ message: "الرجاء إدخال الاسم والتخصص" });
    }
    try {
        const newTherapist = new Therapist({ name, specialty });
        await newTherapist.save(); // .save() لحفظ المستند الجديد
        res.status(201).json(newTherapist);
    } catch (error) {
        res.status(500).json({ message: "خطأ في الخادم", error: error.message });
    }
};

// --- 4. جلب معالج واحد بواسطة ID من قاعدة البيانات ---
const getTherapistById = async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.params.id); // .findById() للبحث بالـ ID
        if (!therapist) {
            return res.status(404).json({ message: "المعالج غير موجود" });
        }
        res.status(200).json(therapist);
    } catch (error) {
        res.status(500).json({ message: "خطأ في الخادم", error: error.message });
    }
};

// --- 5. تحديث بيانات معالج في قاعدة البيانات ---
const updateTherapist = async (req, res) => {
    try {
        const updatedTherapist = await Therapist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // {new: true} لإرجاع المستند بعد التحديث
        );
        if (!updatedTherapist) {
            return res.status(404).json({ message: "المعالج غير موجود" });
        }
        res.status(200).json(updatedTherapist);
    } catch (error) {
        res.status(500).json({ message: "خطأ في الخادم", error: error.message });
    }
};

// --- 6. حذف معالج من قاعدة البيانات ---
const deleteTherapist = async (req, res) => {
    try {
        const deletedTherapist = await Therapist.findByIdAndDelete(req.params.id);
        if (!deletedTherapist) {
            return res.status(404).json({ message: "المعالج غير موجود" });
        }
        res.status(200).json({ message: "تم حذف المعالج بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "خطأ في الخادم", error: error.message });
    }
};

// --- تصدير الدوال ---
module.exports = {
    getTherapists,
    createTherapist,
    getTherapistById,
    updateTherapist,
    deleteTherapist
};