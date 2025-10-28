// client/src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div>جاري التحميل...</div>; // أو أي مؤشر تحميل
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;