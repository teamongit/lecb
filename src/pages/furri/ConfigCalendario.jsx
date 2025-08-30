import { Card, Table } from "react-bootstrap";
import { formatearFecha } from "../../utils/formatearFecha";

export function ConfigCalendario({ proximosCiclos, setProximosCiclos }) {
  const handleChange = (fecha, campo, valor, index = null) => {
    setProximosCiclos((prev) => {
      const nuevosCiclos = { ...prev };

      if (campo === "cupos") {
        const nuevosCupos = [...(nuevosCiclos[fecha].cupos || [])];
        nuevosCupos[index] = valor;
        nuevosCiclos[fecha] = { ...nuevosCiclos[fecha], cupos: nuevosCupos };
      } else {
        nuevosCiclos[fecha] = { ...nuevosCiclos[fecha], [campo]: valor };
      }

      return nuevosCiclos;
    });
  };

const totalInvierno = Object.values(proximosCiclos).reduce((suma, ciclo) => {
  if (ciclo.temporada === "baja") {
    const cuposTotales = ciclo.cupos.filter(c => c == 1).length;
    return suma + cuposTotales;
  }
  return suma;
}, 0);


const totalVerano = Object.values(proximosCiclos).reduce((suma, ciclo) => {
  if (ciclo.temporada === "alta") {
    const cuposTotales = ciclo.cupos.filter(c => c == 1).length;
    return suma + cuposTotales;
  }
  return suma;
}, 0);
  const totalSuma = totalInvierno + totalVerano;

  console.log("render calendario")
  return (
    <Card className="mt-5">
      <Card.Header>
        <h2>Calendario ciclos 2026</h2>
      </Card.Header>
      <Card.Body>
        <Table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Puntos</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>Temp</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(proximosCiclos)
              .sort()
              .map(([fecha, ciclo]) => (
                <tr
                  key={fecha}
                  className={ciclo.temporada === "baja" ? "table-primary" : "table-warning"}
                >
                  <td className="w-88px">{formatearFecha(fecha, "dd_mes_corto")}</td>

                  <td>
                    <input
                      type="number"
                      value={ciclo.puntos.toFixed(1)}
                      onChange={(e) => handleChange(fecha, "puntos", +e.target.value)}
                      className="form-control form-control-sm border-0 bg-transparent shadow-none"
                    />
                  </td>

                  {(ciclo.cupos || []).map((cupo, i) => (
                    <td key={i}>
                      <select
                        value={cupo}
                        onChange={(e) => handleChange(fecha, "cupos", e.target.value, i)}
                        className="form-control form-control-sm border-0 bg-transparent shadow-none text-center p-0 m-0"
                      >
                        <option value="1">1</option>
                        <option value="B">B</option>
                        <option value="M">M</option>
                        <option value="Z">Z</option>
                        <option value="N">N</option>
                      </select>
                    </td>
                  ))}

                  <td>
                    <select
                      value={ciclo.temporada}
                      onChange={(e) => handleChange(fecha, "temporada", e.target.value)}
                      className="form-control form-control-sm border-0 bg-transparent shadow-none text-center p-0 m-0"
                    >
                      <option value="baja">baja</option>
                      <option value="alta">alta</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td colSpan={3} className="text-center">{totalInvierno}</td>
              <td><strong>baja</strong></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td colSpan={3} className="text-center">{totalVerano}</td>
              <td><strong>alta</strong></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td colSpan={3} className="text-center">{totalSuma}</td>
              <td><strong>suma</strong></td>
            </tr>
          </tfoot>
        </Table>
      </Card.Body>
    </Card>
  );
}
