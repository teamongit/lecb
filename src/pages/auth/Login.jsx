import { useState, useEffect } from "react";
import { TeamOnLogo } from "../../components/Logo";
import { Button, Card, Form, InputGroup, Row, Col, Container, Alert } from "react-bootstrap";
import { PersonCircle, Eye, EyeSlash } from "react-bootstrap-icons";

import { useAuth } from "../../hooks/useAuth";
import { db, auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc, serverTimestamp, deleteField } from "firebase/firestore";
import { useToast } from "../../context/ToastContext";

function PasswordInput({ label, name, value, setValue }) {
  const [show, setShow] = useState(false);
  
  return (
    <Form.Group className="mb-3" controlId={name}>
      <InputGroup>
        <InputGroup.Text className="w-100px">{label}</InputGroup.Text>
        <Form.Control 
          type={show ? "text" : "password"} 
          name={name}
          placeholder={label}
          required 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ paddingRight: "2.5rem" }}
        />
        {value && (
          <span
            onClick={() => setShow(!show)}
            className="position-absolute top-50 end-0 translate-middle-y me-2 cursor-pointer text-secondary"
            style={{ cursor: "pointer", zIndex: 2 }}
          >
            {show ? <EyeSlash /> : <Eye />}
          </span>
        )}
      </InputGroup>      
    </Form.Group>
  );
}

function FormRegister({ setViewLogin }) {
  const { triggerToast } = useToast();
  const [nombres, setNombres] = useState([]);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [telefonoFocused, setTelefonoFocused] = useState(false);

  useEffect(() => {
    const cargarNombres = async () => {


      try {
        // Doc lista de nombres sin registrar en dependencia
        const docRef = doc(db, "USUARIOS", "#LECB");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const keys = Object.keys(docSnap.data()).sort();
          setNombres(keys);
        }
      } catch (error) {
        triggerToast("Error al cargar nombres", {severity: "error", autoHideDuration: 2500});
        console.error("Error al cargar nombresPorRegistrar:", error);
      }
    };

    cargarNombres();
  }, []);


  const Registrar = async (e) => {
    e.preventDefault();
     
    const form = e.target;
    const get = (name) => form.elements[name].value.trim();

    const valores = {
      email: get("email"),
      apodo: get("apodo"),
      telefono: get("telefono"),
      nombre: get("nombre"),
    };

    if (password1 !== password2) {
      triggerToast("Las contraseñas no coinciden", {severity: "error", autoHideDuration: 2500});
      return;
    }

    if (!nombres.includes(valores.nombre)) {
      triggerToast("El nombre seleccionado no es válido", {severity: "error", autoHideDuration: 2500});    
      return;
    }

    try {  
      triggerToast("Registrando usuario...", {severity: "info", autoHideDuration: 1500});

      // TODO: 
      // Validar que el nombre no esté ya registrado
      // Validar que el email no esté ya registrado
      // Validar si el nombre ya fue registrado en USUARIOS
      const usuarioDocRef = doc(db, "USUARIOS", valores.nombre);
      const usuarioDocSnap = await getDoc(usuarioDocRef);
      if (usuarioDocSnap.exists()) {
        triggerToast("El nombre seleccionado ya está registrado", {severity: "error", autoHideDuration: 2500});
        return;
      }

      // 1. Registrar usuario en Firebase Authentication    
      const credencial = await createUserWithEmailAndPassword(auth, valores.email, password1);
      const registrado = credencial.user;

      try {
        await sendEmailVerification(registrado);
      } catch (error) {
        let textoError = "Error al registrar usuario";
        
        if (error.code === "auth/email-already-in-use") {
          textoError = "El email ya está en uso";
        } else if (error.code === "auth/invalid-email") {
          textoError = "El email no es válido";
        } else if (error.code === "auth/weak-password") {
          textoError = "La contraseña es demasiado débil (mínimo 6 caracteres)";
        }
        triggerToast(textoError, {severity: "error", autoHideDuration: 2500});        
        console.error(error);
      }
      
      // 2. Doc lista usuarios sin registrar
      const listaDocRef = doc(db, "USUARIOS", "#LECB");
      const listaDocSnap = await getDoc(listaDocRef);
      if (!listaDocSnap.exists()) {
        triggerToast("Error: lista de usuarios no encontrada", {severity: "error", autoHideDuration: 2500});
        return;
      }
      // 3. Datos extra guardados en lista temporal para ese nombre
      const datosTemporales = listaDocSnap.data()[valores.nombre];
        if (!datosTemporales) {
          triggerToast("Error: datos no encontrados para el nombre seleccionado", {severity: "error", autoHideDuration: 2500});        
        return;
      }

      // 4. Armar objeto usuario definitivo
      const usuario = {
        creado: serverTimestamp(),
        ...valores,
        ...datosTemporales,
      };
      // 5. Guardar en Firestore en documento con uid
      await setDoc(doc(db, "USUARIOS", registrado.uid), usuario);
      // 6. Eliminar el nombre de la lista temporal
      await updateDoc(listaDocRef, {
        [valores.nombre]: deleteField(),
      });
          
      // 6. Login
      triggerToast("Registrado. Verificar cuenta (email).", {severity: "info"});
      setViewLogin(true);
          
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      let textoError = "Error al registrar usuario";
      if (error.code === "auth/email-already-in-use") {
        textoError = "El email ya está en uso";
      } else if (error.code === "auth/invalid-email") {
        textoError = "El email no es válido";
      } else if (error.code === "auth/weak-password") {
        textoError = "La contraseña es demasiado débil (mínimo 6 carácteres)";
      }
      triggerToast(textoError, {severity: "error", autoHideDuration: 2500});
      
    }
  };

  return (
    <Form onSubmit={Registrar}>
      <Form.Group className="mb-3" controlId="email">
        <InputGroup>
          <InputGroup.Text className="w-100px">Email</InputGroup.Text>
          <Form.Control type="email" name="email" placeholder="Email" required />
        </InputGroup>
      </Form.Group>
      
      {/* <small className="text-muted d-block m-0 p-0">Debe tener al menos 6 caracteres</small> */}
      <PasswordInput label="Contraseña" name="password1" value={password1} setValue={setPassword1} />
      <PasswordInput label="Repetir" name="password2" value={password2} setValue={setPassword2} />

      <Form.Group className="mb-3" controlId="apodo">
        <InputGroup>
          <InputGroup.Text className="w-100px">Apodo</InputGroup.Text>
          <Form.Control type="text" name="apodo" placeholder="Apodo" maxLength={10} required />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="telefono">
        <InputGroup>
          <InputGroup.Text className="w-100px">Telefono</InputGroup.Text>
          <Form.Control 
            type="text" 
            name="telefono" 
            placeholder="Telefono" 
            onFocus={() => setTelefonoFocused(true)}
            onBlur={() => setTelefonoFocused(false)}
          />          
        </InputGroup>
        {telefonoFocused && (
          <Form.Text className="text-muted">
            Añade el código de país (+34...)
          </Form.Text>
        )}
        
      </Form.Group>

      <InputGroup>
        <InputGroup.Text className="w-100px">Nombre</InputGroup.Text>
        <Form.Select name="nombre" required>
          <option value="" disabled>Seleccionar...</option>
          {nombres.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </Form.Select>
      </InputGroup>
      <br />      
      <br />

      <Row className="mb-4">
        <Col>
          <Button variant="outline-warning" className="w-100 shadow" type="button" onClick={() => setViewLogin(true)}>
            Volver
          </Button>
        </Col>
        <Col>
          <Button variant="outline-primary" className="w-100 shadow" type="submit">
            Registrar
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

function FormLogin({ setViewLogin }) {
  const { login, recordarContrasena } = useAuth();
  const { triggerToast } = useToast();
  const [password, setPassword] = useState("");
  

  const handleRecordarContrasena = async (e) => {    
    e.preventDefault();
    const email = document.querySelector("input[name='email']").value.trim();    
    if (!email) {      
      triggerToast("Ingresa tu email primero", {severity: "warning"});
      return;
    }
    const result = await recordarContrasena(email);
    triggerToast(result.msg, result.severity);
  };


  const Entrar = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.elements["email"].value;
    const password = form.elements["password"].value;

    triggerToast("Iniciando sesión...", { severity: "info", autoHideDuration: 1000 });

    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      triggerToast("Usuario o contraseña incorrectos", { severity: "error" });
    }
  };

  return (
    <Form onSubmit={Entrar}>
      <Form.Group className="mb-3" controlId="email">
        <InputGroup>
          <InputGroup.Text className="w-100px">Email</InputGroup.Text>
          <Form.Control type="email" name="email" placeholder="Email" required />
        </InputGroup>
      </Form.Group>
      <PasswordInput label="Contraseña" placeholder="Contraseña" name="password" value={password} setValue={setPassword} />
      
      <Button 
        id="btn-recordar" 
        variant="link" 
        className="text-secondary text-decoration-underline mb-5 p-0"
        onClick={handleRecordarContrasena}
      >
        Recordar contraseña al correo
      </Button>

      <Row className="mb-4">
        <Col>
          <Button variant="warning" className="w-100 shadow" onClick={() => setViewLogin(false)}>
            Registrar
          </Button>
        </Col>
        <Col>
          <Button variant="primary" className="w-100 shadow text-white" type="submit">
            Entrar
          </Button>
        </Col>
      </Row>
    </Form>
  );  
}

export default function Login() {
  const [viewLogin, setViewLogin] = useState(true);
  
  return (
    <Card className="m-3 shadow rounded-3">
      <Card.Header className="text-white p-3 fs-1 mi-color-fondo shadow">
        <TeamOnLogo />
        <span className="ms-3">teamOn!</span>
      </Card.Header>
      <Card.Body className="p-4">
        <Container className="text-center mb-3">
          <PersonCircle className="mi-color icono-sombra" size={92} />
        </Container>
        <br />
        {viewLogin 
          ? <FormLogin setViewLogin={setViewLogin} /> 
          : <FormRegister setViewLogin={setViewLogin} />
        }
        <br />       
      </Card.Body>
    </Card>
  );
}
