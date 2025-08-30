import { useEffect, useState, useCallback } from "react";
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
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { esDuplicado } from "@/utils/publicaciones";

export const usePublicaciones = () => {
  const { usuario } = useAuth();

  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true); // carga inicial
  const [procesando, setProcesando] = useState(false); // CRUD

  // Leer Listener tiempo real
  useEffect(() => {
    if (!usuario) return; // esperar a que usuario esté listo

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const nucleos = usuario.nucleo.includes("RUTA") ? ["RUTAE", "RUTAW"] : ["TMA"];

    const q = query(
      collection(db, "PUBLICACIONES"),
      where("fecha", ">=", Timestamp.fromDate(hoy)),
      where("nucleo", "in", nucleos),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docsPublicaciones = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublicaciones(docsPublicaciones);
        setLoading(false);
      },
      (error) => {
        console.error("Error en listener de publicaciones:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [usuario]);

  // Agregar publicación
  const agregarPublicacion = useCallback(
    async (nuevaPub) => {
      setProcesando(true);
      try {
        if (esDuplicado(publicaciones, nuevaPub)) {
          throw new Error("duplicado");
        }

        await addDoc(collection(db, "PUBLICACIONES"), nuevaPub);
        
      } catch (error) {
        console.error("Error al agregar publicación:", error);
        throw error;
      } finally {
        setProcesando(false);
      }
    },
    [publicaciones]
  );

  // Editar publicación
  const editarPublicacion = useCallback(async (id, datosActualizados) => {
    setProcesando(true);
    try {      
      await updateDoc(doc(db, "PUBLICACIONES", id), datosActualizados);
    } catch (error) {
      console.error("Error al editar publicación:", error);
      throw error;
    } finally {
      setProcesando(false);
    }
  }, []);

  // Borrar publicación
  const borrarPublicacion = useCallback(
    async (id) => {
      setProcesando(true);
      try {
        const borrarPub = publicaciones.find((p) => p.id === id);
        if (!borrarPub) throw new Error("no-encontrado");

        // Actualizar publicaciones donde usuario es candidato
        const publicacionesMatch = publicaciones.filter((p) =>
          p.candidatos?.some((c) => c.pubId === id)
        );

        for (const pubMatch of publicacionesMatch) {
          const esAsignado = pubMatch.candidatos.some(
            (c) => c.pubId === id && c.asignado
          );

          const nuevosCandidatos = pubMatch.candidatos.filter((c) => c.pubId !== id);

          const nuevosDatosPubMatch = { candidatos: nuevosCandidatos };
          if (esAsignado) nuevosDatosPubMatch.estado = "publicado";

          await editarPublicacion(pubMatch.id, nuevosDatosPubMatch);
        }

        await deleteDoc(doc(db, "PUBLICACIONES", id));
      } catch (error) {
        console.error("Error al borrar publicación:", error);
        throw error;
      } finally {
        setProcesando(false);
      }
    },
    [publicaciones, editarPublicacion]
  );
  
  return {
    publicaciones,
    loading,
    procesando,
    agregarPublicacion,
    editarPublicacion,
    borrarPublicacion,
  };
};
