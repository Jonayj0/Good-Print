// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element }) => {
    const isAuthenticated = localStorage.getItem('token'); // Verifica si el token existe

    // Si está autenticado, renderiza el componente, de lo contrario redirige a login
    return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;


