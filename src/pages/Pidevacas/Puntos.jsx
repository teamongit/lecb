import { useVacaciones } from "../../context/VacacionesContext";
import { Accordion, Table } from "react-bootstrap";
import { formatearFecha } from "../../utils/fechas";
import { useAuth } from "../../context/AuthProvider";

export function Puntos({vacaciones}) {
  // const { vacaciones } = useVacaciones();
  const { usuario } = useAuth();
  const usuarioVacas = vacaciones.integrantes.find((u) => usuario.nombre.startsWith(u.apodo));
  
  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>Puntos</Accordion.Header>
        <Accordion.Body>
          <Table size="sm" className="fs-08">
            <thead>
              <tr>
                <th>Rondas</th>
                <th>Ciclo</th>
                <th>Tipo</th>
                <th>Puntos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-muted">Inicio</td>
                <td className="text-muted"></td>
                <td className="text-muted"></td>
                <td className="text-muted"></td>
                <td className="text-muted">{usuarioVacas.puntos[1].inicio}</td>
              </tr>

              {[1, 2, 3, 4, 5, 6].flatMap((n) => {
                const filas = [];    
                // Insertar fila Reset justo antes de la ronda indicada
                if (vacaciones.ronda_reset_puntos === n) {
                  filas.push(
                    <tr key="reset">
                      <td className="text-muted">Reset</td>
                      <td></td>
                      <td></td>
                      <td className="text-muted">- {usuarioVacas.puntos[1].inicio}</td>
                      <td className="text-muted">{usuarioVacas.puntos[n].inicio}</td>
                    </tr>
                  );
                }
                filas.push(
                  <tr key={n}>
                    <td className={`${usuarioVacas.puntos[n].inicio ? "fw-bold" : "text-muted"}`}>{n}</td>
                    <td className={`${usuarioVacas.puntos[n].inicio ? "" : "text-muted"}`}>{formatearFecha(usuarioVacas.peticiones?.find((p) => p.ronda == n)?.fecha, {day:"numeric", month:"short"})}</td>
                    <td className={`${usuarioVacas.puntos[n].inicio ? "" : "text-muted"}`}>{usuarioVacas.peticiones.some(p => p.ronda == n) ? usuarioVacas.peticiones.find(p => p.ronda == n)?.tipo : ""}</td>
                    <td className={`${usuarioVacas.puntos[n].inicio ? "" : "text-muted"}`}>{usuarioVacas.puntos[n].parcial.toFixed(1)}</td>
                    <td className={`${usuarioVacas.puntos[n].inicio ? "" : "text-muted"}`}>{usuarioVacas.puntos[n].fin.toFixed(1)}</td>
                  </tr>
                );

                return filas;
              })}

              <tr>
                <td className="text-muted">Fin</td>
                <td className="text-muted"></td>
                <td className="text-muted"></td>
                <td className="text-muted"></td>
                <td className="text-muted">{usuarioVacas.puntos[6].fin || "--"}</td>
              </tr>
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
