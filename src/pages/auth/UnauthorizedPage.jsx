import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso no autorizado</h1>
      <p className="text-lg text-gray-700 mb-6">
        No tienes permisos para acceder a esta página.
      </p>
      <Link 
        to={ROUTES.DASHBOARD}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
