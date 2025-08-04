import { esMismaFecha } from "./fechas";

export function esDuplicado(publicaciones, nuevaPub) {
  return publicaciones.some(pub => 
    pub.nombre === nuevaPub.nombre &&
    pub.modalidad === nuevaPub.modalidad &&
    pub.ofrece.turno === nuevaPub.ofrece.turno &&
    esMismaFecha(pub.fecha, nuevaPub.fecha)
  );
}

export function esMatch(pub, nuevaPub) {
  const esPublicado    = pub.estado === "publicado";
  const mismaModalidad = pub.modalidad === nuevaPub.modalidad;        
  const mismaJornada   = pub.ofrece.jornada === nuevaPub.solicita.jornada;
  // Si es de noche, comparar el nucleo               
  const esNoche = pub.jornada === "N";
  if (esNoche) {
    const mismoNucleo = pub.nucleo === nuevaPub.nucleo;
    return (esPublicado && esMismaFecha(pub.fecha, nuevaPub.fecha) && mismaModalidad && mismaJornada && mismoNucleo);
  }
  // Si es de dia, no comparar el nucleo
  return (esPublicado && esMismaFecha(pub.fecha, nuevaPub.fecha) && mismaModalidad && mismaJornada);
}

// Añadir candidatos que hacen match con la nueva publicacion
export function anadirCandidatos(pubsMatch, nuevaPub) {
  nuevaPub.candidatos = pubsMatch.map(pubMatch => ({
    // Objeto candidato
    nombre: pubMatch.nombre,
    apodo:  pubMatch.apodo,
    equipo: pubMatch.equipo,
    nucleo: pubMatch.nucleo,
    turno:  pubMatch.ofrece.turno, 
    pubId:  pubMatch.id,
    asignado: false,
  }));
}