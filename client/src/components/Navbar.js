// client/src/components/Navbar.js

import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';

function Navbar() {
  // استدعاء المتغيرات الجديدة من السياق
  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderAuthButtons = () => {
    // أثناء التحقق من التوكن، لا تظهر شيئًا أو أظهر مؤشر تحميل
    if (loading) {
      return <CircularProgress size={24} color="inherit" />;
    }

    // إذا كان المستخدم مسجلاً دخوله
    if (isAuthenticated && user) {
      return (
        <>
          {/* عرض اسم المستخدم ورابط لملفه الشخصي */}
          <Button color="inherit" component={RouterLink} to="/profile">
            مرحباً، {user.name}
          </Button>

          {/* === هذا هو الجزء الأهم: إظهار الرابط فقط إذا كان المستخدم أدمن === */}
          {user.role === 'admin' && (
            <Button color="inherit" component={RouterLink} to="/manage-therapists">
              إدارة المعالجين
            </Button>
          )}

          <Button color="inherit" onClick={handleLogout}>تسجيل الخروج</Button>
        </>
      );
    }

    // إذا لم يكن مسجلاً دخوله
    return (
      <>
        <Button color="inherit" component={RouterLink} to="/login">تسجيل الدخول</Button>
        <Button color="inherit" component={RouterLink} to="/register">تسجيل جديد</Button>
      </>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          عيادتي النفسية
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button color="inherit" component={RouterLink} to="/therapists">المعالجين</Button>
          {renderAuthButtons()}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;