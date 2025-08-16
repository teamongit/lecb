// day: numeric, 2-digit
// weekday: long, short
// month: numeric, 2-digit, long, short, narrow
// year: numeric, 2-digit
export function formatearFecha(entrada, formato = {}) {
  if (!entrada) return "";

  let salida;
  // Caso: Timestamp to Date
  if (entrada && typeof entrada.toDate === "function") {
    salida = entrada.toDate();
  // Caso: String  
  } else if (typeof entrada === "string") {
    const [y, m, d] = entrada.split("-").map(Number);
    salida = new Date(y, m - 1, d);
  } else if (entrada instanceof Date) {
    salida = entrada;
  } else {
    return "";
  }  

  // Nuevo caso AAAA-MM-DD
  if (formato === "aaaa-mm-dd") {
    const año = salida.getFullYear();
    const mes = String(salida.getMonth() + 1).padStart(2, "0");
    const dia = String(salida.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }

  return salida.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid", ...formato });
}




// Comparar dos objetos Timestamp
// convertir a salida y luego milisegundos
export const esMismaFecha = (a, b) => a.toDate().getTime() === b.toDate().getTime();
// Si queremos comparar solo el dia, ignorando hora 
// export const esMismaFecha = (a, b) => {
//   const fa = a.toDate();
//   const fb = b.toDate();
//   return (
//     fa.getFullYear() === fb.getFullYear() &&
//     fa.getMonth() === fb.getMonth() &&
//     fa.getDate() === fb.getDate()
//   );
// };
export function horasMinutos(decimal) {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${horas}:${minutos.toString().padStart(2, '0')}`;
}