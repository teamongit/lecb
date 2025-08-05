// routes/AuthGuard.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import { ROUTES } from '../utils/constants';

const AuthGuard = ({ rolesPermitidos }) => {
  const { autenticado, usuario, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!autenticado || !usuario) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!usuario.rol.some(rol => rolesPermitidos.includes(rol))) {
    // Usuario sin permiso para la ruta
    return <Navigate to={ROUTES.NOAUTORIZADO} replace />;
  }
  // Usuario autenticado y con permisos
  return <Outlet />;
};

export default AuthGuard;