export function formatearServicio(jornada, tipo, funcion, userLado) {
  let servicio = jornada;
  // imaginaria
  if (funcion == "i") servicio = "i" + servicio;
  // noche
  if (jornada == "N") {
    if (funcion == "Sup") servicio += "Sup";
    if (funcion == "A2") servicio += "A2";
    return servicio + userLado;       
  }
  // supervisor
  if (funcion == "Sup") return servicio + "Sup" + userLado;
  // duraciones
  if (tipo == "c") servicio += "c";
  if (tipo == "L") servicio += "L";
  // instruccion
  if (funcion == "A2") servicio += "A2";            
  
  return servicio;      
}