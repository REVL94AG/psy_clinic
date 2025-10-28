// client/src/pages/ManageTherapists.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const ManageTherapists = () => {
    const [therapists, setTherapists] = useState([]);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useContext(AuthContext);

    // دالة لجلب المعالجين
    const fetchTherapists = async () => {
        try {
            const res = await axios.get('/api/ther');
            setTherapists(res.data);
        } catch (err) {
            setError('فشل في جلب قائمة المعالجين.');
        }
    };

    // جلب المعالجين عند تحميل الصفحة
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
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            const body = JSON.stringify({ name, specialty });
            await axios.post('/api/ther', body, config);
            
            setMessage('تمت إضافة المعالج بنجاح!');
            setName('');
            setSpecialty('');
            fetchTherapists(); // إعادة تحميل القائمة
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة المعالج.');
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>إدارة المعالجين</Typography>
            
            {/* نموذج إضافة معالج جديد */}
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6">إضافة معالج جديد</Typography>
                <TextField
                    label="اسم المعالج"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="التخصص"
                    fullWidth
                    margin="normal"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                />
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>}
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>إضافة</Button>
            </Paper>

            {/* قائمة المعالجين */}
            <Typography variant="h5" gutterBottom>قائمة المعالجين الحاليين</Typography>
            <List>
                {therapists.length > 0 ? therapists.map(therapist => (
                    <ListItem key={therapist._id} divider>
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
