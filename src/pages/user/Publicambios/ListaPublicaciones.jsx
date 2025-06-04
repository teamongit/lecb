import { useState } from "react";

export default function ListaPublicaciones({ data }) {
  const [expandedPubId, setExpandedPubId] = useState(null);

  if (!data || !data.publicaciones) return null;

  const publicacionesFiltradas = data.publicaciones.filter(
    (pub) => pub.ofrece && pub.solicita.modalidad === "P6"
  );
  publicacionesFiltradas.sort((a, b) => new Date(a.cuando) - new Date(b.cuando));

  const publicacionesPorMes = {};
  publicacionesFiltradas.forEach((pub) => {
    const fecha = new Date(pub.cuando);
    const mes = fecha.toLocaleString("es-ES", { month: "long", year: "numeric" });
    if (!publicacionesPorMes[mes]) publicacionesPorMes[mes] = [];
    publicacionesPorMes[mes].push(pub);
  });

  const toggleExpand = (id) => {
    setExpandedPubId(expandedPubId === id ? null : id);
  };

  return (
    <>
      {Object.entries(publicacionesPorMes).map(([mes, pubs]) => (
        <div key={mes}>
          <h4 className="bg-secondary text-white m-0 p-2 rounded">
            {mes.charAt(0).toUpperCase() + mes.slice(1)}
          </h4>
          {pubs.map((pub) => (
            <div key={pub.id}>
              <div
                className={`${pub.apuntados ? 'bg-primary-subtle' : 'bg-warning-subtle'} rounded p-2 m-1`}
                role="button"
                onClick={() => toggleExpand(pub.id)}
              >
                {new Date(pub.cuando).toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                })}{" "}
                {pub.ofrece.servicio} {data.usuarios[pub.de].apodo} {data.usuarios[pub.de].nucleo}{" "}
                {data.usuarios[pub.de].equipo}
              </div>

              {expandedPubId === pub.id && pub.apuntados && pub.apuntados.length > 0 && (
             
                  pub.apuntados.map((usuarioId) => (
                    <div key={usuarioId} className="bg-light rounded p-2 my-1 mx-3">
                      {data.usuarios[usuarioId]?.apodo} {data.usuarios[usuarioId]?.nucleo} {data.usuarios[usuarioId]?.equipo}
                    </div>
                  ))

              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
