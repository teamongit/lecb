// components/Candidato.jsx

import { Alert, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
// viene de PubDetallles
export const PubCandidato = ({ candidato, onToggleAsignado, handleAprobado }) => (
  
  <Alert
    className="d-flex justify-content-between p-2 my-1"
    variant={candidato.asignado ? "success" : "light"}
  >
    {candidato.apodo} {candidato.nucleo} {candidato.equipo} ({candidato.turno}) 
    {!!candidato.asignado &&
      <Button size="sm" variant="outline-primary" className="fs-07 p-1" onClick={handleAprobado}>Intercambiar turnos</Button>
    }
    
    <Form.Check
      type="checkbox"
      checked={!!candidato.asignado}
      onChange={() => onToggleAsignado(candidato)}
    />
  </Alert>
);