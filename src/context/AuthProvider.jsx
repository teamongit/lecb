//context/AuthProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signOut, 
} from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import LoadingSpinner from "../components/LoadingSpinner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(null); // auth
  const [usuario, setUsuario] = useState(null);  // doc
  const [loading, setLoading] = useState(true); // lock

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (usuarioAutenticado) => {
      
  //     if (!usuarioAutenticado) {            
  //       setAutenticado(null);
  //       setUsuario(null);
  //       setLoading(false);
  //       return;
  //     }
      
  //     try {
  //       // 1. Obtener el doc de usuario
  //       const docRef = doc(db, "USUARIOS", usuarioAutenticado.uid);
  //       const docSnap = await getDoc(docRef);
  //       const datosUsuario = docSnap.exists() ? docSnap.data() : null;
  //       // 2. Usuario autenticado sin doc de usuario
  //       if (!docSnap.exists()) {
  //         console.warn("El usuario no tiene documento en Firestore. Cerrando sesión...");
  //         await signOut(auth);
  //         setAutenticado(null);
  //         setUsuario(null);
  //         return;
  //       }
  //       // 3. Set datos en el contexto
  //       setAutenticado(usuarioAutenticado);
  //       setUsuario(datosUsuario);
 
  //     } catch (error) {
  //       console.error("Error al obtener los datos de usuario:", error); 
  //       setUsuario(null);
  //       setAutenticado(null);
        
  //     } finally {
  //       setLoading(false);
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);
useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, (usuarioAutenticado) => {
    if (!usuarioAutenticado) {
      setAutenticado(null);
      setUsuario(null);
      setLoading(false);
      return;
    }
    setAutenticado(usuarioAutenticado);
    setLoading(true); // ahora esperamos el doc
  });
  return () => unsubscribeAuth();
}, []);

useEffect(() => {
  if (!autenticado) return;

  const docRef = doc(db, "USUARIOS", autenticado.uid);
  const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      console.warn("El usuario no tiene documento en Firestore. Cerrando sesión...");
      signOut(auth); // no await aquí
      setUsuario(null);
      setLoading(false);
      return;
    }
    setUsuario(docSnap.data());
    setLoading(false);
  });

  return () => unsubscribeDoc();
}, [autenticado]);


  const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  
  const resetPw = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Correo de restablecimiento enviado." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  const value = useMemo(
    () => ({ autenticado, usuario, loading, login, logout, resetPw }), 
    [autenticado, usuario, loading]
  );
  
  if (loading) return <LoadingSpinner />; 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);