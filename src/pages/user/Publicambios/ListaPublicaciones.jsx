// components/publicaciones/PublicacionesListado.jsx
import React, { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearFecha } from "../../../utils/fechas";

import { useTurnos } from "../../../hooks/useTurnos";
import { ModalBorrar, ModalDetalle } from "./PubModal";


// --- Componente Principal ---
function ListaPublicaciones({ 
  publicaciones: publicacionesProp,
  esPropia = false, 
  esApuntado = false, 
  esAprobado = false
}) {
  const { usuario } = useAuth();
  const { turnos } = useTurnos();
  const { editarPublicacion, borrarPublicacion } = usePublicaciones();
  // Usa publicacionesProp en vez de traerlas del hook
  const publicaciones = publicacionesProp || [];
  // Estados
  const [expandedPubId, setExpandedPubId] = useState(null); // para propias
  const [modalPub, setModalPub] = useState(null); // para otras
  const [modalBorrarId, setModalBorrarId] = useState(null);
  const [borrandoId, setBorrandoId] = useState(null);
  const [apuntando, setApuntando] = useState(false);



  // Filtrar según tipo
  // const publicacionesFiltradas = useMemo(() => {
  //   if (!usuario) return [];
  //   return publicaciones.filter((pub) => {
  //     if (esPropia) {
  //       return pub.estado === "publicado" && pub.nombre === usuario.nombre
  //     }
  //     // publicado y candidato apuntado
  //     if (esApuntado) {
  //       return pub.estado === "publicado" && pub.candidatos.some(c => c.nombre === usuario.nombre);
  //     }
  //     // aprobado y propias
  //     if (esAprobado) {
  //       return pub.estado === "aprobado" && (pub.nombre === usuario.nombre || pub.candidatos.some(c => c.nombre ===  usuario.nombre))
  //     }

  //     // publicado y de otros
  //     return pub.estado === "publicado" && pub.nombre !== usuario.nombre  
  //   });
  // }, [publicaciones, usuario, esPropia]);

  // Agrupar por mes
  const publicacionesPorMes = useMemo(() => {
    const agrupadas = {};
    publicaciones.forEach((pub) => {
      if (!pub.fecha?.toDate) return;
      const mes = formatearFecha(pub.fecha, { month: "long" });
      if (!agrupadas[mes]) agrupadas[mes] = [];
      agrupadas[mes].push(pub);
    });
    return agrupadas;
  }, [publicaciones]);

  // --- Acciones ---

  // Apuntarse
  const handleApuntarme = useCallback(async () => {
    if (!modalPub || !usuario) return;
    setApuntando(true);
    const f = formatearFecha(modalPub.fecha, "aaaa-mm-dd");
    const turno = turnos[f];
    try {
      const nuevosCandidatos = [
        ...modalPub.candidatos,
        { 
          nombre: usuario.nombre, 
          apodo: usuario.apodo, 
          nucleo: usuario.nucleo, 
          equipo: usuario.equipo,
          turno, 
        }
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

        editarPublicacion(pub.id, { candidatos: candidatosPub });

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
        esPropia={esPropia}
        variant={variant}
        // Modo propio: expandible + acciones en línea
        expandedPubId={esPropia ? expandedPubId : undefined}
        onToggleExpand={esPropia ? () => toggleExpand(pub.id) : undefined}
        onBorrarPublicacion={esPropia ? () => setModalBorrarId(pub.id) : undefined}
        onToggleAsignado={esPropia ? (c) => handleCandidatoSeleccionado(c, pub) : undefined}
        // Modo otros: abre modal
        onClick={!esPropia ? () => setModalPub(pub) : undefined}
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
      {!esPropia && modalPub && (
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
      {esPropia && modalBorrarId && (
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
// Exporta con memoización
export default React.memo(ListaPublicaciones, (prevProps, nextProps) => {
  return (
    prevProps.esPropia === nextProps.esPropia &&
    prevProps.esApuntado === nextProps.esApuntado &&
    prevProps.esAprobado === nextProps.esAprobado &&
    prevProps.publicaciones === nextProps.publicaciones
  );
});