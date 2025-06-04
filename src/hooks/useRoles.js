import { useAuth } from './useAuth';

const useRoles = () => {
  const { userData } = useAuth();  
  const hasRequiredRoles = (allowedRoles = []) => {
    if (!userData || !userData.rol) return false;
    return allowedRoles.some(role => userData.rol.includes(role));
  };

  return { hasRequiredRoles };
};

export default useRoles;
