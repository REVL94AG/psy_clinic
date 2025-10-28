// src/pages/RegisterPage.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// استيراد مكونات MUI
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', // <-- حقل جديد
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. إرسال البيانات إلى مسار التسجيل الجديد
      const { data } = await axios.post('/api/auth/register', formData);

      // 2. بعد التسجيل الناجح، قم بتسجيل دخول المستخدم مباشرة
      login(data.token);

      // 3. إعادة توجيه المستخدم إلى الصفحة الرئيسية
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ ما. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          إنشاء حساب جديد
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          {/* حقل الاسم الجديد */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="الاسم الكامل"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="البريد الإلكتروني"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="كلمة المرور"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            تسجيل
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;