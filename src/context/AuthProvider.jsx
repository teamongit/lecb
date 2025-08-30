// context/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signOut, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword 
} from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { triggerToast } = useToast();
  const [autenticado, setAutenticado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Estado de autenticación
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (usuarioAutenticado) => {
      if (!usuarioAutenticado) {
        setAutenticado(null);
        setUsuario(null);
        setLoading(false);
        return;
      }
      setAutenticado(usuarioAutenticado);
      setLoading(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Obtener doc de usuario
  useEffect(() => {
    if (!autenticado) return;

    const docRef = doc(db, "USUARIOS", autenticado.uid);
    const unsubscribeDoc = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          triggerToast("No se encontró el usuario en Firestore", { severity: "error" });
          signOut(auth);
          setUsuario(null);
          setLoading(false);
          return;
        }
        setUsuario(docSnap.data());
        setLoading(false);
      },
      (error) => {
        console.error("Error leyendo Firestore:", error);
        triggerToast("Error de conexión con Firestore", { severity: "error" });
        setLoading(false);
      }
    );

    return () => unsubscribeDoc();
  }, [autenticado]);

  // Funciones de auth
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      triggerToast("Sesión iniciada correctamente", { severity: "success" });
    } catch (error) {
      console.error(error);
      let msg = "Error al iniciar sesión";
      switch (error.code) {
        case "auth/user-not-found":
          msg = "Usuario no encontrado";
          break;
        case "auth/wrong-password":
          msg = "Contraseña incorrecta";
          break;
        case "auth/too-many-requests":
          msg = "Demasiados intentos fallidos. Intenta más tarde";
          break;
        case "auth/invalid-email":
          msg = "Correo electrónico no válido";
          break;
      }
      triggerToast(msg, { severity: "error" });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      triggerToast("Sesión cerrada", { severity: "info" });
    } catch (error) {
      console.error(error);
      triggerToast("Error al cerrar sesión", { severity: "error" });
    }
  };

  const recordarContrasena = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      triggerToast("Correo de restablecimiento enviado.", { severity: "success" });
    } catch (error) {
      console.error(error);
      let msg = "Error al enviar correo";
      switch (error.code) {
        case "auth/user-not-found":
          msg = "Usuario no encontrado";
          break;
        case "auth/invalid-email":
          msg = "Correo electrónico no válido";
          break;
        case "auth/too-many-requests":
          msg = "Demasiados intentos, intente más tarde";
          break;
      }
      triggerToast(msg, { severity: "error" });
    }
  };

  // --- NUEVA FUNCIÓN PARA ACTUALIZAR DATOS Y/O CONTRASEÑA ---
  const actualizarUsuario = async (updates, pwActual, pwNuevo) => {
    if (!usuario || !autenticado) {
      return triggerToast("Usuario no autenticado", { severity: "error" });
    }

    // No hay cambios ni contraseña
    if ((!updates || Object.keys(updates).length === 0) && !pwNuevo) {
      return triggerToast("No hay cambios que actualizar", { severity: "info" });
    }

    // Contraseña actual obligatoria
    if (!pwActual) {
      return triggerToast("Debes introducir la contraseña actual para aplicar cambios", { severity: "error" });
    }

    try {
      // Re-autenticación
      const credential = EmailAuthProvider.credential(usuario.email, pwActual);
      await reauthenticateWithCredential(autenticado, credential);

      // Cambiar contraseña si hay nueva
      if (pwNuevo) {
        if (pwNuevo.length < 6) {
          return triggerToast("Contraseña nueva demasiado débil (mínimo 6 caracteres)", { severity: "error" });
        }
        await updatePassword(autenticado, pwNuevo);
        triggerToast("Contraseña actualizada", { severity: "success" });
      }

      // Actualizar Firestore
      if (updates && Object.keys(updates).length > 0) {
        const userRef = doc(db, "USUARIOS", autenticado.uid);
        await updateDoc(userRef, updates);
        triggerToast("Datos actualizados correctamente", { severity: "success" });
      }

    } catch (err) {
      console.error(err);
      let msg = "Error al actualizar usuario";
      switch (err.code) {
        case "auth/invalid-credential":
          msg = "Contraseña actual incorrecta";
          break;
        case "auth/wrong-password":
          msg = "Contraseña actual incorrecta";
          break;
        case "auth/weak-password":
          msg = "Contraseña nueva demasiado débil (mín. 6 caracteres)";
          break;
        case "auth/requires-recent-login":
          msg = "Debes volver a iniciar sesión para cambiar la contraseña";
          break;
        case "auth/too-many-requests":
          msg = "Demasiados intentos, inténtalo más tarde";
          break;
        case "auth/user-disabled":
          msg = "Usuario deshabilitado";
          break;
        case "auth/user-not-found":
          msg = "Usuario no encontrado";
          break;
        case "permission-denied":
          msg = "No tienes permisos para actualizar";
          break;
        case "unavailable":
          msg = "Servicio no disponible";
          break;
      }
      triggerToast(msg, { severity: "error" });
    }
  };


  const cambiarContrasena = async (pwActual, pwNuevo) => {
    try {
      if (!usuario || !autenticado) {
        triggerToast("Usuario no autenticado", { severity: "error" });
        return;
      }
      if (!pwNuevo) {
        triggerToast("Falta contraseña nueva", { severity: "error" });
        return;
      }

      const credential = EmailAuthProvider.credential(usuario.email, pwActual);
      await reauthenticateWithCredential(autenticado, credential);
      await updatePassword(autenticado, pwNuevo);
      triggerToast("Contraseña actualizada", { severity: "success" });
    } catch (err) {
      console.error(err);
      let msg = "Error al actualizar contraseña";
      switch (err.code) {
        case "auth/wrong-password":
          msg = "Contraseña actual incorrecta";
          break;
        case "auth/weak-password":
          msg = "Contraseña nueva demasiado débil (mín. 6 caracteres)";
          break;
        case "auth/requires-recent-login":
          msg = "Debes volver a iniciar sesión para cambiar la contraseña";
          break;
        case "auth/too-many-requests":
          msg = "Demasiados intentos, inténtalo más tarde";
          break;
        case "auth/user-disabled":
          msg = "Usuario deshabilitado";
          break;
        case "auth/user-not-found":
          msg = "Usuario no encontrado";
          break;
      }
      triggerToast(msg, { severity: "error" });
    }
  };

  const value = { autenticado, usuario, loading, login, logout, actualizarUsuario, recordarContrasena, cambiarContrasena };

  if (loading) return <LoadingSpinner />;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
