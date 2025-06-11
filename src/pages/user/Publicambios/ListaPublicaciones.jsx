import { useState, useMemo, useCallback } from "react";
import { PubItem } from "./PubItem";
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";

export default function ListaPublicaciones({ lista }) {
  const { publicaciones, loading, borrarPublicacion, editarPublicacion } = usePublicaciones();
  const { userData } = useAuth();

  const [expandedPubId, setExpandedPubId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const toggleExpand = useCallback(
    (id) => setExpandedPubId((prev) => (prev === id ? null : id)),
    []
  );

  const handleBorrarPublicacion = useCallback(async (id) => {
    setRemovingId(id);

    setTimeout(async () => {
      const pub = publicaciones.find((p) => p.id === id);

      if (pub) {
        // Buscar todas las publicaciones que tienen un candidato con pubId === id
        const publicacionesMatch = publicaciones.filter((p) =>
          p.candidatos?.some((c) => c.pubId === id && c.asignado)
        );

        for (const pubMatch of publicacionesMatch) {
          const nuevosCandidatos = pubMatch.candidatos
            .filter((c) => c.nombre !== pub.nombre) 
            .map((c) => ({
              ...c,
              asignado: c.asignado && c.pubId !== id,
            }));

          const sigueAsignado = nuevosCandidatos.some((c) => c.asignado);
          const nuevoAsignado = sigueAsignado ? pubMatch.asignado : null;

          await editarPublicacion(pubMatch.id, {
            asignado: nuevoAsignado,
            candidatos: nuevosCandidatos,
          });
        }
      }

      await borrarPublicacion(id);
      setRemovingId(null);
    }, 500);
  }, [publicaciones, borrarPublicacion, editarPublicacion]);


  const handleCandidatoSeleccionado = async (candidato, pub) => {
    const yaAsignado = candidato.asignado === true;
    const nuevoAsignado = yaAsignado ? null : candidato.nombre ?? null;

    const nuevosCandidatosArray = pub.candidatos.map((c) => ({
      ...c,
      asignado: yaAsignado ? false : c.nombre === candidato.nombre,
    }));

    await editarPublicacion(pub.id, {
      asignado: nuevoAsignado,
      candidatos: nuevosCandidatosArray,
    });

    const pubMatch = publicaciones.find((p) => p.id === candidato.pubId);
    if (pubMatch) {
      const nuevosCandidatosMatch = pubMatch.candidatos.map((c) => ({
        ...c,
        asignado: yaAsignado ? false : c.nombre === pub.nombre,
      }));

      await editarPublicacion(pubMatch.id, {
        asignado: yaAsignado ? null : pub.nombre,
        candidatos: nuevosCandidatosMatch,
      });
    }
  };

  const publicacionesPorMes = useMemo(() => {
    const agrupadas = {};

    publicaciones.forEach((pub) => {
      if (!pub.fecha?.toDate) return;
      const mes = pub.fecha.toDate().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!agrupadas[mes]) agrupadas[mes] = [];
      agrupadas[mes].push(pub);
    });

    return agrupadas;
  }, [publicaciones]);

  if (loading) return <p>Cargando publicaciones...</p>;

  const contenido = Object.entries(publicacionesPorMes).map(([mes, pubs]) => {
    const filtradas = pubs.filter((pub) => pub.lista === lista);
    if (!filtradas.length) return null;

    return (
      <div key={mes}>
        <h4 className="bg-secondary text-white mx-0 p-2 rounded">{mes}</h4>
        {filtradas.map((pub) => {
          const esPropia = pub.nombre === userData.nombre;
          const esCandidatoSeleccionado = pub.candidatos?.some((c) => c.asignado);
          const claseFondo = esCandidatoSeleccionado
            ? "success"
            : pub.candidatos?.length
            ? "primary"
            : "warning";

          const claseAnimacion = removingId === pub.id ? "pub-salida" : "";

          return (
            <PubItem
              key={`${pub.lista}${pub.id}`}
              className={claseAnimacion}
              variant={claseFondo}
              margen="p-2 m-1"
              pub={pub}
              esPropia={esPropia}
              expandedPubId={expandedPubId}
              onToggleExpand={() => toggleExpand(pub.id)}
              onBorrarPublicacion={() => handleBorrarPublicacion(pub.id)}
              onToggleAsignado={(candidato) =>
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
        <span>No hay publicaciones para la lista de {lista}</span>
      )}
    </>
  );
}
