// ProtectedRoute.jsx final
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const expirationTime = localStorage.getItem('tokenExpiration');
  const isAuthenticated = token && Date.now() < Number(expirationTime);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;





