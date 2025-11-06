// client/src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    // 1. إذا كان السياق لا يزال يتحقق من التوكن، أظهر مؤشر تحميل
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 2. إذا انتهى التحميل والمستخدم غير مسجل دخوله، أعد توجيهه لصفحة الدخول
    if (!isAuthenticated) {
        // نحفظ الصفحة التي كان يحاول الوصول إليها حتى نتمكن من إعادته إليها بعد تسجيل الدخول
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. إذا انتهى التحميل والمستخدم مسجل دخوله، اسمح له بالوصول إلى الصفحة المطلوبة
    return children;
};

export default ProtectedRoute;
