// components/PubHeader.jsx
import { BookmarkHeartFill, BookmarkDashFill, BookmarkPlusFill, BookmarksFill } from "react-bootstrap-icons";
import { formatearFecha } from "@/utils/fechas";
import { Alert } from "react-bootstrap";
import { PubActions } from "./PubActions";

export const PubHeader = ({ pub, esPropia, onClick, onBorrarPublicacion, variant }) => {
  let voluntario = null;
  if (pub.modalidad === "Voluntario/P6") {
    voluntario = <BookmarkHeartFill className="text-success fs-3" />;
  }

  let icono = null;
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

  if (parte1.length > 20) parte1 = parte1.slice(0, 20) + "...";
  if (parte2.length > 20) parte2 = parte2.slice(0, 20) + "..."; 

  return (
    <Alert
      className="d-flex justify-content-between p-2 m-1"
      variant={variant}
      role="button"
      onClick={onClick}
    >
      <div className="me-2 w-33">
        {voluntario} {icono}{" "}
        {formatearFecha(pub.fecha, { day: "2-digit", weekday: "short" })}
      </div>
      <div className="flex-grow-1 mx-2">
        <small>{parte1}{parte2}</small>
      </div>
      <div className="flex-shrink-0 me-2">{pub.nucleo}</div>

      {esPropia && <PubActions onBorrarPublicacion={onBorrarPublicacion} />}
    </Alert>
  );
};