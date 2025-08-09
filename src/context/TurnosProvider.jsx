// context/TurnosProvider.js
import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../hooks/useAuth";

const TurnosContext = createContext();

export const TurnosProvider = ({ children }) => {
  const { usuario, loading: loadingUsuario } = useAuth();
  const [turnos, setTurnos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingUsuario) return;

    const cargarTurnos = async () => {
      try {
        const docRef = doc(db, "TURNOS", usuario.nombre);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) setTurnos(docSnap.data());
        else setTurnos(null);
        
      } catch (error) {
        console.error("Error al obtener turnos:", error);
        setTurnos(null);
      } finally {
        setLoading(false);
      }
    };

    cargarTurnos();

  }, [usuario, loadingUsuario]);


  return (
    <TurnosContext.Provider value={{ turnos, loading }}>
      {children}
    </TurnosContext.Provider>
  );
};

export const useTurnosContext = () => useContext(TurnosContext);
