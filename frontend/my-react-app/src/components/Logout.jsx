import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/logout.css"; // Asegúrate de importar el CSS

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        // Redirigir al admin al login
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className='logout-button'>
            Logout
        </button>
    );
};

export default Logout;