import { createContext, useContext, useMemo } from "react";
import { usePublicaciones } from "../hooks/usePublicaciones";

const PublicacionesContext = createContext(null);

export const PublicacionesProvider = ({ children }) => {
  const publicacionesHook = usePublicaciones();

  const value = useMemo(() => publicacionesHook, [publicacionesHook]);

  return (
    <PublicacionesContext.Provider value={value}>
      {children}
    </PublicacionesContext.Provider>
  );
};

export const usePublicacionesContext = () => {
  const context = useContext(PublicacionesContext);
  if (!context) {
    throw new Error("usePublicacionesContext debe usarse dentro de PublicacionesProvider");
  }
  return context;
};