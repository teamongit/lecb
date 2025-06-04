import { useContext } from 'react';
import { AuthContext } from "../context/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  const { user, userData, login, logout, loading } = context;
  const isAuthenticated = !!user;

  return {
    user,
    userData,
    isAuthenticated,
    login,
    logout,
    loading,
  };
};
