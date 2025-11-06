// client/src/components/Navbar.js

import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';

function Navbar() {
  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- 1. تحديد رابط الموقع التعليمي ---
  // !! مهم: قم بتغيير هذا الرابط إلى الرابط الفعلي للموقع التعليمي الخاص بك
  const educationalSiteUrl = 'http://localhost:3000'; 

  const handleLogout = ( ) => {
    logout();
    navigate('/login');
  };

  const renderAuthButtons = () => {
    if (loading) {
      return <CircularProgress size={24} color="inherit" />;
    }

    if (isAuthenticated && user) {
      return (
        <>
          <Button color="inherit" component={RouterLink} to="/my-appointments">
            مواعيدي
          </Button>

          <Button color="inherit" component={RouterLink} to="/profile">
            مرحباً، {user.name}
          </Button>

          {user.role === 'admin' && (
            <Button color="inherit" component={RouterLink} to="/manage-therapists">
              إدارة المعالجين
            </Button>
          )}

          <Button color="inherit" onClick={handleLogout}>تسجيل الخروج</Button>
        </>
      );
    }

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
          العيادة النفسية
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button color="inherit" component={RouterLink} to="/therapists">المعالجين</Button>
          
          {/* --- 2. إضافة الزر الجديد للموقع التعليمي --- */}
          {/* 
            - href: يحدد الرابط الخارجي
            - target="_blank": يفتح الرابط في نافذة جديدة
            - rel="noopener noreferrer": لأسباب أمنية عند فتح روابط خارجية
          */}
          <Button 
            color="inherit" 
            href={educationalSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            التدريب والتعليم
          </Button>
          
          {renderAuthButtons()}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
