import { createContext, useContext } from "react";
import { usePublicaciones } from "../hooks/usePublicaciones";

const PublicacionesContext = createContext();

export const PublicacionesProvider = ({ children }) => {
  const publicacionesHook = usePublicaciones();

  return (
    <PublicacionesContext.Provider value={publicacionesHook}>
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