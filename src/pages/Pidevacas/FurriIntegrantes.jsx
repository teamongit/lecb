import React from "react";
import { Card, Form, Table } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
 import { useCallback } from "react";
import { useVacaciones } from "../../context/VacacionesContext";
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
export const FurriIntegrantes = React.memo(function Integrantes() {
  const { integrantes, setIntegrantes } = useVacaciones();


  const eliminarIntegrante = useCallback((idx) => {
    setIntegrantes((prev) => prev.filter((_, i) => i !== idx)); // eliminar de integrantes
  }, [setIntegrantes]);

  
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
          <tbody className="fs-09">
            {integrantes.map((integrante, i) => (
              <tr key={i}>
                <td className="text-muted fs-07">{i + 1}</td>
                <td>{integrante.apodo}</td>
                <td>
                  <CantidadTemporada
                    valor={integrante.cantidad.baja}
                    
                  />
                </td>
                <td>
                  <CantidadTemporada
                    valor={integrante.cantidad.alta}
                    
                  />
                </td>
                <td>{integrante.cantidad.baja + integrante.cantidad.alta}</td>
                <td>
                  <Trash3Fill
                    className="text-danger cursor-pointer"
                    role="button"
                    onClick={() => eliminarIntegrante(i)}
                  />
                </td>
              </tr>
            ))}           
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td><strong>TOTAL:</strong></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </Card.Body>
    </Card>
  );
});
