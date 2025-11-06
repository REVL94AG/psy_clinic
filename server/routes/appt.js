const express = require('express');
const router = express.Router();
const { createAppointment, getMyApointments, getBookedTimes } = require('../controllers/appt.js');
const { protect } = require('../middleware/guard.js');

router.post('/', protect, createAppointment);
router.get('/my', protect, getMyApointments);
router.get('/booked-times/:therapistId/:date', protect, getBookedTimes);

module.exports = router;
