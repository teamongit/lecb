import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { InputGroup, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { db } from '../../../firebase/firebaseConfig';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useAuth } from '../../../hooks/useAuth';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Divider } from '@mui/material';

function PasswordInput({ label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup className="mb-2">
      <InputGroup.Text className="w-50">{label}</InputGroup.Text>
      <Form.Control
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
      />
      <Button
        variant="outline-secondary"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeSlash /> : <Eye />}
      </Button>
    </InputGroup>
  );
}

export function DatosUsuario() {
  const { usuario, autenticado } = useAuth();
  
  const [apodo, setApodo] = useState(usuario.apodo || '');
  const [email, setEmail] = useState(usuario.email || '');
  const [telefono, setTelefono] = useState(usuario.telefono);
  const [licencia, setLicencia] = useState(usuario.licencia);
  const [nivelProfesional, setNivelProfesional] = useState(usuario.nivelProfesional);
  const [promocion, setPromocion] = useState(usuario.promocion);
  // credenciales de reautenticación SIEMPRE requeridas
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
    // nueva contraseña opcional
  const [newPassword, setNewPassword] = useState('');
  // estado para feedback
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const handleActualizar = async () => {
    if (!usuario) return;

    const updatesFirestore = {};

    // Detectamos campos cambiados para Firestore
    if (apodo !== usuario.apodo) updatesFirestore.apodo = apodo;
    if (telefono !== usuario.telefono) updatesFirestore.telefono = telefono;
    if (licencia !== (usuario.licencia)) updatesFirestore.licencia = licencia;
    if (nivelProfesional !== (usuario.nivelProfesional)) updatesFirestore.nivelProfesional = nivelProfesional;
    if (promocion !== (usuario.promocion)) updatesFirestore.promocion = promocion;
    // console.log(autenticado)
    try {
      // 1. Reautenticación SIEMPRE
      const credential = EmailAuthProvider.credential(authEmail, authPassword);
      await reauthenticateWithCredential(autenticado, credential);

      // 2. Cambiar email si fue modificado
      if (email !== usuario.email) {
        await updateEmail(autenticado, email);
        updatesFirestore.email = email;
      }

      // 3. Cambiar contraseña si se ingresó nueva
      if (newPassword) {
        await updatePassword(autenticado, newPassword);
      }

      // 4. Actualizar Firestore si hay cambios
      if (Object.keys(updatesFirestore).length > 0) {
        const userRef = doc(db, "USUARIOS", autenticado.uid);
        await updateDoc(userRef, updatesFirestore);
      }

      setToastMsg("✅ Datos actualizados correctamente");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      // traducción básica de errores comunes
      let msg = "❌ Error al actualizar";
      if (error.code === "auth/invalid-email") msg = "❌ El email no es válido";
      if (error.code === "auth/wrong-password") msg = "❌ Contraseña incorrecta";
      if (error.code === "auth/user-mismatch") msg = "❌ El email no coincide con tu usuario";
      console.log("Mostrando toast de error...");
      setToastMsg(msg);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🖖 Apodo</InputGroup.Text>
        <Form.Control value={apodo} onChange={(e) => setApodo(e.target.value)} />
      </InputGroup>

      {/* Campos no editables */}
      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🏢 Dependencia</InputGroup.Text>
        <Form.Control placeholder={usuario.dependencia} readOnly />
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">👾 Núcleo</InputGroup.Text>
        <Form.Control placeholder={usuario.nucleo} readOnly />
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🫂 Equipo</InputGroup.Text>
        <Form.Control placeholder={usuario.equipo} readOnly />
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🎯 Categoría</InputGroup.Text>
        <Form.Control placeholder={usuario.categoria} readOnly />
      </InputGroup>

      {/* Campos editables */}
      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">📩 Cambiar Email</InputGroup.Text>
        <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} />
      </InputGroup>

      {/* Contraseña */}
      <PasswordInput
        label="🔑 Cambiar Pw"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">☎️ Teléfono</InputGroup.Text>
        <Form.Control value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </InputGroup>
      
      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">😇 Estado</InputGroup.Text>
        <Form.Control placeholder={usuario.estado} readOnly />
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🥾 Rol</InputGroup.Text>
        <Form.Control placeholder={usuario.rol.join(", ")} readOnly />
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">📜 Licencia</InputGroup.Text>
        <Form.Control value={licencia} onChange={(e) => setLicencia(e.target.value)} />
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🎸 Niv. Profesional</InputGroup.Text>
        <Form.Control value={nivelProfesional} onChange={(e) => setNivelProfesional(e.target.value)} />
      </InputGroup>

      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🧭 Promoción</InputGroup.Text>
        <Form.Control value={promocion} onChange={(e) => setPromocion(e.target.value)} />
      </InputGroup>

      {/* --- Credenciales obligatorias --- */}
      <Divider sx={{ color: "text.secondary" }}>Datos de acceso</Divider>
      <Divider sx={{ mb: 2, color: "text.secondary", fontSize: "0.8rem" }}>(Es necesario autenticarse para aplicar cambios)</Divider>
      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">📩 Email</InputGroup.Text>
        <Form.Control 
          type="email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)} 
          placeholder="Tu email actual"
        />
      </InputGroup>

      <PasswordInput
        label="🔐 Contraseña"
        value={authPassword}
        onChange={(e) => setAuthPassword(e.target.value)}
      />

      <div className="text-center mt-3">
        <Button onClick={handleActualizar}>
          Actualizar Datos
        </Button>
      </div>

      {/* --- Toast feedback --- */}      
      <ToastContainer className="p-3" position="bottom-center">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >          
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
