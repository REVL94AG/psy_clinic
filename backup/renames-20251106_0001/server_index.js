// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http' );
const { Server } = require("socket.io");

// استيراد ملفات المسارات بالأسماء الصحيحة
const authRoutes = require('./routes/auth.js');
const therRoutes = require('./routes/ther.js');
// --- هذا هو السطر الذي تم تصحيحه نهائيًا ---
const appointmentRoutes = require('./routes/appointmentRoutes.js'); 

// --- Load Env Vars ---
dotenv.config();

// --- App Initialization ---
const app = express();
const server = http.createServer(app );

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
} );

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/ther', therRoutes);
// --- هذا هو السطر الذي تم تصحيحه نهائيًا ---
app.use('/api/appointments', appointmentRoutes);

// --- Socket.IO Connection Logic ---
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("call_user", (data) => {
        socket.to(data.room).emit("call_incoming", { signal: data.signal, from: socket.id });
        console.log(`User ${socket.id} is calling user in room ${data.room}`);
    });

    socket.on("answer_call", (data) => {
        socket.to(data.to).emit("call_accepted", data.signal);
        console.log(`User ${socket.id} answered call from ${data.to}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// --- Server Activation ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}` );
});
