// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// استيراد المكونات والصفحات
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import TherPage from './pages/TherPage';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ManageTherapists from './pages/ManageTherapists';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          {/* --- المسارات العامة --- */}
          <Route path="/" element={<TherPage />} />
          <Route path="/therapists" element={<TherPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- المسار المحمي لملف المستخدم الشخصي --- */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* --- مسار إدارة المعالجين (بدون حماية مؤقتًا للاختبار) --- */}
          <Route path="/manage-therapists" element={<ManageTherapists />} />

        </Routes>
      </main>
    </Router>
  );
}

export default App;
