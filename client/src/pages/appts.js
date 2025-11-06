import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button, Paper } from '@mui/material';

const Appts = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !token) { setLoading(false); return; }
        const fetchAppointments = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}`, }, };
                const { data } = await axios.get('/api/appointments/my', config);
                setAppointments(data);
            } catch (err) { console.error("Error fetching appointments:", err); setError('فشل في جلب المواعيد. يرجى المحاولة مرة أخرى.'); }
            finally { setLoading(false); }
        };
        fetchAppointments();
    }, [user, token]);

    const handleStartSession = (appointmentId) => { navigate(`/session/${appointmentId}`); };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 800, margin: 'auto' }}>
            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                <Typography variant="h4" gutterBottom component="h1" sx={{ textAlign: 'center', mb: 3 }}>مواعيدي المحجوزة</Typography>
                {appointments.length > 0 ? (
                    <List>
                        {appointments.map(app => (
                            app && app.therapist && (
                                <ListItem key={app._id} divider sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', py: 2, gap: 2 }}>
                                    <ListItemText primary={`المعالج: ${app.therapist.name}`} secondary={`التاريخ: ${new Date(app.date).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}`} sx={{ mb: { xs: 2, sm: 0 }, textAlign: { xs: 'center', sm: 'right' }, flexGrow: 1 }} />
                                    <Button variant="contained" color="primary" onClick={() => handleStartSession(app._id)} sx={{ minWidth: '120px' }}>ابدأ الجلسة</Button>
                                </ListItem>
                            )
                        ))}
                    </List>
                ) : (
                    <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>لا يوجد لديك مواعيد محجوزة حالياً.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Appts;
