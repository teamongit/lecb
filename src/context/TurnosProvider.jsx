// context/TurnosProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth";

const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const { usuario, loading: loadingUsuario } = useAuth();
  const [turnos, setTurnos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [turnero, setTurnero] = useState(null);

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
    const cacheTurnero = {};
    const unsubTurnero = [];

    for (let offset = 0; offset <= 2; offset++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + offset, 1);
      const aaaa = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, "0");
      const id = `${dependencia}_${aaaa}_${mm}_${nucleo}`;

      const unsub = onSnapshot(
        doc(db, "TURNEROS_PUBLICADOS", id),
        (docSnap) => {
          if (docSnap.exists()) {
            cacheTurnero[id] = docSnap.data();
          } else {
            delete cacheTurnero[id];
          }

          // fusionar TODOS los docs en un único objeto plano (igual que con Object.assign en tu getDoc)
          const turnosAcumulados = {};
          Object.values(cacheTurnero).forEach((obj) => Object.assign(turnosAcumulados, obj));

          setTurnero(
            Object.keys(turnosAcumulados).length ? turnosAcumulados : null
          );
          setLoading(false);
        },
        (error) => {
          console.error("Error al obtener turneros:", error);
          setLoading(false);
        }
      );

      unsubTurnero.push(unsub);
    }

    // limpieza
    return () => {
      unsubTurnos();
      unsubTurnero.forEach((fn) => fn());
    };
  }, [usuario, loadingUsuario]);

  
  const cambiarTurno = async (fecha, nombre, nuevoTurno) => {
    // if (!usuario || !turnos) return;

    try {
      const docRef = doc(db, "TURNOS", nombre);
      // Optimista: igual que en tu original
      setTurnos((prev) => ({ ...(prev || {}), [fecha]: nuevoTurno }));
      await updateDoc(docRef, { [fecha]: nuevoTurno });
      console.log(`Turno actualizado: ${fecha} -> ${nuevoTurno}`);
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
    }
  };

  const intercambiarTurnos = async (fecha, usuarioNombre, usuarioTurno, candidatoNombre, candidatoTurno, ) => {
    try {
      console.log(fecha, usuarioNombre, usuarioTurno, candidatoNombre, candidatoTurno);
      const [aaaa, mm, dd] = fecha.split("-");
      const nucleoDependencia = usuario.nucleo.includes("RUTA") ? "RUTA" : usuario.nucleo;
      const docId = `${usuario.dependencia}_${aaaa}_${mm}_${nucleoDependencia}`;
      const docRef = doc(db, "TURNEROS_ACTUALIZADOS", docId);

      // quitar
      await updateDoc(docRef, {
        [`${fecha}.${usuarioTurno}`]: arrayRemove(usuarioNombre),
        [`${fecha}.${candidatoTurno}`]: arrayRemove(candidatoNombre)
      });
      // añadir
      await updateDoc(docRef, {
        [`${fecha}.${usuarioTurno}`]: arrayUnion(candidatoNombre),
        [`${fecha}.${candidatoTurno}`]: arrayUnion(usuarioNombre)
      });
      // intercambiar
      await cambiarTurno(fecha, candidatoNombre, usuarioTurno);
      await cambiarTurno(fecha, usuarioNombre, candidatoTurno);
      
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
    }
  };

  return (
    <TurnosContext.Provider value={{ turnos, loading, turnero, cambiarTurno, intercambiarTurnos }}>
      {children}
    </TurnosContext.Provider>
  );
};

export const useTurnosContext = () => useContext(TurnosContext);
