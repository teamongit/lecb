// routes/AuthGuard.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthGuard = ({ allowedRoles = [] }) => {
  const { user, userData, loading } = useAuth();

  if (loading) 
    return <LoadingSpinner centered />;

  if (!user || !userData) 
    return <Navigate to="/login" replace />;

  // Si no hay roles definidos o el usuario tiene acceso
  const authorized = userData?.rol?.some(role => allowedRoles.includes(role));

  if (!authorized) 
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default AuthGuard;