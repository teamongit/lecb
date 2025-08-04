export function formatearTurno(jornada, tipo, funcion) {
  let turno = jornada;
  // imaginaria
  if (funcion == "i") turno = "i" + turno;
  // noche
  if (jornada == "N") {
    if (funcion == "Sup") turno += "Sup";
    if (funcion == "A2") turno += "A2";
    return turno;       
  }
  // supervisor
  if (funcion == "Sup") return turno + "Sup";
  // duraciones
  if (tipo == "c") turno += "c";
  if (tipo == "L") turno += "L";
  // instruccion
  if (funcion == "A2") turno += "A2";            
  
  return turno;      
}