import { TURNOS } from "./constants";

export function formatearTurno(servicio, duracion, funcion) {
  if (!servicio) return null;
  let turno = servicio;         
  if (duracion) turno += duracion;
  if (funcion.length) turno += " (" + funcion.join(", ") + ") ";  
  return turno;      
}

const ORDEN_JORNADA = ["M", "T", "N"];
export function filtrarOpcionesTurnos(turneroFecha) {  
  if (!turneroFecha) return {};
  return Object.keys(turneroFecha)
    .filter(t => TURNOS[t])
    .sort((a, b) => ORDEN_JORNADA.indexOf(TURNOS[a].jornada) - ORDEN_JORNADA.indexOf(TURNOS[b].jornada));
}