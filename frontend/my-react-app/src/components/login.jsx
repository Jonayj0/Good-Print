import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import "../style/login.css"; // Asegúrate de importar el CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para manejar errores
    const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token); // Guarda el token
            navigate('/admin/products'); // Redirige usando navigate
        } else {
            setError('Error en el inicio de sesión.'); // Establecer el mensaje de error
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

