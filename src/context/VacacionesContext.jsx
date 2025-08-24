import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { obtenerProximosCiclos } from "../utils/proximosCiclos";

const VacacionesContext = createContext();

export function VacacionesProvider({ children }) {
  const [vacaciones, setVacaciones] = useState(null);
  const [integrantes, setIntegrantes] = useState(null);
  const [cantidades, setCantidades] = useState(null);
  const [ciclos, setCiclos] = useState(null);
  const [proximosCiclos, setProximosCiclos] = useState(null);
  const [normas, setNormas] = useState(null);

  useEffect(() => {
    // const docRef = doc(db, "VACACIONES", "BACKUP");
    const docRef = doc(db, "VACACIONES", "LECB_RUTA_3E");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          // separar los contextos para prevenir re-renderizados posteriores
          setVacaciones(docSnap.data());
          setCantidades(docSnap.data().integrantes);
          setIntegrantes(docSnap.data().integrantes);
          setCiclos(docSnap.data().ciclos);
          setNormas(docSnap.data().normas);

          // console.log("useVacaciones:", docSnap.data().integrantes.map(i => i.nombre));

        } else {
          console.warn("No existe el documento.");

        }
      },
      (error) => {
        console.error("Error al escuchar el documento:", error);

      }
    );

    // Limpieza del listener al desmontar
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    
    setProximosCiclos(obtenerProximosCiclos());
  }, []);

  const guardarVacaciones = async () => {
    try {
      const ref = doc(db, "VACACIONES", "2026_LECB_RUTA_3_E");
      await setDoc(ref, vacaciones, { merge: true });
      console.log("Vacaciones guardadas:", vacaciones);
    } catch (error) {
      console.error("Error al guardar vacaciones:", error);
    }
  };

  return (
    <VacacionesContext.Provider
      value={{ 
        vacaciones, setVacaciones, 
        integrantes, setIntegrantes,
        cantidades, setCantidades,
        proximosCiclos, setProximosCiclos,
        ciclos, setCiclos,
        normas, setNormas,
        guardarVacaciones 
      }}
    >
      {children}
    </VacacionesContext.Provider>
  );
}

export function useVacaciones() {
  const context = useContext(VacacionesContext);
  if (!context) {
    throw new Error("useVacaciones debe usarse dentro de un VacacionesProvider");
  }
  return context;
}
