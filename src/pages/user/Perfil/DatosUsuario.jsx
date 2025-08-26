import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { InputGroup, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { db } from '../../../firebase/firebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
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
  
  const [telefono, setTelefono] = useState(usuario.telefono);
  const [licencia, setLicencia] = useState(usuario.licencia);
  const [nivelProfesional, setNivelProfesional] = useState(usuario.nivelProfesional);
  const [promocion, setPromocion] = useState(usuario.promocion);
  // credenciales de reautenticación SIEMPRE requeridas

  const [pwActual, setPwActual] = useState('');
    
  const [pwNuevo, setPwNuevo] = useState('');
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

    try {
   
      // 3. Cambiar contraseña si se ingresó nueva
      if (pwActual === pwNuevo) {
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
      if (error.code === "auth/wrong-password") msg = "❌ Contraseña incorrecta";      
      console.log("Mostrando toast de error...");
      setToastMsg(msg);
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      {/* Campos editables */}
      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">🖖 Apodo</InputGroup.Text>
        <Form.Control value={apodo} onChange={(e) => setApodo(e.target.value)} />
      </InputGroup>

      {/* Campos no editables */}      
      <div className="input-group mb-2">
        <span className="input-group-text w-50">🏢 Dependencia</span>
        <span className="form-control d-flex align-items-center bg-white text-secondary">
          {usuario.dependencia}
        </span>
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text w-50">👾 Núcleo</span>
        <span className="form-control d-flex align-items-center bg-white text-secondary">
          {usuario.nucleo}
        </span>
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text w-50">🫂 Equipo</span>
        <span className="form-control d-flex align-items-center bg-white text-secondary">
          {usuario.equipo}
        </span>
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text w-50">🎯 Categoría</span>
        <span className="form-control d-flex align-items-center bg-white text-secondary">
          {usuario.categoria}
        </span>
      </div>

      {/* Campos editables */}
      <InputGroup className="mb-2">
        <InputGroup.Text className="w-50">☎️ Teléfono</InputGroup.Text>
        <Form.Control value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </InputGroup>
      
      {/* Campos no editables */}   
      <div className="input-group mb-2">
        <span className="input-group-text w-50">😇 Estado</span>
        <span className="form-control d-flex align-items-center bg-white text-secondary">
          {usuario.estado}
        </span>
      </div>

      <div className="input-group mb-2">
        <span className="input-group-text w-50">🥾 Rol</span>
        <span className="form-control d-flex align-items-center bg-white text-secondary">
          {usuario.rol.join(", ")}
        </span>
      </div>
      
      {/* Campos editables */}
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

      <div className="input-group mb-2">
        <span className="input-group-text w-50">📩 Email</span>
        <span className="form-control d-flex align-items-center bg-white text-secondary">
          {usuario.email}
        </span>
      </div>
      <PasswordInput
        label="🔐 Contraseña Actual"
        value={pwActual}
        onChange={(e) => setPwActual(e.target.value)}
      />
      {/* Contraseña */}
      <Divider sx={{ mb: 2, color: "text.secondary", fontSize: "0.8rem" }}>¿Quieres cambiar tu contraseña?</Divider>
      <PasswordInput
        label="🔑 Contraseña Nueva"
        value={pwNuevo}
        onChange={(e) => setPwNuevo(e.target.value)}
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
