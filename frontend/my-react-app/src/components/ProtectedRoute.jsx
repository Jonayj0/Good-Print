// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element }) => {
    const token = localStorage.getItem('token'); // Verifica si el token existe
    const expirationTime = localStorage.getItem('tokenExpiration'); // Tiempo de expiración del token

    // Verifica si el token existe y si no ha expirado
    const isAuthenticated = token && Date.now() < expirationTime;

    // Si está autenticado, renderiza el componente, de lo contrario redirige a login
    return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;



