import { Button, Modal } from "react-bootstrap";
import { formatearFecha } from "../../../utils/fechas";

// --- Modal de Confirmación de Borrado ---
export function ModalBorrar({ show, loading, onConfirm, onCancel }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Estás seguro de que deseas eliminar esta publicación?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Borrando..." : "Borrar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// --- Modal de Detalle (para otros) ---
export function ModalDetalle({ pub, usuario, onClose, onApuntarme, onBorrarme, apuntando }) {
  const esPropia = pub.nombre === usuario.nombre;
  const yaApuntado = pub.candidatos?.some((c) => c.nombre === usuario.nombre);

  // Mostrar texto del turno
  const getTextoTurno = () => {
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
    const texto = parte1 + parte2;
    return texto.length > 30 ? texto.slice(0, 30) + "..." : texto;
  };

  return (
    <Modal show={true} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{pub.apodo} {pub.nucleo} {pub.equipo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Fecha:</strong> {formatearFecha(pub.fecha, { weekday: "short", day: "numeric", month: "long" })}</p>
        <p><strong>{pub.tipo}:</strong> {getTextoTurno()}</p>
        {pub.modalidad && <p><strong>Modalidad:</strong> {pub.modalidad}</p>}
        {pub.comentarios && <p><strong>Comentarios:</strong> {pub.comentarios}</p>}

        <p><strong>Candidatos:</strong></p>
        <ul>
          {pub.candidatos?.length > 0 ? (
            pub.candidatos.map((c, i) => (
              <li key={i}>
                {c.apodo} {c.nucleo} {c.equipo} ({c.turno}) {c.asignado ? "(Asignado)" : ""}
              </li>
            ))
          ) : (
            <li>No hay candidatos aún</li>
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        {!esPropia && (
          yaApuntado ? (
            <Button variant="danger" onClick={onBorrarme} disabled={apuntando}>
              {apuntando ? "Borrando..." : "Borrarme"}
            </Button>
          ) : (
            <Button variant="primary" onClick={onApuntarme} disabled={apuntando}>
              {apuntando ? "Apuntando..." : "Apuntarme"}
            </Button>
          )
        )}
      </Modal.Footer>
    </Modal>
  );
}
