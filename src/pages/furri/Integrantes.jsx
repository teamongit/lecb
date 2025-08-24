import React from "react";
import { Card, Form, Table } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
 import { useCallback } from "react";
// Componente reutilizable para seleccionar cantidad de temporada
function CantidadTemporada({ valor, onChange }) {
  return (
    <Form.Select
      value={valor}
      onChange={(e) => onChange(+e.target.value)}
      className="border-0 bg-transparent text-center p-0 m-0"
      style={{ backgroundImage: "none", appearance: "none" }}
      size="sm"
    >
      {[...Array(7)].map((_, i) => (
        <option key={i} value={i}>{i}</option>
      ))}
    </Form.Select>
  );
}
// export function Integrantes({ integrantes, setIntegrantes }) {
export const Integrantes = React.memo(function Integrantes({ cantidades, setCantidades, setIntegrantes }) {

  const handleChange = useCallback((idx, campo, valor) => {
    setCantidades((prev) => {
      const nuevos = [...prev];
      nuevos[idx] = { ...nuevos[idx], [campo]: valor };
      return nuevos;
    });
  }, [setCantidades]);

  const eliminarIntegrante = useCallback((idx) => {
    setCantidades((prev) => prev.filter((_, i) => i !== idx));  // eliminar de cantidades
    setIntegrantes((prev) => prev.filter((_, i) => i !== idx)); // eliminar de integrantes
  }, [setCantidades, setIntegrantes]);


  const totalInvierno = cantidades.reduce(
    (suma, i) => suma + i.cantidad_invierno,
    0
  );

  const totalVerano = cantidades.reduce(
    (suma, i) => suma + i.cantidad_verano,
    0
  );

  const totalSuma = totalInvierno + totalVerano;
  console.log("Integrantes");
  return (
    <Card className="mt-5">
      <Card.Header><h2>Integrantes</h2></Card.Header>
      <Card.Body>
        <Table striped className="text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Apodo</th>
              <th>Inv.</th>
              <th>Ver.</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cantidades.map((integrante, idx) => (
              <tr key={idx}>
                <td className="text-muted text-07">{idx + 1}</td>
                <td>{integrante.apodo}</td>
                <td>
                  <CantidadTemporada
                    valor={integrante.cantidad_invierno}
                    onChange={(valor) => handleChange(idx, "cantidad_invierno", valor)}
                  />
                </td>
                <td>
                  <CantidadTemporada
                    valor={integrante.cantidad_verano}
                    onChange={(valor) => handleChange(idx, "cantidad_verano", valor)}
                  />
                </td>
                <td>{integrante.cantidad_invierno + integrante.cantidad_verano}</td>
                <td>
                  <Trash3Fill
                    className="text-danger cursor-pointer"
                    role="button"
                    onClick={() => eliminarIntegrante(idx)}
                  />
                </td>
              </tr>
            ))}           
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td><strong>TOTAL:</strong></td>
              <td>{totalInvierno}</td>
              <td>{totalVerano}</td>
              <td>{totalSuma}</td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </Card.Body>
    </Card>
  );
});
