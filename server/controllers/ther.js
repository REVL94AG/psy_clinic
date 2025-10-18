// controllers/ther.js

// استخدم "let" بدلاً من "const" للسماح لنا بتعديل المصفوفة بعد الحذف
let therapists = [
    { id: 1, name: "د. أحمد محمود", specialty: "معالج نفسي إكلينيكي" },
    { id: 2, name: "د. فاطمة الزهراء", specialty: "استشاري علاقات أسرية" }
];

// --- 1. جلب جميع المعالجين ---
const getTherapists = (req, res) => {
    res.status(200).json(therapists);
};

// --- 2. إنشاء معالج جديد ---
const createTherapist = (req, res) => {
    const { name, specialty } = req.body;
    if (!name || !specialty) {
        return res.status(400).json({ message: "الرجاء إدخال الاسم والتخصص" });
    }
    const newTherapist = { id: therapists.length + 1, name, specialty };
    therapists.push(newTherapist);
    res.status(201).json(newTherapist);
};

// --- 3. جلب معالج واحد بواسطة ID ---
const getTherapistById = (req, res) => {
    const therapistId = parseInt(req.params.id);
    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) {
        return res.status(404).json({ message: "المعالج غير موجود" });
    }
    res.status(200).json(therapist);
};

// --- 4. تحديث بيانات معالج ---
const updateTherapist = (req, res) => {
    const therapistId = parseInt(req.params.id);
    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist) {
        return res.status(404).json({ message: "المعالج غير موجود" });
    }
    const { name, specialty } = req.body;
    therapist.name = name || therapist.name;
    therapist.specialty = specialty || therapist.specialty;
    res.status(200).json(therapist);
};

// --- 5. حذف معالج (هذه هي الدالة الجديدة) ---
// DELETE /api/therapists/:id
const deleteTherapist = (req, res) => {
    const therapistId = parseInt(req.params.id);
    // نستخدم findIndex للعثور على موقع المعالج في المصفوفة
    const therapistIndex = therapists.findIndex(t => t.id === therapistId);

    // إذا لم يتم العثور عليه، فإن findIndex ترجع -1
    if (therapistIndex === -1) {
        return res.status(404).json({ message: "المعالج غير موجود" });
    }

    // استخدم splice لإزالة عنصر واحد من المصفوفة في الموقع المحدد
    therapists.splice(therapistIndex, 1);

    // أرجع رسالة نجاح
    res.status(200).json({ message: "تم حذف المعالج بنجاح" });
};

// --- تحديث قائمة التصدير ---
module.exports = {
    getTherapists,
    createTherapist,
    getTherapistById,
    updateTherapist,
    deleteTherapist // <--- إضافة الدالة الجديدة
};