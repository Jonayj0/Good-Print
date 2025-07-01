// src/views/LoginView.jsx
import React, { useState, useEffect } from 'react';
import Login from '../components/login';
import SplitText from '../components/SplitText';
import homeImagen from '../assets/HomeImagen.jpeg';

const LoginView = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="login-page">
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="login-overlay">
        <div className="login-header">
          <SplitText text="Good Print" delay={50} />
        </div>

        <div className="login-box">
          <Login />
        </div>
      </div>

      <div className="login-bg" style={{ backgroundImage: `url(${homeImagen})` }} />
    </div>
  );
};

export default LoginView;


