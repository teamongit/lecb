import { esMismaFecha } from "./fechas";


export function esDuplicado(publicaciones, nuevaPub) {
  return publicaciones.some(pub => 
    pub.tipo === nuevaPub.tipo &&
    pub.nombre === nuevaPub.nombre &&
    pub.turno === nuevaPub.turno && 
    pub.modalidad === nuevaPub.modalidad &&
    esMismaFecha(pub.fecha, nuevaPub.fecha)
  );
}

function tienenDuplicados(arr1, arr2) {
  const set1 = new Set(arr1);
  return arr2.some(valor => set1.has(valor));
}



export function esMatch(nuevaPub, pub) {

  // Estado publicado
  const esPublicado = pub.estado === "publicado";
  if (!esPublicado) return false;
  
  // Nucleo compatible
  const mismoNucleo = nuevaPub.nucleo.includes("RUTA") 
    ? pub.nucleo.includes("RUTA")     // nuevaPub y pub son RUTA
    : nuevaPub.nucleo === pub.nucleo; // nuevaPub y pub son TMA
  if (!mismoNucleo) return false;
   
  // Modalidad compatible
  const mismaModalidad = nuevaPub.modalidad.some(m => pub.modalidad.includes(m));
  if (!mismaModalidad) return false;
  
  // Fecha compatible
  if (!esMismaFecha(nuevaPub.fecha, pub.fecha)) return false;
  
    
  // Funcion compatible
  const funcionCompatible = !pub.funcion.length || tienenDuplicados(nuevaPub.funcion, pub.funcion);
  if (!funcionCompatible) return false;
  
  // Descartar compatibilidad segun tipo de publicacion
  // Servicio compatible
  const mismoServicio = nuevaPub.servicio === pub.servicio;
  if (!mismoServicio) return false;
  
  // Si es de noche, comparar el nucleo               
  const esNoche = nuevaPub.servicio === "N";
  if (esNoche) {
    const mismoNucleo = nuevaPub.nucleo === pub.nucleo;
    if (!mismoNucleo) return false;
  }
  // Duracion compatible
  const duracionCompatible = pub.duracion === "Cualquiera" || nuevaPub.duracion === "Cualquiera" || nuevaPub.duracion === pub.duracion;
  if (!duracionCompatible) return false;
  
  if (nuevaPub.tipo === "quitar") {
    // Tipo compatible
    const tipoCompatible = pub.tipo === "hacer"; // tipo contrario
    if (!tipoCompatible) return false;
  
  }  

  // Descartar compatibilidad segun tipo de publicacion
  if (nuevaPub.tipo === "hacer") {   
    // Tipo compatible
    const tipoCompatible = pub.tipo === "quitar"; // tipo contrario
    if (!tipoCompatible) return false;
  
  }  
  // Es match
  
  return true;
}

// Añadir candidatos que hacen match con la nueva publicacion
export function anadirCandidatos(pubsMatch, nuevaPub) {
  nuevaPub.candidatos = pubsMatch.map(pubMatch => ({
    // Objeto candidato
    nombre: pubMatch.nombre,
    apodo:  pubMatch.apodo,
    equipo: pubMatch.equipo,
    nucleo: pubMatch.nucleo,      
    pubId:  pubMatch.id,
    asignado: false,
  }));
}