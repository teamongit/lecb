//context/AuthProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import LoadingSpinner from "../components/LoadingSpinner";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(null);       // auth
  const [usuario, setUsuario] = useState(null);  // doc
  const [loading, setLoading] = useState(true); // lock

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuarioAutenticado) => {
      
      if (!usuarioAutenticado) {            
        setAutenticado(null);
        setUsuario(null);
        setLoading(false);
        return;
      }
      
      try {
        // 1. Obtener el doc de usuario
        const docRef = doc(db, "USUARIOS", usuarioAutenticado.uid);
        const docSnap = await getDoc(docRef);
        const datosUsuario = docSnap.exists() ? docSnap.data() : null;
        // 2. Usuario autenticado sin doc de usuario
        if (!docSnap.exists()) {
          console.warn("El usuario no tiene documento en Firestore. Cerrando sesión...");
          await signOut(auth);
          setAutenticado(null);
          setUsuario(null);
          return;
        }
        // 3. Set datos en el contexto
        setAutenticado(usuarioAutenticado);
        setUsuario(datosUsuario);
 
      } catch (error) {
        console.error("Error al obtener los datos de usuario:", error); 
        setUsuario(null);
        setAutenticado(null);
        
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const value = useMemo(
    () => ({ autenticado, usuario, loading, login, logout }), 
    [autenticado, usuario, loading]
  );
  
  if (loading) return <LoadingSpinner />; 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);