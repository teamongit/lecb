import { useEffect } from "react";
import TeamOnLogo from "../../../components/TeamOnLogo";
import { Button, Card, Form, InputGroup, Row, Col, Container } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { db, auth } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDoc, doc, setDoc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { PersonCircle } from "react-bootstrap-icons";

function FormLogin({ setViewLogin, setMensaje }) {

  const { user, userData, loading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && userData) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, userData, navigate]);

  const Entrar = async (e) => {
    e.preventDefault();
    setMensaje("Iniciando sesión...");
    const form = e.target;
    const email = form.elements["email"].value;
    const password = form.elements["password"].value;

    try {
      await login(email, password);
    } catch (error) {
      console.error("Error al iniciar sesion:", error);
      setMensaje("Usuario o contraseña incorrectos.");
    }
  }; 

  return (
    <Form onSubmit={Entrar}>
      <Form.Group className="mb-3" controlId="email">
        <InputGroup>
          <InputGroup.Text className="w-100px">Email</InputGroup.Text>
          <Form.Control type="email" name="email" required />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <InputGroup>
          <InputGroup.Text className="w-100px">Contraseña</InputGroup.Text>
          <Form.Control type="password" name="password" required />
        </InputGroup>
      </Form.Group>
      
      <Button id="btn-recordar" variant="link" className="text-secondary text-decoration-underline mb-5 p-0" type="button">
        Recordar contraseña al correo
      </Button>

      <Row className="mb-4">
        <Col>
          <Button variant="warning" className="w-100 shadow" type="button" onClick={() => setViewLogin(false)}>
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

function FormRegister({ setViewLogin, setMensaje }) {
  const [nombres, setNombres] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, "RESTANTES", "AAA_nombresPorRegistrar");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.nombresPorRegistrar)) {
            setNombres(data.nombresPorRegistrar);
          }
        }
      } catch (error) {
        console.error("Error al cargar nombresPorRegistrar:", error);        
      }
    })();
  }, []); 

  const Registrar = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email    = form.elements["email"].value.trim();
    const password = form.elements["password"].value;
    const apodo    = form.elements["apodo"].value.trim();
    const telefono = form.elements["telefono"].value.trim();
    const nombre   = form.elements["nombre"].value.trim();

    if (!email || !password || !nombre || !apodo) {
      setMensaje("Faltan datos requeridos");    
      return;
    }

    try {  
      setMensaje("Registrando usuario...");
      // 1. Registrar usuario en Firebase Authentication    
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: apodo });
      await sendEmailVerification(user);
      
      // 2. Recuperar el doc temporal de RESTANTES con id == nombre    
      const restantesDocRef = doc(db, "RESTANTES", nombre);
      const restantesDocSnap = await getDoc(restantesDocRef);
      // 3. Leer los datos del doc temporal
      if (restantesDocSnap.exists()) {
        const restantesData = restantesDocSnap.data();
        const usuarioData = {
          email,
          apodo,
          telefono,
          nombre,
          authId: user.uid,
          creadoEn: new Date(),
          ...restantesData,
        };

        // 4. Crear un doc en USUARIOS con los datos
        await setDoc(doc(db, "USUARIOS", nombre), usuarioData);
        // 5. Eliminar el doc temporal
        await deleteDoc(restantesDocRef);
        // 6. Eliminar el nombre del array "nombresPorRegistrar" en RESTANTES/AAA_nombresPorRegistrar
        const todosDocRef = doc(db, "RESTANTES", "AAA_nombresPorRegistrar");
        await updateDoc(todosDocRef, {
          nombresPorRegistrar: arrayRemove(nombre)
        });
        // 5. Login
        setMensaje("Usuario registrado con éxito.");
        setTimeout(() => {
          setMensaje("Redirigiendo a login...");
          setTimeout(() => {
            setViewLogin(true);
            setMensaje("");
          }, 2000);
        }, 2000);
      } 
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <Form onSubmit={Registrar}>
      <Form.Group className="mb-3" controlId="email">
        <InputGroup>
          <InputGroup.Text className="w-100px">Email</InputGroup.Text>
          <Form.Control type="email" name="email" required />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <InputGroup>
          <InputGroup.Text className="w-100px">Contraseña</InputGroup.Text>
          <Form.Control type="password" name="password" required />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="apodo">
        <InputGroup>
          <InputGroup.Text className="w-100px">Apodo</InputGroup.Text>
          <Form.Control type="text" name="apodo" maxLength={12} required />
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
          <option value="">Seleccionar...</option>
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

export default function LoginPage() {
  const [viewLogin, setViewLogin] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const { user, userData, loading } = useAuth(); 
  const navigate = useNavigate();       
  
  useEffect(() => {
    if (!loading && user) {
      if (!user.emailVerified) {
        setMensaje("Debes verificar tu correo antes de continuar.");
        auth.signOut();
      } else if (userData) {
        navigate("/dashboard");
      }
    }
  }, [loading, user, userData, navigate]);

  return (
    <>
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
          <Container id="mensaje-login" className="alert text-center" role="alert" >
            {mensaje}
          </Container>
        </Card.Body>
      </Card>
      <br />
      <br />
    </>
  );
}
