import { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearFecha } from "../../../utils/fechas";
import { Button, Modal } from "react-bootstrap";

export function PublicacionesPropias() {
  const { publicaciones, loading, borrarPublicacion, editarPublicacion } = usePublicaciones();
  const { usuario } = useAuth();

  const [expandedPubId, setExpandedPubId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [modalId, setModalId] = useState(null);

  const toggleExpand = useCallback(
    (id) => setExpandedPubId((prev) => (prev === id ? null : id)),
    []
  );

  const handleBorrarPublicacion = useCallback(
    async (id) => {
      setRemovingId(id);
      try {
        await borrarPublicacion(id);
      } catch (error) {
        console.error("Error al borrar publicación:", error);
        // Aquí podrías agregar notificación para el usuario
      } finally {
        setRemovingId(null);
      }
    },
    [borrarPublicacion]
  );

  const handleCandidatoSeleccionado = useCallback(
    async (candidato, pub) => {
      try {
        const asignarNombre = candidato ? candidato.nombre : null;

        const candidatosPub = pub.candidatos?.map((c) => ({
          ...c,
          asignado: asignarNombre !== null && c.nombre === asignarNombre,
        })) ?? [];

        const estadoPub = candidatosPub.some((c) => c.asignado) ? "asignado" : "publicado";

        const promesas = [editarPublicacion(pub.id, { candidatos: candidatosPub, estado: estadoPub })];

        if (candidato) {
          const pubMatch = publicaciones.find((p) => p.id === candidato.pubId);
          if (pubMatch) {
            const asignarNombreMatch = pub.nombre;

            const candidatosMatch = pubMatch.candidatos?.map((c) => ({
              ...c,
              asignado: c.nombre === asignarNombreMatch,
            })) ?? [];

            const estadoPubMatch = candidatosMatch.some((c) => c.asignado) ? "asignado" : "publicado";

            promesas.push(
              editarPublicacion(pubMatch.id, {
                candidatos: candidatosMatch,
                estado: estadoPubMatch,
              })
            );
          }
        }
        await Promise.all(promesas);
      } catch (error) {
        console.error("Error al actualizar candidatos:", error);
        // Aquí podrías agregar notificación para el usuario
      }
    },
    [editarPublicacion, publicaciones]
  );

  const publicacionesPorMes = useMemo(() => {
    if (!usuario?.nombre) return {};

    const agrupadas = {};
    const filtradas = publicaciones.filter(pub => pub.nombre === usuario.nombre);

    filtradas.forEach((pub) => {
      if (!pub.fecha?.toDate) return;
      const mes = formatearFecha(pub.fecha, { month: "long" });

      if (!agrupadas[mes]) agrupadas[mes] = [];
      agrupadas[mes].push(pub);
    });

    return agrupadas;
  }, [publicaciones, usuario]);

  if (loading) return <p>Cargando publicaciones...</p>;

  const contenido = Object.entries(publicacionesPorMes).map(([mes, pubs]) => (
    <div key={mes}>
      <h4 className="bg-secondary text-white mx-0 p-2 rounded">{mes}</h4>
      {pubs.map((pub) => {
        const esAsignado = pub.candidatos?.some((c) => c.asignado) ?? false;
        const tieneCandidatos = pub.candidatos?.length > 0;
        const claseFondo = esAsignado ? "success" : tieneCandidatos ? "warning" : "light";

        return (
          <PubItem
            key={pub.id}
            pub={pub}
            esPropia={true}
            expandedPubId={expandedPubId}
            variant={claseFondo}
            onToggleExpand={() => toggleExpand(pub.id)}
            onBorrarPublicacion={() => setModalId(pub.id)}
            onToggleAsignado={(candidato) => handleCandidatoSeleccionado(candidato, pub)}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      {contenido.filter(Boolean).length ? contenido : <span>No hay publicaciones</span>}

      {/* Modal de confirmación de borrado */}
      <Modal
        show={modalId !== null}
        onHide={() => setModalId(null)}
        centered
        aria-labelledby="modal-eliminar-title"
        aria-describedby="modal-eliminar-desc"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal-eliminar-title">Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body id="modal-eliminar-desc">
          ¿Estás seguro de que deseas eliminar esta publicación?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalId(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await handleBorrarPublicacion(modalId);
              setModalId(null);
            }}
            disabled={removingId === modalId}
          >
            {removingId === modalId ? "Borrando..." : "Borrar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
