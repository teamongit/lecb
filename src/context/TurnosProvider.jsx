// context/TurnosProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../hooks/useAuth";

const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const { userData, loading: authLoading } = useAuth();
  const [turnos, setTurnos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTurnos = async () => {
      if (!userData?.nombre) {
        setTurnos(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "TURNOS", userData.nombre);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTurnos(docSnap.data());
        } else {
          setTurnos(null);
        }
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        setTurnos(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) cargarTurnos();
  }, [userData, authLoading]);

  return (
    <TurnosContext.Provider value={{ turnos, loading }}>
      {children}
    </TurnosContext.Provider>
  );
};

export const useTurnosContext = () => useContext(TurnosContext);
