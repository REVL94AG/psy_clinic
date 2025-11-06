import React from 'react';
import ReactDOM from 'react-dom/client';
import './base.css';
import App from './app';
import { AuthProvider } from './context/auth';
import './theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
