import { Alert, Form } from "react-bootstrap";
import { formatearFecha } from "../../../utils/fechas";
import { Trash3 } from "react-bootstrap-icons";
import { TituloSmall } from "../../../components/Titulos";

function Candidato({ candidato, esPropia, onToggleAsignado }) {
  
  return (
    <Alert 
      className="d-flex justify-content-between p-2 my-1"
      variant={candidato.asignado ? "success" : "light"}
    >
      {candidato.turno} {candidato.apodo} {candidato.nucleo} {candidato.equipo}
      {esPropia && (
        <Form.Check
          type="checkbox"
          checked={!!candidato.asignado}
          onChange={() => onToggleAsignado(candidato)}
        />
      )}
    </Alert>
  );
}

export function PubItem({
  pub,
  esPropia,
  expandedPubId,
  variant,
  onToggleExpand,
  onBorrarPublicacion,
  onToggleAsignado,  
}) {
  
  const expanded = expandedPubId === pub?.id;

  return (
    <div>
      <Alert
        className={`d-flex justify-content-between p-2 m-1`}
        variant={variant}
        role="button"
        onClick={onToggleExpand}
      >
        <div>{formatearFecha(pub.fecha, 7)}</div>
        <div>{pub.ofrece.turno} x {pub.solicita.turno} ({pub.modalidad})</div>
        <div className="d-flex align-items-center">
          {pub.nucleo}
          {esPropia && (
            <Trash3
            role="button"
            className="ms-2 text-danger"
            onClick={(e) => {
              e.stopPropagation(); // evita que expanda al hacer click
              onBorrarPublicacion(pub.id);
            }}
            />
          )}
        </div>
      </Alert>
      
      {/* Contenido de la publicacion expandida */}
      {expanded && (
        <div className="mx-3 mb-2">
          <TituloSmall texto={`${pub.apodo} ${pub.nucleo} ${pub.equipo}`}></TituloSmall>
          {pub.comentarios && (
            <small className="text-muted d-block m-2">{pub.comentarios}</small>
          )}
          {(pub.candidatos || []).map(candidato => (
            <Candidato
              key={candidato.pubId}
              candidato={candidato}              
              esPropia={esPropia}
              onToggleAsignado={onToggleAsignado}
            />
          ))}
        </div>
      )}
    </div>
  );
}
