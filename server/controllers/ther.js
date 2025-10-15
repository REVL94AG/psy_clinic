// controllers/ther.js

// بيانات وهمية (مؤقتة)
const therapists = [
    {
        id: 1,
        name: "د. أحمد محمود",
        specialty: "معالج نفسي إكلينيكي"
    },
    {
        id: 2,
        name: "د. فاطمة الزهراء",
        specialty: "استشاري علاقات أسرية"
    }
];

// --- دالة جلب جميع المعالجين (موجودة لديك بالفعل) ---
// GET /api/ther/
const getTherapists = (req, res) => {
    res.status(200).json(therapists);
};


// --- دالة إنشاء معالج جديد (هذه هي الدالة الجديدة) ---
// POST /api/ther/
const createTherapist = (req, res) => {
    // 1. استخراج البيانات من جسم الطلب
    const { name, specialty } = req.body;

    // 2. تحقق بسيط من وجود البيانات
    if (!name || !specialty) {
        return res.status(400).json({ message: "الرجاء إدخال الاسم والتخصص" });
    }

    // 3. إنشاء كائن المعالج الجديد
    const newTherapist = {
        id: therapists.length + 1, // طريقة بسيطة لإنشاء ID فريد (مؤقتاً)
        name: name,
        specialty: specialty
    };

    // 4. إضافة المعالج الجديد إلى المصفوفة
    therapists.push(newTherapist);

    // 5. إرجاع رسالة نجاح مع المعالج الجديد الذي تم إنشاؤه
    res.status(201).json(newTherapist);
};


// --- تصدير الدوال ---
// لا تنسَ إضافة الدالة الجديدة هنا!
module.exports = {
    getTherapists,
    createTherapist // <--- أضف هذا
};