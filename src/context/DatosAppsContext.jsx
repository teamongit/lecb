import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

const DatosAppsContext = createContext();

export const DatosAppsProvider = ({ children }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "miColeccion"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDatos(items);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    obtenerDatos();
  }, []);

  const agregarDato = async (nuevoDato) => {
    try {
      const docRef = await addDoc(collection(db, "LECB"), nuevoDato);
      setDatos(prev => [...prev, { id: docRef.id, ...nuevoDato }]);
    } catch (error) {
      console.error("Error al agregar dato:", error);
    }
  };

  return (
    <DatosAppsContext.Provider value={{ datos, agregarDato }}>
      {children}
    </DatosAppsContext.Provider>
  );
};

export const useDatosApps = () => useContext(DatosAppsContext);



// // src/context/DatosAppsContext.jsx
// import { createContext, useContext, useState } from "react";
// import {datosApps} from "../data/datosApps";

// const DatosAppsContext = createContext();

// export function DatosAppsProvider({ children }) {
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState({});

//   const cargarCampo = async (campo) => {
//     if (data[campo]) return; // ya está cargado

//     if (loading[campo]) return; // ya se está cargando

//     setLoading((prev) => ({ ...prev, [campo]: true }));

//     // Simular un "fetch"
//     await new Promise((res) => setTimeout(res, 500));
//     const valor = datosApps[campo];

//     setData((prev) => ({ ...prev, [campo]: valor }));
//     setLoading((prev) => ({ ...prev, [campo]: false }));
//   };

//   return (
//     <DatosAppsContext.Provider value={{ data, loading, cargarCampo }}>
//       {children}
//     </DatosAppsContext.Provider>
//   );
// }

// export function useDatosApps() {
//   return useContext(DatosAppsContext);
// }
