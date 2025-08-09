// day: numeric, 2-digit
// month: numeric, 2-digit, long, short, narrow
// year: numeric, 2-digit
export function formatearFecha(fechaEntrada, formato = {}) {
  if (!fechaEntrada) return "";

  // Caso ISO actual
  if (formato === "ISO" && typeof fechaEntrada === "string") {
    return fechaEntrada;
  }

  let fecha;
  if (fechaEntrada && typeof fechaEntrada.toDate === "function") {
    fecha = fechaEntrada.toDate();
  } else if (typeof fechaEntrada === "string") {
    const [y, m, d] = fechaEntrada.split("-").map(Number);
    fecha = new Date(y, m - 1, d);
  } else if (fechaEntrada instanceof Date) {
    fecha = fechaEntrada;
  } else {
    return "";
  }

  // Nuevo caso AAAA-MM-DD
  if (formato === "AAAA-MM-DD") {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }

  return fecha.toLocaleDateString("es-ES", { timeZone: "Europe/Madrid", ...formato });
}




// Comparar dos objetos Timestamp
// convertir a fecha y luego milisegundos
export const esMismaFecha = (a, b) => a.toDate().getTime() === b.toDate().getTime();

export function horasMinutos(decimal) {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${horas}:${minutos.toString().padStart(2, '0')}`;
}