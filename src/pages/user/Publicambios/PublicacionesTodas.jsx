import { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearFecha } from "../../../utils/fechas";
import { Button, Modal } from "react-bootstrap";

export function PublicacionesTodas() {
  const { publicaciones, loading, editarPublicacion } = usePublicaciones();
  const { usuario } = useAuth();

  const [modalPub, setModalPub] = useState(null); 
  const [apuntando, setApuntando] = useState(false);

  // Filtrar o agrupar publicaciones
  const publicacionesPorMes = useMemo(() => {    

    const agrupadas = {};
    // Aquí es importante definir esPropia si se usa, sino mostrar todas sin filtro
    publicaciones.forEach((pub) => {
      if (!pub.fecha?.toDate) return;
      const mes = formatearFecha(pub.fecha, 6);

      if (!agrupadas[mes]) agrupadas[mes] = [];
      agrupadas[mes].push(pub);
    });

    return agrupadas;
  }, [publicaciones]);

  // Función para apuntarse (añadir usuario como candidato) a la publicación modalPub
  const handleApuntarme = useCallback(async () => {
    if (!modalPub) return;

    setApuntando(true);

    try {
      const { candidatos } = modalPub;
      const { nombre, apodo, nucleo, equipo } = usuario;
      
      candidatos.push({ nombre, apodo, nucleo, equipo });
      // Actualizar la publicación con el nuevo candidato y estado publicado
      await editarPublicacion(modalPub.id, { candidatos });

      // Actualizar el modal con los nuevos datos
      setModalPub(prev => ({ ...prev, candidatos }));

    } catch (error) {
      console.error("Error al apuntarse:", error);
    } finally {
      setApuntando(false);
    }
  }, [modalPub, usuario, editarPublicacion]);

  const handleBorrarme = useCallback(async () => {
    if (!modalPub) return;

    setApuntando(true);

    try {
      const nuevosCandidatos = modalPub.candidatos.filter(
        (c) => c.nombre !== usuario.nombre
      );

      await editarPublicacion(modalPub.id, { candidatos: nuevosCandidatos });

      // Actualizar el modal con los nuevos datos
      setModalPub((prev) => ({
        ...prev,
        candidatos: nuevosCandidatos,
      }));

    } catch (error) {
      console.error("Error al borrarse:", error);
    } finally {
      setApuntando(false);
    }
  }, [modalPub, usuario.nombre, editarPublicacion]);


  return (
    <>
      {Object.entries(publicacionesPorMes).length > 0 ? (
        Object.entries(publicacionesPorMes).map(([mes, pubs]) => (
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
                  variant={claseFondo}
                  // Al hacer click abrimos modal con detalles
                  onClick={() => setModalPub(pub)}
                  esPropia={usuario.nombre === pub.usuario}
                  onToggleExpand={() => setModalPub(pub)}
                />
              );
            })}
          </div>
        ))
      ) : (
        <span>No hay publicaciones</span>
      )}

      {/* Modal con detalles de publicación */}
      {modalPub && (
        <Modal
          show={true}
          onHide={() => setModalPub(null)}
          centered
          size="lg"        
        >
          <Modal.Header closeButton>
            <Modal.Title id="modal-detalle-title">
              {modalPub.apodo} {modalPub.nucleo} {modalPub.equipo}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body id="modal-detalle-desc">
            <p>{formatearFecha(modalPub.fecha, 8)} : {modalPub.ofrece.turno} x {modalPub.solicita.turno} ({modalPub.modalidad})</p>

            {modalPub.comentarios && (<p><strong>Comentarios:</strong> {modalPub.comentarios}</p>)}
            <p><strong>Candidatos:</strong></p>
            <ul>
              {modalPub.candidatos && modalPub.candidatos.length > 0 ? (
                modalPub.candidatos.map((candidato, i) => (
                  <li key={i}>
                    {candidato.apodo} {candidato.asignado ? "(Asignado)" : ""}
                  </li>
                ))
              ) : (
                <li>No hay candidatos aún</li>
              )}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalPub(null)}>
              Cerrar
            </Button>
            {modalPub.candidatos?.some(c => c.nombre === usuario.nombre) 
              ? (<Button variant="danger" onClick={handleBorrarme}>Borrarme</Button>) 
              : (
                <Button variant="primary" onClick={handleApuntarme} disabled={apuntando}>
                  {apuntando ? "Apuntando..." : "Apuntarme"}
                </Button>
              ) 
            }
          </Modal.Footer>
        </Modal>
      )}

    </>
  );
}
