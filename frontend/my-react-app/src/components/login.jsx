import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../style/login.css"; // Asegúrate de importar el CSS
import { Context } from "../store/AppContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para manejar errores
  const { actions } = useContext(Context); // Obtén las acciones del context
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await actions.login(email, password); // Llama a la acción login

    if (result.success) {
      navigate("/admin/products"); // Redirige a la ruta protegida
    } else {
      setError(result.message || "Error en el inicio de sesión");
    }
  };

  return (
    <div className="gpl-login-container">
  <h1 className="gpl-login-title">Administrador</h1>
  <form onSubmit={handleLogin}>
    <input
      type="text"
      placeholder="Email"
      className="gpl-login-input"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <div className="gpl-password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Contraseña"
        className="gpl-login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="button"
        className="gpl-toggle-password"
        onClick={() => setShowPassword(!showPassword)}
        aria-label="Mostrar u ocultar contraseña"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
    <input type="submit" value="Iniciar Sesión" className="gpl-login-button" />
    {error && <p className="gpl-error-message">{error}</p>}
  </form>
</div>

  );
};

export default Login;
