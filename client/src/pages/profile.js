import React, { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6" color="error" align="center">لم يتم العثور على بيانات المستخدم.</Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>ملفي الشخصي</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}><strong>الاسم:</strong> {user.name}</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}><strong>البريد الإلكتروني:</strong> {user.email}</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}><strong>الصلاحية:</strong> {user.role === 'admin' ? 'مدير' : 'مستخدم'}</Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
