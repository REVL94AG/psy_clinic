import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, CircularProgress, Alert, Button, ButtonGroup, Grid, Divider, Container } from '@mui/material';

const generateTimeSlots = (date) => {
    const slots = [];
    for (let i = 9; i <= 17; i++) {
        const slot = new Date(date);
        slot.setHours(i, 0, 0, 0);
        slots.push(slot);
    }
    return slots;
};

const Therd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [therapist, setTherapist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookedTimes, setBookedTimes] = useState([]);
    const [sessionType, setSessionType] = useState('video');

    const fetchTherapist = useCallback(async () => {
        try { const { data } = await axios.get(`/api/ther/${id}`); setTherapist(data); }
        catch (err) { setError('فشل في جلب بيانات المعالج.'); }
        finally { setLoading(false); }
    }, [id]);

    const fetchBookedTimes = useCallback(async (day) => {
        try {
            const dateString = day.toISOString().split('T')[0];
            const { data } = await axios.get(`/api/appointments/booked-times/${id}/${dateString}`);
            setBookedTimes(data.map(t => new Date(t).getTime()));
        } catch (err) { console.error("Failed to fetch booked times", err); }
    }, [id]);

    useEffect(() => { fetchTherapist(); }, [fetchTherapist]);
    useEffect(() => { fetchBookedTimes(selectedDay); }, [selectedDay, fetchBookedTimes]);

    const handleBooking = async () => {
        if (!selectedTime) { setError('الرجاء اختيار وقت الجلسة.'); return; }
        setError(''); setMessage('');
        try {
            await axios.post('/api/appointments', { therapistId: id, date: selectedTime, sessionType });
            setMessage('تم حجز موعدك بنجاح! سيتم توجيهك إلى صفحة مواعيدي.');
            setTimeout(() => navigate('/my-appointments'), 3000);
        } catch (err) { setError(err.response?.data?.message || 'حدث خطأ أثناء الحجز.'); }
    };

    const timeSlots = generateTimeSlots(selectedDay);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />;
    if (error && !therapist) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box className="booking-page-container">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>حجز موعد مع</Typography>
                    <Typography variant="h3" component="h2" sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{therapist?.name}</Typography>
                    <Typography variant="h6" color="text.secondary">{therapist?.specialty}</Typography>
                </Box>
                <Divider sx={{ mb: 4 }} />

                <Typography variant="h5" component="h3" className="booking-step-title">1. اختر اليوم</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Calendar onChange={(day) => { setSelectedDay(day); setSelectedTime(null); }} value={selectedDay} minDate={new Date()} />
                </Box>

                <Typography variant="h5" component="h3" className="booking-step-title">2. اختر الوقت المتاح</Typography>
                <Grid container spacing={1.5} sx={{ mb: 4 }}>
                    {timeSlots.map((time, index) => {
                        const isBooked = bookedTimes.includes(time.getTime());
                        const isSelected = selectedTime?.getTime() === time.getTime();
                        return (
                            <Grid item xs={4} sm={3} md={2} key={index}>
                                <Button fullWidth variant={isSelected ? 'contained' : 'outlined'} disabled={isBooked} onClick={() => setSelectedTime(time)} className="time-slot-button">
                                    {time.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}
                                </Button>
                            </Grid>
                        );
                    })}
                </Grid>

                <Typography variant="h5" component="h3" className="booking-step-title">3. اختر نوع الجلسة</Typography>
                <ButtonGroup variant="outlined" aria-label="session type group" sx={{ mb: 4 }}>
                    <Button onClick={() => setSessionType('video')} variant={sessionType === 'video' ? 'contained' : 'outlined'} sx={{ borderRadius: '20px 0 0 20px' }}>فيديو</Button>
                    <Button onClick={() => setSessionType('audio')} variant={sessionType === 'audio' ? 'contained' : 'outlined'}>صوت</Button>
                    <Button onClick={() => setSessionType('chat')} variant={sessionType === 'chat' ? 'contained' : 'outlined'} sx={{ borderRadius: '0 20px 20px 0' }}>شات</Button>
                </ButtonGroup>

                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}

                <Button variant="contained" size="large" onClick={handleBooking} disabled={!selectedTime} sx={{ mt: 2, width: '100%', py: 1.5, fontSize: '1.2rem', borderRadius: '10px', backgroundColor: 'var(--primary-color)' }}>
                    تأكيد الحجز
                </Button>
            </Box>
        </Container>
    );
};

export default Therd;
