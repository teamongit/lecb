export function formatearTurno(servicio, duracion, funcion) {
  // let turno = servicio;
  // // imaginaria
  // if (funcion == "Img") turno = "i" + turno;
  // // noche
  // if (servicio == "N") {
  //   if (funcion == "Sup") turno += "Sup";
  //   if (funcion == "Ins") turno += "A2";
  //   return turno;       
  // }
  // // supervisor
  // if (funcion == "Sup") return turno + "Sup";
  // // duraciones
  // if (tipo == "c") turno += "c";
  // if (tipo == "l") turno += "l";
  // // instruccion
  // if (funcion == "A2") turno += "A2";            
  
  // return turno;      

  // let turno = servicio;
  // if (funcion.includes("Imaginaria")) turno = "i" + turno;
  // if (servicio == "N") {
  //   if (funcion.includes("Supervisor")) turno += "Sup";
  //   if (funcion.includes("Instructor")) turno += "A2";
  //   return turno;       
  // }
  // // supervisor
  // if (funcion.includes("Supervisor")) return turno + "Sup";
  
  // if (duracion !== "Cualquiera") {
  //   if (duracion === "Corta") turno += "c";
  //   else if (duracion === "Larga") turno += "l";
  // }
  // // instruccion
  // if (funcion.includes("Instructor")) turno += "A2";
  if (!servicio) return null;
  let turno = servicio;         
  if (duracion) turno += " (" + duracion + ") ";
  if (funcion.length) turno += " (" + funcion.join(", ") + ") ";  
  return turno;      
}