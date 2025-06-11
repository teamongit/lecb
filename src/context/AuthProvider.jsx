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
        // 1. Recuperar el doc de USUARIOS con authId
        const q = query(collection(db, "USUARIOS"), where("authId", "==", authUser.uid));
        const querySnapshot = await getDocs(q);
        // 2. Leer los datos del doc del usuario
        let loadedUserData = null;
        if (!querySnapshot.empty) {
          loadedUserData = querySnapshot.docs[0].data();
        }
        // 3. Set datos en el contexto
        setUserData(loadedUserData);
        setUser(authUser);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching user data:", error); 
        setUserData(null);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


  const tagUsuario = userData
  ? [userData.apodo, userData.equipo, userData.lado]
      .filter(Boolean)
      .join(" ")
  : "";
  const login = async (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const value = { user, userData, tagUsuario, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);