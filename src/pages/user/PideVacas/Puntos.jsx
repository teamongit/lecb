import { useVacaciones } from "../../../context/VacacionesContext";
import { Accordion, Table } from "react-bootstrap";
import { formatearFecha } from "../../../utils/fechas";
import { useAuth } from "../../../context/AuthProvider";

export function Puntos({vacaciones}) {
  // const { vacaciones } = useVacaciones();
  const { usuario } = useAuth();
  const usuarioVacas = vacaciones.integrantes.find((u) => usuario.nombre.startsWith(u.apodo));
  
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Puntos</Accordion.Header>
        <Accordion.Body>
          <Table size="sm" className="text-08">
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
                <td className="text-muted">{usuarioVacas.puntos[0]}</td>
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
                      <td className="text-muted">- {usuarioVacas.puntos[0]}</td>
                      <td className="text-muted">
                        {usuarioVacas.puntos
                          .slice(1, vacaciones.ronda_reset_puntos) 
                          .reduce((total, p) => total + p, 0)
                        }
                      </td>
                    </tr>
                  );
                }
                filas.push(
                  <tr key={n}>
                    <td className={`${usuarioVacas.puntos[n] ? "fw-bold" : "text-muted"}`}>{n}</td>
                    <td className={`${usuarioVacas.puntos[n] ? "" : "text-muted"}`}>{formatearFecha(usuarioVacas.peticiones?.find((p) => p.ronda == n)?.fecha, "aaaa-mm-dd")}</td>
                    <td className={`${usuarioVacas.puntos[n] ? "" : "text-muted"}`}>{usuarioVacas.peticiones.some(p => p.ronda == n) ? usuarioVacas.peticiones.find(p => p.ronda == n)?.tipo : ""}</td>
                    <td className={`${usuarioVacas.puntos[n] ? "" : "text-muted"}`}>{usuarioVacas.puntos[n]}</td>
                    <td className={`${usuarioVacas.puntos[n] ? "" : "text-muted"}`}>
                      {usuarioVacas.puntos
                          .slice(0, n + 1) 
                          .reduce((total, p, i) => 
                            total + p - (i === vacaciones.ronda_reset_puntos ? usuarioVacas.puntos[0] : 0)
                          , 0)
                      }
                    </td>
                  </tr>
                );

                return filas;
              })}

              <tr>
                <td className="text-muted">Fin</td>
                <td className="text-muted"></td>
                <td className="text-muted"></td>
                <td className="text-muted"></td>
                <td className="text-muted">{usuarioVacas.puntos[7] || "--"}</td>
              </tr>
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Historial</Accordion.Header>
        <Accordion.Body className="p-0">
          <Table size="sm" className="text-07">
            <thead>
              <tr>
                <th></th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
              </tr>
            </thead>
            <tbody>
              {vacaciones.integrantes.map((integrante) => (
                  <tr key={integrante.apodo}>
                    <td>{integrante.apodo}</td>
                    
                    {[1,2,3,4,5,6].slice(0,vacaciones.ronda).map(i => {
                      const ciclo = integrante.peticiones?.find(c => c.ronda == i+1);
                      return (
                        <td key={i}>
                          {ciclo ? formatearFecha(ciclo.fecha, {day:"numeric", month:"short"}) : "-"}
                          <br />
                          {ciclo?.puntos.toFixed(1) ?? "-"}
                          <br />
                          {integrante.puntos[i]}
                          <br />
                          {integrante.orden[i]+1}º
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
