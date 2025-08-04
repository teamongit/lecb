import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    
      if (!authUser) {       
        setUser(null);
        setUserData(null);
        setLoading(false);
        return;
      }
      
      try {
        // 1. Recuperar el doc de USUARIOS con uid
        const q = query(collection(db, "USUARIOS"), where("uid", "==", authUser.uid));
        const querySnapshot = await getDocs(q);
        // 2. Leer los datos del doc del usuario
        const loadedUserData = querySnapshot.empty 
          ? null 
          : querySnapshot.docs[0].data();         
        // 3. Set datos en el contexto
        setUserData(loadedUserData);
        setUser(authUser);
        setLoading(false);

      } catch (error) {
        console.error("Error al obtener los datos de usuario:", error); 
        setUserData(null);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const value = { user, userData, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);