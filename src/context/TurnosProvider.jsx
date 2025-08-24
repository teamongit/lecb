// context/TurnosProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth";

const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const { usuario, loading: loadingUsuario } = useAuth();
  const [turnos, setTurnos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [turneros, setTurneros] = useState(null);

  useEffect(() => {
    if (loadingUsuario || !usuario) return;

    // --- TURNOS: suscripción en tiempo real, manteniendo orden alfabético de claves ---
    const unsubTurnos = onSnapshot(
      doc(db, "TURNOS", usuario.nombre),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const turnosOrdenados = Object.keys(data)
            .sort((a, b) => a.localeCompare(b))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});
          setTurnos(turnosOrdenados);
        } else {
          setTurnos(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener turnos:", error);
        setTurnos(null);
        setLoading(false);
      }
    );

    // --- TURNEROS_PUBLICADOS: 3 docs (mes actual y +2), fusionados en un objeto plano como en tu original ---
    const hoy = new Date();
    const dependencia = usuario.dependencia;
    const nucleo = usuario.nucleo.includes("RUTA") ? "RUTA" : "TMA";

    // cache local por ID de doc -> data
    const cacheTurneros = {};
    const unsubTurneros = [];

    for (let offset = 0; offset <= 2; offset++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + offset, 1);
      const aaaa = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, "0");
      const id = `${dependencia}_${aaaa}_${mm}_${nucleo}`;

      const unsub = onSnapshot(
        doc(db, "TURNEROS_PUBLICADOS", id),
        (docSnap) => {
          if (docSnap.exists()) {
            cacheTurneros[id] = docSnap.data();
          } else {
            delete cacheTurneros[id];
          }

          // fusionar TODOS los docs en un único objeto plano (igual que con Object.assign en tu getDoc)
          const turnosAcumulados = {};
          Object.values(cacheTurneros).forEach((obj) => Object.assign(turnosAcumulados, obj));

          setTurneros(
            Object.keys(turnosAcumulados).length ? turnosAcumulados : null
          );
          setLoading(false);
        },
        (error) => {
          console.error("Error al obtener turneros:", error);
          setLoading(false);
        }
      );

      unsubTurneros.push(unsub);
    }

    // limpieza
    return () => {
      unsubTurnos();
      unsubTurneros.forEach((fn) => fn());
    };
  }, [usuario, loadingUsuario]);

  // Mantengo tu API y actualización optimista
  const cambiarTurno = async (fecha, nuevoTurno) => {
    if (!usuario || !turnos) return;

    try {
      const docRef = doc(db, "TURNOS", usuario.nombre);
      // Optimista: igual que en tu original
      setTurnos((prev) => ({ ...(prev || {}), [fecha]: nuevoTurno }));
      await updateDoc(docRef, { [fecha]: nuevoTurno });
      console.log(`Turno actualizado: ${fecha} -> ${nuevoTurno}`);
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
    }
  };

  return (
    <TurnosContext.Provider value={{ turnos, loading, turneros, cambiarTurno }}>
      {children}
    </TurnosContext.Provider>
  );
};

export const useTurnosContext = () => useContext(TurnosContext);
