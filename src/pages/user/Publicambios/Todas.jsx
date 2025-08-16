import { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearFecha } from "../../../utils/fechas";
import { Button, Modal } from "react-bootstrap";


const BotonesModal = ({ modalPub, usuario, apuntando, setModalPub, handleApuntarme, handleBorrarme }) => {
  const esPropia = modalPub.nombre === usuario.nombre;
  const yaApuntado = modalPub.candidatos?.some(c => c.nombre === usuario.nombre);

  return (
    <>
      <Button variant="secondary" onClick={() => setModalPub(null)}>
        Cerrar
      </Button>

      {!esPropia && (
        yaApuntado ? (
          <Button variant="danger" onClick={handleBorrarme}>
            Borrarme
          </Button>
        ) : (
          <Button variant="primary" onClick={handleApuntarme} disabled={apuntando}>
            {apuntando ? "Apuntando..." : "Apuntarme"}
          </Button>
        )
      )}
    </>
  );
};

export function PublicacionesTodas() {
  const { publicaciones, editarPublicacion } = usePublicaciones();
  const { usuario } = useAuth();

  const [modalPub, setModalPub] = useState(null); 
  const [apuntando, setApuntando] = useState(false);

  // Filtrar o agrupar publicaciones
  const publicacionesPorMes = useMemo(() => {
    const agrupadas = {};
    
    publicaciones
    .filter(pub => pub.nombre !== usuario.nombre) 
    .forEach((pub) => {
      if (!pub.fecha?.toDate) return;
      const mes = formatearFecha(pub.fecha, {month: "long"});
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
      // Actualizar la publicación con el nuevo candidato
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
      const nuevosCandidatos = modalPub.candidatos.filter(c => c.nombre !== usuario.nombre);
      await editarPublicacion(modalPub.id, { candidatos: nuevosCandidatos });
      // Actualizar el modal con los nuevos datos
      setModalPub(prev => ({
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
      {Object.entries(publicacionesPorMes).length 
      ? (Object.entries(publicacionesPorMes).map(([mes, pubs]) => (
          <div key={mes}>
            <h4 className="bg-secondary text-white mx-0 p-2 rounded">{mes}</h4>
            {pubs.map((pub) => {
              const hayAsignado = pub.candidatos.some(c => c.asignado);
              const hayCandidatos = pub.candidatos.length;              
              const variant = hayAsignado 
                ? "success" 
                : hayCandidatos 
                  ? "warning" 
                  : "light";

              return (
                <PubItem
                  key={pub.id}
                  pub={pub}
                  esPropia={false}
                  variant={variant}
                  onClick={() => setModalPub(pub)}
                  onToggleExpand={() => setModalPub(pub)}
                />
              );
            })}
          </div>
        ))) 
      : (<span>No hay publicaciones</span>)}

      
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
            <p><strong>Fecha: </strong>{formatearFecha(modalPub.fecha, {weekday: "short", day:"numeric", month: "long"})} </p>
            
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
           <BotonesModal 
            modalPub = {modalPub} 
            usuario = {usuario} 
            apuntando = {apuntando} 
            setModalPub = {setModalPub} 
            handleApuntarme = {handleApuntarme} 
            handleBorrarme = {handleBorrarme}  
            />
          </Modal.Footer>
        </Modal>
      )}

    </>
  );
}
