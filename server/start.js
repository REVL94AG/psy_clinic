const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http' );
const { Server } = require("socket.io");

const authRoutes = require('./routes/auth.js');
const therRoutes = require('./routes/ther.js');
const appointmentRoutes = require('./routes/appt.js');

dotenv.config();

const app = express();
const server = http.createServer(app );

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
} );

app.use(express.json());
app.use(cookieParser());

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

app.use('/api/auth', authRoutes);
app.use('/api/ther', therRoutes);
app.use('/api/appointments', appointmentRoutes);

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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}` ); });
