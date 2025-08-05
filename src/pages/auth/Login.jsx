import { useState, useEffect } from "react";
import { TeamOnLogo } from "../../components/Logo";
import { Button, Card, Form, InputGroup, Row, Col, Container, Alert } from "react-bootstrap";
import { PersonCircle, Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db, auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc, serverTimestamp, deleteField } from "firebase/firestore";
import { ROUTES } from "../../utils/constants";

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

function FormRegister({ setViewLogin, setMensaje }) {
  const [nombres, setNombres] = useState([]);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

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
      setMensaje({
        texto: "Las contraseñas no coinciden",
        clase: "danger"
      });
      return;
    }

    if (!nombres.includes(valores.nombre)) {
      setMensaje({
        texto: "El nombre seleccionado no es válido",
        clase: "danger",
      });
      return;
    }

    try {  
      setMensaje({
        texto: "Registrando usuario...",
        clase: "info"
      }); 
      // TODO: 
      // Validar que el nombre no esté ya registrado
      // Validar que el email no esté ya registrado
      // Validar si el nombre ya fue registrado en USUARIOS
      const usuarioDocRef = doc(db, "USUARIOS", valores.nombre);
      const usuarioDocSnap = await getDoc(usuarioDocRef);
      if (usuarioDocSnap.exists()) {
        setMensaje({
          texto: "El nombre seleccionado ya está registrado",
          clase: "danger",
        });
        return;
      }

      // 1. Registrar usuario en Firebase Authentication    
      const credencial = await createUserWithEmailAndPassword(auth, valores.email, password1);
      const registrado = credencial.user;

      try {
        await sendEmailVerification(registrado);
      } catch (error) {
        console.error("Error al enviar email de verificación:", error);
        setMensaje({
          texto: "No se pudo enviar el email de verificación",
          clase: "danger"
        });
      }
      
      // 2. Doc lista usuarios sin registrar
      const listaDocRef = doc(db, "USUARIOS", "#LECB");
      const listaDocSnap = await getDoc(listaDocRef);
      if (!listaDocSnap.exists()) {
        setMensaje({
          texto: "Error: lista temporal de usuarios no encontrada",
          clase: "danger",
        });
        return;
      }
      // 3. Datos extra guardados en lista temporal para ese nombre
      const datosTemporales = listaDocSnap.data()[valores.nombre];
        if (!datosTemporales) {
        setMensaje({
          texto: "Error: datos temporales no encontrados para el nombre seleccionado",
          clase: "danger",
        });
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
      setMensaje({
        texto: "Usuario registrado con éxito. Revisa tu correo para verificar tu cuenta.",
        clase: "success",
      });
      setViewLogin(true);
          
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      let textoError = "Error al registrar usuario";
      if (error.code === "auth/email-already-in-use") {
        textoError = "El email ya está en uso";
      } else if (error.code === "auth/invalid-email") {
        textoError = "El email no es válido";
      } else if (error.code === "auth/weak-password") {
        textoError = "La contraseña es demasiado débil";
      }
      setMensaje({
        texto: textoError,
        clase: "danger",
      });
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
      
      <PasswordInput label="Contraseña" placeholder="Contraseña" name="password1" value={password1} setValue={setPassword1} />
      <PasswordInput label="Repetir" placeholder="Repetir" name="password2" value={password2} setValue={setPassword2} />

      <Form.Group className="mb-3" controlId="apodo">
        <InputGroup>
          <InputGroup.Text className="w-100px">Apodo</InputGroup.Text>
          <Form.Control type="text" name="apodo" placeholder="Apodo" maxLength={10} required />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="telefono">
        <InputGroup>
          <InputGroup.Text className="w-100px">Telefono</InputGroup.Text>
          <Form.Control type="number" name="telefono" placeholder="Opcional" />
        </InputGroup>
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
function FormLogin({ setViewLogin, setMensaje }) {
  const { login } = useAuth();
  const [password, setPassword] = useState("");


  const Entrar = async (e) => {
    e.preventDefault();
    setMensaje({
      texto: "Iniciando sesión...",
      clase: "info"
    });
    const form = e.target;
    const email = form.elements["email"].value;
    const password = form.elements["password"].value;

    try {
      await login(email, password);
    } catch (error) {
      console.error("Error al iniciar sesion:", error);
      setMensaje({
        texto: "Usuario o contraseña incorrectos",
        clase: "danger"
      });    
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
      
      <Button id="btn-recordar" variant="link" className="text-secondary text-decoration-underline mb-5 p-0">
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
  const [mensaje, setMensaje] = useState({
    texto: "",
    clase: ""
  });
  
  // const { autenticado, esAutenticado, usuario, loading, login, logout } = useAuth(); 
  // const navigate = useNavigate();       
  
  // useEffect(() => {
  //   // Cargando...
  //   if (loading) return;
  //   // No hay usuario
  //   if (!user) return;
  //   // No ha verficado email
  //   if (!user.emailVerified) {
  //     setMensaje({
  //       texto: "Verifica tu correo",
  //       clase: "info"
  //     });
  //     logout();
  //     return;
  //   }
  //   // Esperar a cargar los datos de usuario y redirigir
  //   // if (userData) navigate("/user/publicambios");
    
  // }, [loading, user, userData, navigate]);

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
          ? <FormLogin setViewLogin={setViewLogin} setMensaje={setMensaje}/> 
          : <FormRegister setViewLogin={setViewLogin} setMensaje={setMensaje}/>
        }
        <br />
        <Alert variant={mensaje.clase}>
          {mensaje.texto}
        </Alert>
      </Card.Body>
    </Card>
  );
}
