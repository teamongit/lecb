import { Alert, Form } from "react-bootstrap";
import { formatearFecha } from "../src/utils/fechas";
import { Divider } from "@mui/material";
import { BookmarkDashFill, BookmarkPlusFill, BookmarksFill, Trash, BookmarkHeartFill } from "react-bootstrap-icons";

const Candidato = ({ candidato, esPropia, onToggleAsignado }) => (
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


export function PubItem({ pub, esPropia, expandedPubId, variant, onToggleExpand, onClick, onBorrarPublicacion, onToggleAsignado, }) {
  
  const expanded = expandedPubId === pub?.id;
  let voluntario = "";
  if (pub.modalidad == "Voluntario/P6")
    voluntario = <BookmarkHeartFill className="text-success fs-3" />;

  let icono = "";
  if (pub.tipo === "Quitar") {
    icono = <BookmarkDashFill className="text-danger fs-3" />;
  } else if (pub.tipo === "Hacer") {
    icono = <BookmarkPlusFill className="text-primary fs-3" />;
  } else if (pub.tipo === "Cambiar") {
    icono = <BookmarksFill className="fs-3" />;
  }
  let parte1 = "";
  let parte2 = "";
  
  if (pub.tipo === "Quitar") {
    parte1 = pub.quitarTurno;
  } else if (pub.tipo === "Hacer") {
    parte1 = pub.hacerTurnos.join(", ");
  } else if (pub.tipo === "Cambiar") {
    parte1 = pub.quitarTurno;
    parte2 = " x " + pub.hacerTurnos.join(", ");  
  }
  if (parte1.length > 30) parte1 = parte1.slice(0, 30) + "...";
  if (parte2.length > 30) parte1 = parte1.slice(0, 30) + "...";
   
  return (
    <div key={pub.creado}>
      <Alert        
        className={"d-flex justify-content-between p-2 m-1"}
        variant={variant}
        role="button"
        onClick={onToggleExpand || onClick}
      >
        <div className="me-2 w-33">          
          {voluntario}{icono}{" "}  
          {formatearFecha(pub.fecha, {day: "2-digit", weekday: "short"})}
        </div>
          <div className="flex-grow-1 mx-2">
            <small>{parte1}{parte2}</small>
          </div>
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
          {pub.comentarios && (
            <small className="text-muted d-block m-2">{pub.comentarios}</small>
          )}
          {(pub.candidatos || []).map(candidato => (
            <Candidato
              key={candidato.nombre}
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
