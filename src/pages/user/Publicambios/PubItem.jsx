import { Alert, Form } from "react-bootstrap";
import { formatearFecha } from "../../../utils/fechas";
import { formatearTurno } from "../../../utils/turnos";
import { Divider } from "@mui/material";
import { BookmarkDash, BookmarkDashFill, BookmarkPlus, BookmarkPlusFill, BookmarksFill, Person } from "react-bootstrap-icons";

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
  


  // let turno = "";
  // if (pub.tipo === "quitar") {
  //   turno = pub.turno;
  // } else if (pub.tipo === "hacer") {
  //   turno = formatearTurno(pub.servicio, pub.duracion, pub.funcion);
  // } else if (pub.tipo === "cambiar") {
  //   turno =  pub.turno + " x " + formatearTurno(pub.servicio, pub.duracion, pub.funcion);
  // }
  
  return (
    <div>
      <Alert
        // className={`d-flex justify-content-between p-2 m-1 ${esPropia ? 'border-2 border-secondary-subtle' : ''}`}
        className={"d-flex justify-content-between p-2 m-1"}
        variant={variant}
        role="button"
        onClick={onToggleExpand}
      >
        <div>          
          {icono}{" "}  
          {formatearFecha(pub.fecha, {day: "2-digit", weekday: "short"})}
        </div>
        <div>{pub.cambio}</div>
        <div className="d-flex align-items-center">
          {pub.nucleo}
          {/* {esPropia && (
            <Trash3
            role="button"
            className="ms-2 text-danger"
            onClick={(e) => {
              e.stopPropagation(); // evita que expanda al hacer click
              onBorrarPublicacion(pub.id);
            }}
            />
          )} */}

        </div>
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
