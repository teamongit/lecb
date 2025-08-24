// hooks/useTurnos.js
import { useTurnosContext } from "../context/TurnosProvider";

export const useTurnos = () => {
  const context = useTurnosContext();

  if (!context)
    throw new Error("useTurnos debe usarse dentro de un TurnosProvider");

  const { turnos, loading, turneros, cambiarTurno } = context;
  const tieneTurnos = !!turnos;

  return {
    turnos,
    tieneTurnos,
    loading,
    turneros,
    cambiarTurno,
  };
};
