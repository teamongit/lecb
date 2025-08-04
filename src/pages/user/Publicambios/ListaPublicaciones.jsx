import { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearFecha } from "../../../utils/fechas";
import { Button, Modal } from "react-bootstrap";

export default function ListaPublicaciones({ esPropia }) {
  const { publicaciones, loading, borrarPublicacion, editarPublicacion } = usePublicaciones();
  const { userData } = useAuth();

  const [expandedPubId, setExpandedPubId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [modalId, setModalId] = useState(null);
  const toggleExpand = useCallback(
    (id) => setExpandedPubId((prev) => (prev === id ? null : id)),
    []
  );

  const handleBorrarPublicacion = useCallback(async (id) => {
    setRemovingId(id);
    await borrarPublicacion(id);
    setRemovingId(null);
    
  }, [publicaciones, borrarPublicacion]);


  const handleCandidatoSeleccionado = async (candidato, pub) => {
    // Si candidato es null o undefined, desasignar a todos
    const asignarNombre = candidato ? candidato.nombre : null;

    // Actualizar candidatos en la publicación original
    const candidatosPub = pub.candidatos.map(c => ({
      ...c,
      asignado: asignarNombre !== null && c.nombre === asignarNombre,
    }));

    // Estado según si hay algún asignado
    const estadoPub = candidatosPub.some(c => c.asignado) ? "asignado" : "publicado";

    await editarPublicacion(pub.id, { 
      candidatos: candidatosPub,
      estado: estadoPub,
    });

    // Si no hay candidato asignado, actualizar también la publicación relacionada si existe
    if (candidato) {
      const pubMatch = publicaciones.find(p => p.id === candidato.pubId);
      if (pubMatch) {
        const asignarNombreMatch = pub.nombre; // nombre de la publicación original

        const candidatosMatch = pubMatch.candidatos.map(c => ({
          ...c,
          asignado: c.nombre === asignarNombreMatch,
        }));

        const estadoPubMatch = candidatosMatch.some(c => c.asignado) ? "asignado" : "publicado";

        await editarPublicacion(pubMatch.id, { 
          candidatos: candidatosMatch,
          estado: estadoPubMatch,
        });
      }
    }
  };

  const publicacionesPorMes = useMemo(() => {
    const agrupadas = {};
    
    const filtradas = publicaciones.filter(pub => {
      return !esPropia || pub.nombre === userData.nombre;
    });
    filtradas.forEach(pub => {
      if (!pub.fecha?.toDate) return;
      const mes = formatearFecha(pub.fecha, "mesAno");

      if (!agrupadas[mes]) agrupadas[mes] = [];
      agrupadas[mes].push(pub);
    });

    return agrupadas;
  }, [publicaciones]);

  if (loading) return <p>Cargando publicaciones...</p>;

  const contenido = Object.entries(publicacionesPorMes).map(([mes, pubs]) => {
    return (
      <div key={mes}>
        <h4 className="bg-secondary text-white mx-0 p-2 rounded">{mes}</h4>
        {pubs.map(pub => {          
          const esAsignado = pub.candidatos?.some(c => c.asignado);
          const claseFondo = esAsignado
            ? "success"
            : pub.candidatos.length
              ? "warning"
              : "light";

          return (
            <PubItem
              key={`${pub.modalidad}${pub.id}`}              
              pub={pub}
              esPropia={esPropia}
              expandedPubId={expandedPubId}
              variant={claseFondo}              
              onToggleExpand={() => toggleExpand(pub.id)}
              onBorrarPublicacion={() => setModalId(pub.id)}
              onToggleAsignado={candidato =>
                handleCandidatoSeleccionado(candidato, pub)
              }
            />
          );
        })}
      </div>
    );
  });

  return (
    <>
      {contenido.filter(Boolean).length ? (
        contenido
      ) : (
        <span>No hay publicaciones</span>
      )}
      {/* Modal de confirmación de borrado */}
    <Modal show={modalId !== null} onHide={() => setModalId(null)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Estás seguro de que deseas eliminar esta publicación?</Modal.Body>
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
