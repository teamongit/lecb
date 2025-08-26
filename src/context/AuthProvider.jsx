//context/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import LoadingSpinner from "../components/LoadingSpinner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(null); // auth
  const [usuario, setUsuario] = useState(null);         // doc
  const [loading, setLoading] = useState(true);         // lock

  // 1. autenticado
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (usuarioAutenticado) => {
      if (!usuarioAutenticado) {
        setAutenticado(null);
        setUsuario(null);
        setLoading(false);
        return;
      }
      setAutenticado(usuarioAutenticado);
      setLoading(true); // ahora esperamos el doc de usuario
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. usuario
  useEffect(() => {
    if (!autenticado) return;

    const docRef = doc(db, "USUARIOS", autenticado.uid);
    const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
      if (!docSnap.exists()) {
        console.warn("El usuario no tiene documento en Firestore. Cerrando sesión...");
        signOut(auth);
        setUsuario(null);
        setLoading(false);
        return;
      }
      setUsuario(docSnap.data());
      setLoading(false);
    });

    return () => unsubscribeDoc();
  }, [autenticado]);

  // funciones de auth
  const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const resetPw = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      // ?? Que hacemos con esto luego, quien lo recibe y como lo muestra?
      return { success: true, message: "Correo de restablecimiento enviado." };
    } catch (error) {
      // ?? Que hacemos con esto luego, quien lo recibe y como lo muestra?
      return { success: false, message: error.message };
    }
  };

  const value = { autenticado, usuario, loading, login, logout, resetPw };

  // esperar mientras carga autenticado y usuario
  if (loading) return <LoadingSpinner />;
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);