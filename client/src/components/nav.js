import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';

function Nav() {
  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

export default Nav;
