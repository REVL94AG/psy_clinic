// src/pages/TherPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. استيراد مكونات MUI الجديدة
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

function TherPage() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true); // حالة جديدة لتتبع التحميل

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const { data } = await axios.get('/api/ther');
        setTherapists(data);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error);
      } finally {
        setLoading(false); // إيقاف التحميل سواء نجح الطلب أو فشل
      }
    };

    fetchTherapists();
  }, []);

  // عرض مؤشر تحميل دائري أثناء جلب البيانات
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    // Container لتوسيط المحتوى وإضافة هوامش
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        اختر المعالج المناسب لك
      </Typography>
      
      {/* Grid لترتيب البطاقات بشكل شبكي */}
      <Grid container spacing={4}>
        {therapists.map(therapist => (
          // كل بطاقة تأخذ 4 أعمدة من 12 (أي 3 بطاقات في الصف على الشاشات المتوسطة)
          <Grid item key={therapist._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {therapist.name}
                </Typography>
                <Typography>
                  {therapist.specialty}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TherPage;