import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import "../style/login.css"; // Asegúrate de importar el CSS
import { Context } from '../store/AppContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para manejar errores
    const { actions } = useContext(Context); // Obtén las acciones del context
    const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await actions.login(email, password); // Llama a la acción login

        if (result.success) {
            navigate('/admin/products'); // Redirige a la ruta protegida
        } else {
            setError(result.message || 'Error en el inicio de sesión');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Iniciar Sesión</h1>
            <form onSubmit={handleLogin}> {/* Cambia handleSubmit a handleLogin */}
                <input
                    type="text"
                    placeholder="Email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input type="submit" value="Iniciar Sesión" className="login-button" />
                {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error */}
            </form>
        </div>
    );
};

export default Login;

