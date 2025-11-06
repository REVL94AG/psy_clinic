import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Box, Button } from '@mui/material';

const HeroSection = () => (
    <Box className="hero-section">
        <Typography variant="h3" component="h1" className="hero-title">خطوتك الأولى نحو حياة أفضل</Typography>
        <Typography variant="h6" component="p" className="hero-subtitle">نحن هنا لنستمع إليك ونساعدك على إيجاد الطريق. تصفح قائمة المعالجين المتخصصين واختر من يناسبك لبدء رحلتك نحو التعافي.</Typography>
    </Box>
);

function Ther() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const { data } = await axios.get('/api/ther');
        setTherapists(data);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error);
      } finally { setLoading(false); }
    };
    fetchTherapists();
  }, []);

  if (loading) return (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress/></Box>);

  return (
    <Container sx={{ py: 4 }}>
      <HeroSection />
      <Grid container spacing={4}>
        {therapists.map(therapist => (
          <Grid item key={therapist._id} xs={12} sm={6} md={4}>
            <Card className="therapist-card" onClick={() => navigate(`/therapist/${therapist._id}`)} style={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>{therapist.name}</Typography>
                <Typography color="text.secondary">{therapist.specialty}</Typography>
                <Button variant="contained" sx={{ mt: 3, borderRadius: '20px', backgroundColor: 'var(--primary-color)' }}>عرض التفاصيل والحجز</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Ther;
