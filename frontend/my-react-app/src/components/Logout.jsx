import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/AppContext';
import "../style/logout.css"; // Asegúrate de importar el CSS

const Logout = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout(); // Llama a la acción de logout en flux
        navigate('/login'); // Redirige al usuario a la página de login
    };

    return (
        <button onClick={handleLogout} className='logout-button'>
            Logout
        </button>
    );
};

export default Logout;