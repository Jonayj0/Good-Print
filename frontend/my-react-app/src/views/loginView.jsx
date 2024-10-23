// src/views/LoginView.jsx
import React from 'react';
import Login from '../components/login'; // Asegúrate de que la ruta sea correcta

const LoginView = () => {
    return (
        <div className='container login-view'>
            <h1>Iniciar Sesión</h1>
            <Login />
        </div>
    );
};

export default LoginView;
