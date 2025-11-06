import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { AuthContext } from '../context/auth';

import { Box, Typography, Button, IconButton } from '@mui/material';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

const Session = () => {
    const { appointmentId } = useParams();
    const { user } = useContext(AuthContext);

    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io.connect("http://localhost:5000" );
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) { userVideo.current.srcObject = stream; }
        });
        socket.current.emit("join_room", appointmentId);
        socket.current.on("call_incoming", (data) => { setReceivingCall(true); setCaller(data.from); setCallerSignal(data.signal); });
        return () => { socket.current.disconnect(); if (stream) { stream.getTracks().forEach(track => track.stop()); } };
    }, [appointmentId, stream]);

    const callPeer = () => {
        const peer = new Peer({ initiator: true, trickle: false, stream: stream });
        peer.on("signal", (data) => { socket.current.emit("call_user", { room: appointmentId, signal: data, }); });
        peer.on("stream", (stream) => { if (partnerVideo.current) { partnerVideo.current.srcObject = stream; } });
        socket.current.on("call_accepted", (signal) => { setCallAccepted(true); peer.signal(signal); });
    };

    const acceptCall = () => {
        setCallAccepted(true); setReceivingCall(false);
        const peer = new Peer({ initiator: false, trickle: false, stream: stream });
        peer.on("signal", (data) => { socket.current.emit("answer_call", { signal: data, to: caller }); });
        peer.on("stream", (stream) => { partnerVideo.current.srcObject = stream; });
        peer.signal(callerSignal);
    };

    const toggleMic = () => { stream.getAudioTracks()[0].enabled = !micOn; setMicOn(!micOn); };
    const toggleVideo = () => { stream.getVideoTracks()[0].enabled = !videoOn; setVideoOn(!videoOn); };

    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>جلسة الفيديو</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                {stream && <video playsInline muted ref={userVideo} autoPlay style={{ width: "40%", borderRadius: '10px' }} />}
                {callAccepted && <video playsInline ref={partnerVideo} autoPlay style={{ width: "40%", borderRadius: '10px' }} />}
            </Box>
            <Box>
                {!callAccepted && !receivingCall && (<Button variant="contained" color="primary" onClick={callPeer}>بدء المكالمة</Button>)}
                {receivingCall && !callAccepted && (<Box><Typography>هناك مكالمة واردة...</Typography><Button variant="contained" color="success" onClick={acceptCall}>قبول</Button></Box>)}
            </Box>
            {callAccepted && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <IconButton onClick={toggleMic} color={micOn ? "primary" : "default"} sx={{ border: '1px solid' }}>{micOn ? <MicIcon /> : <MicOffIcon />}</IconButton>
                    <IconButton onClick={toggleVideo} color={videoOn ? "primary" : "default"} sx={{ border: '1px solid' }}>{videoOn ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
                    <IconButton onClick={() => window.location.reload()} color="error" sx={{ border: '1px solid' }}><CallEndIcon /></IconButton>
                </Box>
            )}
        </Box>
    );
};

export default Session;
