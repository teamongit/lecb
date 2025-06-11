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

export const usePublicaciones = () => {
  const { userData } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const listaContraria = { P6: "HV", HV: "P6" };
  // Listener tiempo real
  useEffect(() => {
    if (!userData?.nucleo) return;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "PUBLICACIONES"),
      where("fecha", ">=", Timestamp.fromDate(hoy)),
      where("nucleo", "==", userData.nucleo),
      orderBy("fecha", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPublicaciones(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);

  // CRUD básico
  const agregarPublicacion = async (nuevaPub) => {
    
    try {
      // Buscar duplicados localmente
      const yaExiste = publicaciones.some((pub) => {
        return (
          pub.nombre === nuevaPub.nombre &&
          pub.lista === nuevaPub.lista &&
          pub.jornada === nuevaPub.jornada &&
          pub.fecha.toDate().getTime() === nuevaPub.fecha.toDate().getTime()
        );
      });

      if (yaExiste) {
        return "duplicado";
      }

      // Añadir candidato compatible
      const contraria = listaContraria[nuevaPub.lista];
      const pubsCandidatos = publicaciones.filter((pub) => {
        const hayAsignado = pub.candidatos.some(c => c.asignado);
        const mismaFecha =  pub.fecha.toDate().getTime() === nuevaPub.fecha.toDate().getTime();
        const mismoNucleo = pub.nucleo  === nuevaPub.nucleo;
        const mismoLado = nuevaPub.jornada === "N" ? pub.lado === nuevaPub.lado : true;
        const turnoCompatible = (pub.jornada === nuevaPub.jornada || pub.servicio === nuevaPub.servicio);
        return (
          pub.lista === contraria &&
          mismaFecha &&
          mismoNucleo &&
          mismoLado &&
          !hayAsignado &&
          turnoCompatible
        );
      });

      // Añadir candidatos a la pub que estamos creando (nuevaPub)
      if (pubsCandidatos.length) {
        nuevaPub.candidatos = pubsCandidatos.map((pubCandidato) => ({
          nombre:   pubCandidato.nombre,
          lista:    pubCandidato.lista,
          apodo:    pubCandidato.apodo,          
          equipo:   pubCandidato.equipo,
          lado:     pubCandidato.lado,
          jornada:  pubCandidato.jornada,
          servicio: pubCandidato.servicio,
          pubId:    pubCandidato.id,
          asignado: false,
        }));
      }

      const colRef = collection(db, "PUBLICACIONES");
      const docRef = await addDoc(colRef, nuevaPub);

      // Añadirme como candidato a los docs que ya existen
      for (const pubCandidato of pubsCandidatos) {
        const docCandidatoRef = doc(db, "PUBLICACIONES", pubCandidato.id);
        await updateDoc(docCandidatoRef, {
          candidatos: arrayUnion({            
            nombre:   nuevaPub.nombre,
            lista:    nuevaPub.lista,
            apodo:    nuevaPub.apodo,
            equipo:   nuevaPub.equipo,
            lado:     nuevaPub.lado,
            jornada:  nuevaPub.jornada,
            servicio: nuevaPub.servicio,
            pubId:    docRef.id,
            asignado: false,
          }),
        });
      }
      
      return { id: docRef.id, ...nuevaPub };

    } catch (error) {
      console.error("Error al agregar publicación:", error);
      return "error";
    }
  };


  const borrarPublicacion = async (pubId) => {
    try {
      await deleteDoc(doc(db, "PUBLICACIONES", pubId));
    } catch (error) {
      console.error("Error al borrar publicación:", error);
      throw error;
    }
  };

  const editarPublicacion = async (pubId, datosActualizados) => {

    try {
      await updateDoc(doc(db, "PUBLICACIONES", pubId), datosActualizados);
    } catch (error) {
      console.error("Error al editar publicación:", error);
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
