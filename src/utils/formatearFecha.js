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
    mesLargo: { month: "long" },
    diaYNombreCorto: { day: "numeric", weekday: "short" },
    completo: { day: "numeric", weekday: "short", month: "short" },
    iso: null // se trata por separado
  };

  if (formato === "iso") {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}/${mes}/${dia}`;
  }

  const opcionesFormato = opciones[formato] || opciones.diaYNombreCorto;
  return fecha.toLocaleDateString("es-ES", opcionesFormato);
}
