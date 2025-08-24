import { Alert, Form } from "react-bootstrap";
import { formatearFecha } from "../../../utils/fechas";
import { formatearTurno } from "../../../utils/turnos";
import { Divider } from "@mui/material";
import { BookmarkDash, BookmarkDashFill, BookmarkPlus, BookmarkPlusFill, BookmarksFill, Person, Trash } from "react-bootstrap-icons";

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

export function PubItem({ pub, esPropia, expandedPubId, variant, onToggleExpand, onBorrarPublicacion, onToggleAsignado, }) {
  
  const expanded = expandedPubId === pub?.id;
  let icono = "";
  if (pub.tipo === "quitar") {
    icono = <BookmarkDashFill className="text-danger fs-3" />;
  } else if (pub.tipo === "hacer") {
    icono = <BookmarkPlusFill className="text-primary fs-3" />;
  } else if (pub.tipo === "cambiar") {
    icono = <BookmarksFill className="fs-3" />;
  }
  let parte1 = "";
  let parte2 = "";
  
  if (pub.tipo === "quitar") {
    parte1 = pub.quitarTurno;
  } else if (pub.tipo === "hacer") {
    parte1 = pub.hacerTurnos.join(", ");
  } else if (pub.tipo === "cambiar") {
    parte1 = pub.quitarTurno;
    parte2 = " x " + pub.hacerTurnos.join(", ");  
  }
  if (parte1.length > 30) parte1 = parte1.slice(0, 30) + "...";
  if (parte2.length > 30) parte1 = parte1.slice(0, 30) + "...";
   
  return (
    <div>
      <Alert        
        className={"d-flex justify-content-between p-2 m-1"}
        variant={variant}
        role="button"
        onClick={onToggleExpand}
      >
        <div className="me-2 w-25">          
          {icono}{" "}  
          {formatearFecha(pub.fecha, {day: "2-digit", weekday: "short"})}
        </div>
          <small className={`flex-grow-1 text-truncate mx-2`}>
            <span className={pub.tipo === "cambiar" ? "fw-bold" : ""}>{parte1}</span>
            <span className="text-secondary">{parte2}</span>
          </small>
         <div className="flex-shrink-0 me-2">{pub.nucleo}</div>         
        
        {esPropia && (
          <div className="d-flex align-items-center ms-auto">
            <Trash className="text-danger" role="button" onClick={onBorrarPublicacion}/>
          </div>
        )}
      </Alert>
      
      {/* Contenido de la publicacion expandida */}
      {expanded && (
        <div className="mx-3 mb-2">
          <Divider>{`${pub.apodo} ${pub.nucleo} ${pub.equipo}`}</Divider>
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
