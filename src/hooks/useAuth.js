import { useContext } from 'react';
import { AuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) 
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  
  const { autenticado, usuario, loading, login, logout, actualizarUsuario, recordarContrasena, cambiarContrasena } = context;
  const esAutenticado = !!usuario; // boolean

  return { autenticado, esAutenticado, usuario, loading, login, logout, actualizarUsuario, recordarContrasena, cambiarContrasena };
};
