import { useVacaciones } from "../../context/VacacionesContext";
import { Accordion, Table } from "react-bootstrap";
import { formatearFecha } from "../../utils/fechas";
import { useAuth } from "../../context/AuthProvider";

export function Historial({vacaciones}) {
  // const { vacaciones } = useVacaciones();
  const { usuario } = useAuth();
  const usuarioVacas = vacaciones.integrantes.find((u) => usuario.nombre.startsWith(u.apodo));
  
  return (
    <Accordion>
      {/* HISTORIAL */}
      <Accordion.Item>
        <Accordion.Header>Historial</Accordion.Header>
        <Accordion.Body className="p-0">
          <Table size="sm" className="fs-07">
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
                    <td className="text-start">{integrante.apodo}</td>                    
                    {[1,2,3,4,5,6].slice(0,vacaciones.ronda).map(r => {
                      const peticionAsignadaRonda = integrante.peticiones.find(p => p.ronda == r);
                      let fecha = "";
                      if (peticionAsignadaRonda)
                        fecha = peticionAsignadaRonda.fecha;

                      
                      return (
                        <td key={r}>
                          {formatearFecha(fecha, {day:"numeric", month:"short"})}
                          <br />
                          {peticionAsignadaRonda?.tipo !== "simple" ? peticionAsignadaRonda?.tipo : ""}
                          <br />
                          {integrante.puntos[r].parcial}
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
