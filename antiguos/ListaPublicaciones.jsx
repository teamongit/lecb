// components/publicaciones/PublicacionesListado.jsx
import { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearFecha } from "../../../utils/fechas";
import { Button, Modal } from "react-bootstrap";

// --- Modal de Confirmación de Borrado ---
function ModalBorrar({ show, loading, onConfirm, onCancel }) {
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
function ModalDetalle({ pub, usuario, onClose, onApuntarme, onBorrarme, apuntando }) {
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
        <p><strong>Modalidad:</strong> {pub.modalidad}</p>
        {pub.comentarios && <p><strong>Comentarios:</strong> {pub.comentarios}</p>}

        <p><strong>Candidatos:</strong></p>
        <ul>
          {pub.candidatos?.length > 0 ? (
            pub.candidatos.map((c, i) => (
              <li key={i}>
                {c.apodo} {c.nucleo} {c.equipo} {c.asignado ? "(Asignado)" : ""}
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

// --- Componente Principal ---
export default function ListaPublicaciones({ soloPropias = false, apuntado = false }) {
  const { usuario } = useAuth();
  const { publicaciones, editarPublicacion, borrarPublicacion } = usePublicaciones();

  // Estados
  const [expandedPubId, setExpandedPubId] = useState(null); // para propias
  const [modalPub, setModalPub] = useState(null); // para otras
  const [modalBorrarId, setModalBorrarId] = useState(null);
  const [borrandoId, setBorrandoId] = useState(null);
  const [apuntando, setApuntando] = useState(false);

  // Filtrar según tipo
  const publicacionesFiltradas = useMemo(() => {
    if (!usuario) return [];
    return publicaciones.filter((pub) =>
      soloPropias
        ? pub.nombre === usuario.nombre
        : pub.nombre !== usuario.nombre
    );
  }, [publicaciones, usuario, soloPropias]);

  // Agrupar por mes
  const publicacionesPorMes = useMemo(() => {
    const agrupadas = {};
    publicacionesFiltradas.forEach((pub) => {
      if (!pub.fecha?.toDate) return;
      const mes = formatearFecha(pub.fecha, { month: "long" });
      if (!agrupadas[mes]) agrupadas[mes] = [];
      agrupadas[mes].push(pub);
    });
    return agrupadas;
  }, [publicacionesFiltradas]);

  // --- Acciones ---

  // Apuntarse
  const handleApuntarme = useCallback(async () => {
    if (!modalPub || !usuario) return;
    setApuntando(true);
    try {
      const nuevosCandidatos = [
        ...modalPub.candidatos,
        { nombre: usuario.nombre, apodo: usuario.apodo, nucleo: usuario.nucleo, equipo: usuario.equipo }
      ];
      await editarPublicacion(modalPub.id, { candidatos: nuevosCandidatos });
      setModalPub({ ...modalPub, candidatos: nuevosCandidatos });
    } catch (error) {
      console.error("Error al apuntarse:", error);
    } finally {
      setApuntando(false);
    }
  }, [modalPub, usuario, editarPublicacion]);

  // Borrarse
  const handleBorrarme = useCallback(async () => {
    if (!modalPub || !usuario) return;
    setApuntando(true);
    try {
      const nuevosCandidatos = modalPub.candidatos.filter((c) => c.nombre !== usuario.nombre);
      await editarPublicacion(modalPub.id, { candidatos: nuevosCandidatos });
      setModalPub({ ...modalPub, candidatos: nuevosCandidatos });
    } catch (error) {
      console.error("Error al borrarse:", error);
    } finally {
      setApuntando(false);
    }
  }, [modalPub, usuario?.nombre, editarPublicacion]);

  // Asignar candidato (solo propias)
  const handleCandidatoSeleccionado = useCallback(
    async (candidato, pub) => {
      try {
        // Si el candidato ya está asignado, lo desasignamos (quedará ninguno)
        const yaAsignado = candidato.asignado;
        const candidatosPub = pub.candidatos.map((c) => ({
          ...c,
          asignado: !yaAsignado && c.nombre === candidato.nombre, // toggle: si ya estaba asignado → desasigna todos
        }));

        const estadoPub = candidatosPub.some((c) => c.asignado) ? "asignado" : "publicado";

        const promesas = [editarPublicacion(pub.id, { candidatos: candidatosPub, estado: estadoPub })];

        // Si estamos asignando (no desasignando), buscamos la pub vinculada
        if (!yaAsignado && candidato.pubId) {
          const pubMatch = publicaciones.find((p) => p.id === candidato.pubId);
          if (pubMatch) {
            const candidatosMatch = pubMatch.candidatos.map((c) => ({
              ...c,
              asignado: c.nombre === pub.nombre,
            }));
            const estadoMatch = candidatosMatch.some((c) => c.asignado) ? "asignado" : "publicado";
            promesas.push(editarPublicacion(pubMatch.id, { candidatos: candidatosMatch, estado: estadoMatch }));
          }
        }

        // Si estábamos desasignando, y había pub vinculada, también desasignamos allí
        if (yaAsignado && candidato.pubId) {
          const pubMatch = publicaciones.find((p) => p.id === candidato.pubId);
          if (pubMatch) {
            const candidatosMatch = pubMatch.candidatos.map((c) => ({
              ...c,
              asignado: c.nombre === pub.nombre ? false : c.asignado,
            }));
            const estadoMatch = candidatosMatch.some((c) => c.asignado) ? "asignado" : "publicado";
            promesas.push(editarPublicacion(pubMatch.id, { candidatos: candidatosMatch, estado: estadoMatch }));
          }
        }

        await Promise.all(promesas);
      } catch (error) {
        console.error("Error al actualizar candidatos:", error);
      }
    },
    [publicaciones, editarPublicacion]
  );

  // Borrar publicación
  const handleBorrarPublicacion = useCallback(async (id) => {
    setBorrandoId(id);
    try {
      await borrarPublicacion(id);
      setModalBorrarId(null);
    } catch (error) {
      console.error("Error al borrar:", error);
    } finally {
      setBorrandoId(null);
    }
  }, [borrarPublicacion]);

  // Toggle expandir (solo propias)
  const toggleExpand = useCallback(
    (id) => setExpandedPubId((prev) => (prev === id ? null : id)),
    []
  );

  // --- Renderizado ---

  if (!usuario) return null;

  const renderPubItem = (pub) => {
    const esAsignado = pub.candidatos?.some((c) => c.asignado) ?? false;
    const tieneCandidatos = pub.candidatos?.length > 0;
    const variant = esAsignado ? "success" : tieneCandidatos ? "warning" : "light";

    return (
      <PubItem
        key={pub.id}
        pub={pub}
        esPropia={soloPropias}
        variant={variant}
        // Modo propio: expandible + acciones en línea
        expandedPubId={soloPropias ? expandedPubId : undefined}
        onToggleExpand={soloPropias ? () => toggleExpand(pub.id) : undefined}
        onBorrarPublicacion={soloPropias ? () => setModalBorrarId(pub.id) : undefined}
        onToggleAsignado={soloPropias ? (c) => handleCandidatoSeleccionado(c, pub) : undefined}
        // Modo otros: abre modal
        onClick={!soloPropias ? () => setModalPub(pub) : undefined}
      />
    );
  };

  

  const listado = Object.entries(publicacionesPorMes).map(([mes, pubs]) => (
    <div key={mes}>
      <h4 className="bg-secondary text-white mx-0 p-2 rounded">{mes}</h4>
      {pubs.map(renderPubItem)}
    </div>
  ));

  return (
    <>
      {Object.keys(publicacionesPorMes).length > 0 ? listado : <span>No hay publicaciones</span>}

      {/* Modal: Detalle (solo para otros) */}
      {!soloPropias && modalPub && (
        <ModalDetalle
          pub={modalPub}
          usuario={usuario}
          onClose={() => setModalPub(null)}
          onApuntarme={handleApuntarme}
          onBorrarme={handleBorrarme}
          apuntando={apuntando}
        />
      )}

      {/* Modal: Confirmar borrado (solo propias) */}
      {soloPropias && modalBorrarId && (
        <ModalBorrar
          show={true}
          loading={borrandoId === modalBorrarId}
          onConfirm={() => handleBorrarPublicacion(modalBorrarId)}
          onCancel={() => setModalBorrarId(null)}
        />
      )}
    </>
  );
}