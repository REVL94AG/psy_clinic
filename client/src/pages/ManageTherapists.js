// client/src/pages/ManageTherapists.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageTherapists = () => {
    const [therapists, setTherapists] = useState([]);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true); // حالة تحميل خاصة بالصفحة

    // دالة لجلب المعالجين
    const fetchTherapists = async () => {
        try {
            const res = await axios.get('/api/ther');
            setTherapists(res.data);
        } catch (err) {
            console.error("Error fetching therapists:", err); // طباعة الخطأ في الكونسول للمساعدة
            setError('فشل في جلب قائمة المعالجين. قد لا تكون لديك الصلاحية.');
        } finally {
            // --- هذا هو الجزء الأهم ---
            // تأكد من أن التحميل يتوقف دائمًا، سواء نجح الطلب أو فشل
            setLoading(false);
        }
    };

    // جلب المعالجين عند تحميل الصفحة لأول مرة
    useEffect(() => {
        fetchTherapists();
    }, []);

    // دالة لإضافة معالج جديد
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!name || !specialty) {
            setError('الرجاء ملء جميع الحقول.');
            return;
        }

        try {
            await axios.post('/api/ther', { name, specialty });
            setMessage('تمت إضافة المعالج بنجاح!');
            setName('');
            setSpecialty('');
            await fetchTherapists(); // إعادة تحميل القائمة بعد الإضافة
        } catch (err) {
            console.error("Error adding therapist:", err);
            setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة المعالج.');
        }
    };

    // دالة الحذف
    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المعالج؟')) {
            try {
                await axios.delete(`/api/ther/${id}`);
                setMessage('تم حذف المعالج بنجاح.');
                await fetchTherapists(); // إعادة تحميل القائمة بعد الحذف
            } catch (err) {
                console.error("Error deleting therapist:", err);
                setError(err.response?.data?.message || 'حدث خطأ أثناء الحذف.');
            }
        }
    };

    // --- هذا الجزء يعالج عرض المحتوى ---
    // 1. إذا كانت الصفحة لا تزال في حالة تحميل، أظهر مؤشر التحميل
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    // 2. بعد انتهاء التحميل، اعرض المحتوى
    return (
        <Box sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>إدارة المعالجين</Typography>
            
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6">إضافة معالج جديد</Typography>
                <TextField label="اسم المعالج" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="التخصص" fullWidth margin="normal" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>إضافة</Button>
            </Paper>
            
            {/* عرض رسائل الخطأ والنجاح هنا */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            <Typography variant="h5" gutterBottom>قائمة المعالجين الحاليين</Typography>
            <List>
                {therapists.length > 0 ? therapists.map(therapist => (
                    <ListItem 
                        key={therapist._id} 
                        divider
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(therapist._id)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={therapist.name} secondary={therapist.specialty} />
                    </ListItem>
                )) : (
                    <Typography>لا يوجد معالجين حالياً.</Typography>
                )}
            </List>
        </Box>
    );
};

export default ManageTherapists;
