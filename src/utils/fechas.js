export function formatearFecha(fechaEntrada, formato) {
  let fecha;

  // Convertir entrada a objeto Date
  if (fechaEntrada && typeof fechaEntrada.toDate === "function") {
    fecha = fechaEntrada.toDate(); // timestamp tipo Firestore
  } else if (typeof fechaEntrada === "string") {
    fecha = new Date(fechaEntrada + "T00:00:00"); // formato "YYYY-MM-DD"
  } else if (fechaEntrada instanceof Date) {
    fecha = fechaEntrada; // ya es Date
  } else {
    return "";
  }

  const opciones = {
    1: { day: "numeric" },
    2: { month: "numeric" },
    3: { year: "numeric" },
    4: { month: "long" },
    5: { day: "long" },
    6: { month: "long", year: "numeric" },
    7: { day: "numeric", weekday: "short" },
    8: { day: "numeric", weekday: "long", month: "short", year: "numeric" },
    iso: null // fallback
    
    
    // mesLargo: { month: "long" }, //mesLargo
    // mesAno: { month: "long", year: "numeric"}, //mesAno
    // numDia: { day: "numeric" }, //numDia
    // diaYNombreCorto: { day: "numeric", weekday: "short" }, //diaYNombreCorto
    // completo: { day: "numeric", weekday: "long", month: "short", year: "numeric" }, //completo
  };

  if (formato === "iso") {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}/${mes}/${dia}`;
  }

  if (formato === "AAAA-MM-DD") {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  const opcionesFormato = opciones[formato] || opciones.diaYNombreCorto;
  return fecha.toLocaleDateString("es-ES", opcionesFormato);
}
// Comparar dos objetos Timestamp
// convertir a fecha y luego milisegundos
export const esMismaFecha = (a, b) => a.toDate().getTime() === b.toDate().getTime();

