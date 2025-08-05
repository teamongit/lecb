export default function NoAutorizado() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso no autorizado</h1>
      <p className="text-lg text-gray-700 mb-6">
        No tienes permisos para acceder a esta página.
      </p>
    </div>
  );
}
