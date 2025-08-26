import { useState, useEffect } from "react";
import { formatearFecha } from "../src/utils/fechas";
import { COLORES_TURNOS, TURNOS } from "../src/utils/constants";
import { Button, Form, ListGroup } from "react-bootstrap";
import { useTurnos } from "../src/hooks/useTurnos";
function ListaAccionesDia({ fecha, turnos, cambiarTurno, onClose }) {
  
  const [mostrarSelect, setMostrarSelect] = useState(false);
  const [nuevoTurno, setNuevoTurno] = useState(turnos?.[fecha] || "");
  const {turneros} = useTurnos();
  
  const handleCambiarTurno = async () => {
    const { usuario } = useAuth();
    if (!nuevoTurno) return;
    await cambiarTurno(fecha, usuario.nombre, nuevoTurno); // actualizar estado + firestore
    onClose(); // cerrar menú
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-2 bg-primary-subtle">
        <div className="mx-3">
          {fecha} {turnos?.[fecha]}
        </div>
        <Button
          variant="light"          
          size="sm"
          onClick={onClose}   
        >
          ✖
        </Button>
      </div>

      <ListGroup>
        <ListGroup.Item
          action
          onClick={() => setMostrarSelect(!mostrarSelect)}
        >
          ✏️ Editar turno
        </ListGroup.Item>

        {mostrarSelect && (
          <div className="p-2 border-top">
            <Form.Select
              value={nuevoTurno}
              onChange={(e) => setNuevoTurno(e.target.value)}
            >
              <option value="">-- Seleccionar turno --</option>
              {Object.keys(turneros[fecha]).sort().map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
            <Button
              className="mt-2"
              size="sm"
              onClick={handleCambiarTurno}
              disabled={!nuevoTurno}
            >
              Actualizar turno
            </Button>
          </div>
        )}

        {/* <ListGroup.Item action>🔄 Cambiar turno</ListGroup.Item>
        <ListGroup.Item action>📢 Ver publicaciones</ListGroup.Item>
        <ListGroup.Item action>👥 Candidatos</ListGroup.Item>
        <ListGroup.Item action>ℹ️ Info día</ListGroup.Item> */}
      </ListGroup>
    </>
  );
}
const Calendario = () => {
  const { turnos, cambiarTurno } = useTurnos();
  const [menuActivo, setMenuActivo] = useState(null); // { fecha, x, y }
  const hoy = new Date();
  const meses = [];

  // Manejar clic en un día
  const handleClickDia = (fecha, e) => {
    e.stopPropagation(); // para que no cierre el menú inmediatamente
    const rect = e.target.getBoundingClientRect();
    const menuWidth = 200;
    const menuHeight = 130;

    let left = rect.left;
    let top = rect.bottom;

    // Ajuste para que el menú no se salga de la pantalla
    if (left + menuWidth > window.innerWidth) left = window.innerWidth - menuWidth - 10;
    if (top + menuHeight > window.innerHeight) top = rect.top - menuHeight;

    setMenuActivo({ fecha, x: left, y: top });
  };

  // Cerrar menú si clicas fuera
  useEffect(() => {
    const cerrar = () => setMenuActivo(null);
    document.addEventListener("click", cerrar);
    return () => document.removeEventListener("click", cerrar);
  }, []);

  // Generar los 3 meses a partir de hoy
  for (let i = 0; i < 3; i++) {
    const mesFecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
    const nombreMes = mesFecha.toLocaleString("es-ES", { month: "long", year: "numeric" });
    const diasEnMes = new Date(mesFecha.getFullYear(), mesFecha.getMonth() + 1, 0).getDate();
    const primerDiaSemana = (mesFecha.getDay() + 6) % 7; // lunes primero

    const filas = [];
    let celdas = [];

    // Celdas vacías iniciales
    for (let d = 0; d < primerDiaSemana; d++) {
      celdas.push(<td key={`empty-${d}`}></td>);
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(mesFecha.getFullYear(), mesFecha.getMonth(), dia);
      const f = formatearFecha(fecha, "aaaa-mm-dd");
      const esHoy = fecha.toDateString() === hoy.toDateString();
      let backgroundColor = "#E0E0E0";
      let color = "Black";
      const turnoKey = turnos?.[f];
      const jornada = TURNOS[turnoKey]?.jornada || "";
      
      if (turnoKey === "L") {
        backgroundColor = "#fff";
      } else if (turnoKey === "V") {
        backgroundColor = "#ead1dc";
      } else if (jornada) {
        backgroundColor = COLORES_TURNOS.colorFondo[jornada];
        color = COLORES_TURNOS.colorTexto[jornada];
      }
      celdas.push(
        <td
          key={dia}
          onClick={(e) => handleClickDia(fecha, e)}
          className={`position-relative p-1 cursor-pointer ${esHoy ? "bg-warning-subtle" : ""}`}
          style={{ height: "60px", verticalAlign: "top" }}
        >
          {/* número de día */}
          <div
            style={{
              textAlign: "right",
              fontSize: "0.7em",
              opacity: 0.5,
            }}
          >
            {dia}
          </div>
          {/* turnos */}
          <div            
            style={{
              textAlign: "center",
              paddingTop: "15px",
              marginTop: "0.5em",
              fontSize: "0.8em",
              borderRadius: "8px",
              backgroundColor, 
              color,
              padding: "5px 10px", // opcional, para separar texto del borde
            }}
          >
            {turnos?.[f]}
          </div>
        </td>
      );

      if (celdas.length % 7 === 0 || dia === diasEnMes) {
        filas.push(<tr key={`fila-${dia}`}>{celdas}</tr>);
        celdas = [];
      }
    }

    meses.push(
      <div key={nombreMes} className="mb-4">
        <h4 className="bg-secondary text-white p-2 rounded">
          {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
        </h4>
        <table className="table table-bordered" style={{ tableLayout: "fixed", width: "100%" }}>

          <thead>
            <tr>
              <th>Lun</th>
              <th>Mar</th>
              <th>Mié</th>
              <th>Jue</th>
              <th>Vie</th>
              <th>Sáb</th>
              <th>Dom</th>
            </tr>
          </thead>
          <tbody>{filas}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mx-3">
      {meses}

      {/* Menú flotante */}
      {menuActivo && (
        <div
          onClick={(e) => e.stopPropagation()} 
          style={{
            position: "fixed",
            top: menuActivo.y,
            left: menuActivo.x,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          <ListaAccionesDia 
            fecha={formatearFecha(menuActivo.fecha, "aaaa-mm-dd")} 
            turnos={turnos}
            cambiarTurno={cambiarTurno}
            onClose={() => setMenuActivo(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Calendario;

