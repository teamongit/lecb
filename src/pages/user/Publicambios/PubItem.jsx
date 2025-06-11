import { useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { formatearFecha } from "../../../utils/formatearFecha";
import { Trash3 } from "react-bootstrap-icons";

const listaContraria = {
  P6: "HV",
  HV: "P6"
};

function Candidato({ style, candidato, pub, esPropia, onToggleAsignado }) {
  
  return (
    <div
      className={`candidato-enter rounded d-flex justify-content-between align-items-center alert alert-${candidato.asignado ? "success" : "light"} p-2 my-1`}
      style={style}
    >
      <span>
        {listaContraria[pub.lista]} {formatearFecha(pub.fecha, "completo")}{" "}
        {candidato.servicio || candidato.jornada} -{" "}
        {candidato.apodo} {candidato.equipo} {candidato.lado}
      </span>
      {esPropia && (
        <Form.Check
          type="checkbox"
          checked={!!candidato.asignado}
          onChange={() => onToggleAsignado(candidato)}
        />
      )}
    </div>
  );
}

export function PubItem({
  pub,
  esPropia,
  expandedPubId,
  onToggleExpand,
  onBorrarPublicacion,
  onToggleAsignado,
  mostrarComentarios=true,
  margen = "p-2 m-1",
  }) {

  
  const [variant, setVariant] = useState("warning");

  const expanded = expandedPubId === pub?.id;
  const tagUsuarioTxt = (
    <div>
      {pub.apodo} {pub.equipo} {pub.lado}
      {esPropia && (
        <Trash3
          role="button"
          className="ms-2 text-danger"
          onClick={(e) => {
            e.stopPropagation(); // evita que expanda al hacer click
            onBorrarPublicacion(pub?.id);
          }}
        />
      )}
    </div>
  );

  useEffect(() => {
    if (!pub.candidatos || pub.candidatos.length === 0) {
      setVariant("warning");
    } else if (pub.candidatos.some(c => c.asignado)) {
      setVariant("success");
    } else {
      setVariant("primary");
    }
  }, [pub.candidatos]);

  return (
    <div>
      <Alert
        className={`d-flex justify-content-between align-items-center ${margen}`}
        variant={variant}
        role="button"
        onClick={onToggleExpand}
      >
        <div>
          {pub.lista} {formatearFecha(pub.fecha, "completo")} {pub.servicio || pub.jornada}
        </div>
        {tagUsuarioTxt}
      </Alert>

      {expanded && (
        <div className="mx-3 mb-2">
          {pub.comentarios && mostrarComentarios && (
            <small className="text-muted d-block mb-2">{pub.comentarios}</small>
          )}
          {(pub.candidatos || []).map((candidato, idx) => (
              <Candidato
                key={idx}                
                style={{ animationDelay: `${idx * 0.3}s` }}
                candidato={candidato}
                pub={pub}
                esPropia={esPropia}
                onToggleAsignado={onToggleAsignado}
              />
          ))}
        </div>
      )}
    </div>
  );
}
