import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useAuth } from "../../../context/AuthProvider";

const obtenerMes = (fecha) =>
  new Date(fecha.seconds * 1000).toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

export default function ListaPublicaciones({ lista }) {
  const [publicacionesPorMes, setPublicacionesPorMes] = useState({});
  const [cargando, setCargando] = useState(true);
  const [expandedPubId, setExpandedPubId] = useState(null);
  const { userData } = useAuth();

  const toggleExpand = (id) => {
    setExpandedPubId(expandedPubId === id ? null : id);
  };

  useEffect(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "PUBLICACIONES"),
      where("fecha", ">=", Timestamp.fromDate(hoy)),
      where("lista", "==", lista),
      where("nucleo", "==", userData.nucleo),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const agrupadas = {};

      snapshot.docs.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        const mes = obtenerMes(data.fecha);
        if (!agrupadas[mes]) agrupadas[mes] = [];
        agrupadas[mes].push(data);
      });

      const ordenadas = Object.fromEntries(
        Object.entries(agrupadas)
          .sort((a, b) => {
            const f1 = new Date(a[1][0].fecha.seconds * 1000);
            const f2 = new Date(b[1][0].fecha.seconds * 1000);
            return f1 - f2;
          })
          .map(([mes, pubs]) => [
            mes,
            pubs.sort((a, b) => a.fecha.seconds - b.fecha.seconds),
          ])
      );

      setPublicacionesPorMes(ordenadas);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [lista]); // <- importante: dependencia

  if (cargando) return <p>Cargando publicaciones...</p>;

  return (
    <>
      {Object.entries(publicacionesPorMes).map(([mes, pubs]) => (
        <div key={mes}>
          <h4 className="bg-secondary text-white mx-0 mt-5 p-2 rounded">
            {mes.charAt(0).toUpperCase() + mes.slice(1)}
          </h4>
          {pubs.map((pub) => (
            <div key={pub.id}>
              <div
                className={`d-flex justify-content-between align-items-center
                  ${pub.candidatos?.length ? "bg-primary-subtle" : "bg-warning-subtle"
                } rounded p-2 m-1`}
                role="button"
                onClick={() => toggleExpand(pub.id)}
              >
                <div>
                  {(() => {
                    const fecha = new Date(pub.fecha.seconds * 1000);
                    const dia = fecha.getDate();
                    const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "short" });

                    let descripcion = `${dia} ${diaSemana}`;
                    return `${descripcion} ${pub.servicio}`;
                  })()}
                </div>
                <div>{pub.apodo} {pub.nucleo} {pub.lado} {pub.equipo}</div>
              </div>

              {expandedPubId === pub.id &&
                pub.candidatos?.map((nombre) => (
                  <div key={nombre} className="bg-light rounded p-2 my-1 mx-3">
                    {nombre}
                  </div>
                ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
