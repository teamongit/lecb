// components/publicaciones/PublicacionesListado.jsx
import React, { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "@/hooks/useAuth";
import { usePublicaciones } from "@/hooks/usePublicaciones";
import { formatearFecha } from "@/utils/fechas";

import { useTurnos } from "@/hooks/useTurnos";
import { ModalBorrar, ModalDetalle } from "./PubModal";
import { useToast } from "../../context/ToastContext";


// --- Componente Principal ---
function ListaPublicaciones({ 
  publicaciones: publicacionesProp,
  esPropia = false, 
  esApuntado = false, 
  esAprobado = false
}) {
  const { usuario } = useAuth();
  const { turnos } = useTurnos();
  const { triggerToast } = useToast();
  const { editarPublicacion, borrarPublicacion } = usePublicaciones();
  // Usa publicacionesProp en vez de traerlas del hook
  const publicaciones = publicacionesProp || [];
  // Estados
  const [expandedPubId, setExpandedPubId] = useState(null); // para propias
  const [modalPub, setModalPub] = useState(null); // para otras
  const [modalBorrarId, setModalBorrarId] = useState(null);
  const [borrandoId, setBorrandoId] = useState(null);
  const [apuntando, setApuntando] = useState(false);
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

  // Apuntarse
  const handleApuntarme = useCallback(async () => {
    if (!modalPub || !usuario) return;
    setApuntando(true);
    const f = formatearFecha(modalPub.fecha, "aaaa-mm-dd");
    const turno = turnos[f] || "??";
    try {
      const nuevosCandidatos = [
        ...modalPub.candidatos,
        { 
          nombre: usuario.nombre, 
          apodo: usuario.apodo, 
          nucleo: usuario.nucleo, 
          equipo: usuario.equipo,
          telefono: usuario.telefono,
          turno, 
        }
      ];
      await editarPublicacion(modalPub.id, { candidatos: nuevosCandidatos });
      setModalPub({ ...modalPub, candidatos: nuevosCandidatos });
    } catch (error) {
      // triggerToast()
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
      triggerToast("Publicación eliminada", {severity: "success", autoHideDuration: 2500});
      setModalBorrarId(null);
    } catch (error) {
      triggerToast("Error al eliminar", {severity: "danger", autoHideDuration: 2500});
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