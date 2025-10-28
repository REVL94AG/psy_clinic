// src/pages/login.js

import React, { useState, useContext } from 'react'; // 1. استيراد useContext
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 2. استيراد السياق

import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 3. استخدام دالة login من السياق

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', formData);
      login(data.token); // 4. استدعاء دالة login من السياق لحفظ التوكن
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ ما.');
    }
  };
  
  // ... باقي الكود لم يتغير ...
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">تسجيل الدخول</Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="البريد الإلكتروني" name="email" value={formData.email} onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="password" label="كلمة المرور" type="password" id="password" value={formData.password} onChange={handleChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>دخول</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;