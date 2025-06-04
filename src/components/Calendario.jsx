import { useDatosApps } from "../context/DatosAppsContext";

const Calendario = () => {
  const { data } = useDatosApps(); // Asegúrate de tener este contexto disponible
  const hoy = new Date();
  const meses = [];

  // Crear un mapa de publicaciones por fecha
  const publicaciones = data?.publicaciones?.filter(pub => pub.ofrece && pub.solicita.modalidad === "P6") || [];
  const publicacionesPorFecha = {};
  publicaciones.forEach(pub => {
    const fechaStr = new Date(pub.cuando).toISOString().split("T")[0];
    if (!publicacionesPorFecha[fechaStr]) publicacionesPorFecha[fechaStr] = [];
    publicacionesPorFecha[fechaStr].push(pub);
  });

  // Generar los 3 meses a partir de hoy
  for (let i = 0; i < 3; i++) {
    const mesFecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    const nombreMes = mesFecha.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const diasEnMes = new Date(mesFecha.getFullYear(), mesFecha.getMonth() + 1, 0).getDate();
    const primerDiaSemana = (mesFecha.getDay() + 6) % 7; // Ajuste para que la semana empiece en lunes

    const filas = [];
    let celdas = [];

    // Rellenar celdas vacías al principio
    for (let d = 0; d < primerDiaSemana; d++) {
      celdas.push(<td key={`empty-${d}`}></td>);
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(mesFecha.getFullYear(), mesFecha.getMonth(), dia);
      const fechaStr = fecha.toISOString().split("T")[0];
      const publicacionesDia = publicacionesPorFecha[fechaStr] || [];
      const esHoy = fecha.toDateString() === hoy.toDateString();

      celdas.push(
        <td key={dia} className={`position-relative p-1 ${esHoy ? "bg-warning-subtle" : ""}`} style={{ height: "80px", verticalAlign: "top" }}>
          {/* Fondo con número de día */}
          <div style={{
            position: "absolute",
            top: "2px",
            left: "4px",
            fontSize: "0.7em",
            opacity: 0.5,
            width: "100%",
            height: "100%"
          }}>
            {dia}
          </div>
          {/* Encima: texto con pub.ofrece.servicio (si hay) */}
          <div style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            paddingTop: "15px",
            fontSize: "0.8em"
          }}>
            {data.servicios["RUIZ PIÑERO JOSE MARIA"][fechaStr] 
              ? <div key={fechaStr}>{data.servicios["RUIZ PIÑERO JOSE MARIA"][fechaStr]}</div>
              : null
            }
          </div>
          <div style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            paddingTop: "15px",
            fontSize: "0.8em"
          }}>
            {publicacionesDia.length > 0 ? publicacionesDia.map(pub => (
              <div key={pub.id} className="bg-success-subtle">{pub.ofrece.servicio}</div>
            )) : null}
          </div>
        </td>
      );

      if ((celdas.length % 7 === 0) || dia === diasEnMes) {
        filas.push(<tr key={`fila-${dia}`}>{celdas}</tr>);
        celdas = [];
      }
    }

    meses.push(
      <div key={nombreMes} className="mb-4">
        <h4 className="bg-secondary text-white p-2 rounded">{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th><th>Dom</th>
            </tr>
          </thead>
          <tbody>
            {filas}
          </tbody>
        </table>
      </div>
    );
  }

  return <div>{meses}</div>;
};

export default Calendario;
