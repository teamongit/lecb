// components/Candidato.jsx

import { Alert, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { WhatsappButton } from "../../utils/WhatsappIcon";
import { formatearFecha } from "@/utils/fechas";

// viene de PubDetallles
export const PubCandidato = ({ candidato, pub, onToggleAsignado, handleAprobado }) => {
  const fecha = formatearFecha(pub.fecha, {weekday:"short", day:"numeric", month:"short" });
  const mensaje = `Hola ${candidato.apodo}, el ${fecha} hacemos el cambio: tu ${candidato.turno} por mi ${pub.quitarTurno}? Yo lo tramito en Quintiq. Gracias!`;
  return (
    <Alert
      className="d-flex justify-content-between p-2 my-1"
      variant={candidato.asignado ? "success" : "light"}
    >
      {/* Texto a la izquierda */}
      <div>
        {candidato.apodo} {candidato.nucleo} {candidato.equipo} ({candidato.turno})
      </div>
      {/* Botones y checkbox a la derecha */}
      <div className="d-flex align-items-center gap-2 ms-auto">
        {!!candidato.asignado &&
        <>
          <Button
            size="sm"
            variant="outline-primary"            
            onClick={handleAprobado}
            >
            Cambiar
          </Button>
          <WhatsappButton 
            size="sm"
            variant="outline-success"
            telefono={candidato.telefono || ""} 
            mensaje={mensaje}
            />
        </>
        }
        <Form.Check      
          type="checkbox"
          checked={!!candidato.asignado}
          onChange={() => onToggleAsignado(candidato)}
        />
      </div>
    </Alert>
  )
};