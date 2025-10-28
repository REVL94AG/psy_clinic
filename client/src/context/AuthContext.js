// client/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 1. اقرأ التوكن من localStorage عند بدء التشغيل
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                // 2. إذا وجد توكن، قم بتعيينه كـ header افتراضي لكل طلبات axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    // 3. جلب بيانات المستخدم باستخدام التوكن
                    const res = await axios.get('/api/auth/me'); 
                    setUser(res.data); // <-- هنا يتم تخزين بيانات المستخدم (بما في ذلك role)
                } catch (err) {
                    console.error("فشل التوكن، سيتم تسجيل الخروج", err);
                    // إذا فشل التوكن (منتهي الصلاحية مثلاً)، قم بإزالته
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            // 4. أوقف التحميل بعد الانتهاء من كل شيء
            setLoading(false);
        };

        fetchUser();
    }, [token]); // هذا التأثير يعمل فقط عند تغير التوكن

    // --- هذه هي الدالة التي كانت تسبب المشكلة ---
    // 5. دالة login المحدثة
    const login = (newToken) => {
        // عند تسجيل الدخول، فقط قم بتحديث التوكن في localStorage وفي الحالة
        // الـ useEffect أعلاه سيتولى الباقي (جلب المستخدم وتحديث الحالة)
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    // 6. دالة logout المحدثة
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // 7. القيمة التي سيتم توفيرها للتطبيق
    const value = {
        token,
        user,
        isAuthenticated: !!user, // المصادقة تعتمد على وجود كائن المستخدم وليس فقط التوكن
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
