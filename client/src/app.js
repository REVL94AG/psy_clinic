import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/nav';
import Guard from './components/guard';
import Ther from './pages/ther';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Manage from './pages/manage';
import Therd from './pages/therd';
import Appts from './pages/appts';
import Session from './pages/session';

function App() {
  return (
    <Router>
      <Nav />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Ther />} />
          <Route path="/therapists" element={<Ther />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/therapist/:id" element={<Guard><Therd /></Guard>} />
          <Route path="/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/manage-therapists" element={<Guard><Manage /></Guard>} />
          <Route path="/my-appointments" element={<Guard><Appts /></Guard>} />
          <Route path="/session/:appointmentId" element={<Guard><Session /></Guard>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
