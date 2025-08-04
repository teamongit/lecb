import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { anadirCandidatos, esDuplicado, esMatch } from "../utils/publicaciones";

export const usePublicaciones = () => {
  const { userData } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  // CRUD básico de publicaciones
  
  // Read Publicaciones filtradas (query): Listener tiempo real
  useEffect(() => {
    // if (!userData) return;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // TODO: En el futuro cambiar si solo somos compatibles dentro del mismo nucleo
    const nucleos = userData.nucleo.includes("RUTA")
      ? ["RUTAE", "RUTAW"]
      : ["TMA"];

    const q = query(
      collection(db, "PUBLICACIONES"),
      where("fecha", ">=", Timestamp.fromDate(hoy)),
      where("nucleo", "in", nucleos),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Añadimos el campo id del doc a cada publicacion
      const docsPublicaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPublicaciones(docsPublicaciones);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create Publicacion con candidatos compatibles y actualizar publicaciones existentes añadiendo al usuario como candidato
  const agregarPublicacion = async (nuevaPub) => {    
    try {
      // Buscar duplicados localmente: No agregar publicacion
      if (esDuplicado(publicaciones, nuevaPub)) {
        return "duplicado";
      }
      // Agregar publicacion
      // Filtrar publicaciones existentes compatibles
      const pubsMatch = publicaciones.filter(pub => { 
        return esMatch(pub, nuevaPub);
      });

      // 1. Añadir candidatos a nuevaPub
      if (pubsMatch.length) {
        anadirCandidatos(pubsMatch, nuevaPub);
      }
      const colRef = collection(db, "PUBLICACIONES");
      const docRef = await addDoc(colRef, nuevaPub);

      // 2. Añadir usuario que publica como candidato a las publicaciones que ya existen: en firestore y en local
      for (const pubMatch of pubsMatch) {
        const docMatchRef = doc(db, "PUBLICACIONES", pubMatch.id);
        await updateDoc(docMatchRef, {
          candidatos: arrayUnion({            
            nombre:   nuevaPub.nombre,
            apodo:    nuevaPub.apodo,
            equipo:   nuevaPub.equipo,
            nucleo:   nuevaPub.nucleo,
            turno:    nuevaPub.ofrece.turno,
            pubId:    docRef.id,
            asignado: false,
          }),
        });
      }
      // TODO: Para que devolvemos esto?
      return { id: docRef.id, ...nuevaPub };

    } catch (error) {
      console.error("Error al agregar publicación:", error);
      return "error";
    }
  };

  const editarPublicacion = async (id, datosActualizados) => {
    try {
      await updateDoc(doc(db, "PUBLICACIONES", id), datosActualizados);
    } catch (error) {
      console.error("Error al editar publicación:", error);
      throw error;
    }
  };

  const borrarPublicacion = async (id) => {
    try {
      const borrarPub = publicaciones.find(p => p.id === id);
      
      if (borrarPub) {
        
        // Filtrar publicaciones donde usuario es candidato
        const publicacionesMatch = publicaciones.filter(p =>          
          p.candidatos.some(c => c.pubId === id)
        );

        for (const pubMatch of publicacionesMatch) {          
          // Si usuario es asignado cambiar estado
          const esAsignado = pubMatch.candidatos.some(c => c.pubId === id && c.asignado)
          // Filtrar candidatos para eliminar a usuario
          const nuevosCandidatos  = pubMatch.candidatos.filter(c => c.pubId !== id);
          const nuevosDatosPubMatch = {
            candidatos: nuevosCandidatos,
          };
          if (esAsignado) {
            nuevosDatosPubMatch.estado = "publicado";
          }          
          await editarPublicacion(pubMatch.id, nuevosDatosPubMatch);
        }
      }
      await deleteDoc(doc(db, "PUBLICACIONES", id));
    } catch (error) {
      console.error("Error al borrar publicación:", error);
      throw error;
    }
  };

  return {
    publicaciones,
    loading,
    agregarPublicacion,
    borrarPublicacion,
    editarPublicacion,
  };
};
