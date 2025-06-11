import { useEffect } from "react";
import TeamOnLogo from "../../../components/TeamOnLogo";
import { Button, Card, Form, InputGroup, Row, Col, Container, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { db, auth } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDoc, doc, setDoc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { PersonCircle, Eye, EyeSlash } from "react-bootstrap-icons";

function PasswordInput({ label, name, value, setValue }) {
  const [show, setShow] = useState(false);

  return (
    <Form.Group className="mb-3" controlId={name}>
      <InputGroup>
        <InputGroup.Text className="w-100px">{label}</InputGroup.Text>
        <Form.Control 
          type={show ? "text" : "password"} 
          name="password" 
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

const esperar = async () => {
          console.log("Esperando...");
          return new Promise((resolve) => {
            setTimeout(() => {
              console.log("Resuelto");
              resolve("Éxito");
            }, 1000);
          });
        };

function FormLogin({ setViewLogin, setMensaje }) {
  const [password, setPassword] = useState("");
  const { user, userData, loading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && userData) {
      navigate("/user/publicambios", { replace: true });
    }
  }, [loading, user, userData, navigate]);

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
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const docRef = doc(db, "USUARIOS_SIN_REGISTRAR", "0_lista");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().restantes;
          setNombres(data);
          
        }
      } catch (error) {
        console.error("Error al cargar nombresPorRegistrar:", error);        
      }
    })();
  }, []); 

  const Registrar = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email     = form.elements["email"].value.trim();
    const password1 = form.elements["password1"].value;
    const password2 = form.elements["password2"].value;
    const apodo     = form.elements["apodo"].value.trim();
    const telefono  = form.elements["telefono"].value.trim();
    const nombre    = form.elements["nombre"].value.trim();

    console.log(apodo)
    if (password1 !== password2) {
      setMensaje({
        texto: "Las contraseñas no coinciden",
        clase: "danger"
      }); 
     
      return;
    }

    try {  
      setMensaje({
        texto: "Registrando usuario...",
        clase: "info"
      }); 
      
      // 1. Registrar usuario en Firebase Authentication    
      const userCredential = await createUserWithEmailAndPassword(auth, email, password1);
      const user = userCredential.user;
      await updateProfile(user, { displayName: apodo });
      await sendEmailVerification(user);
      
      // 2. Recuperar el doc temporal de control con id == nombre    
      const usuario_sin_registrar_DocRef = doc(db, "USUARIOS_SIN_REGISTRAR", nombre);
      const usuario_sin_registrar_DocSnap = await getDoc(usuario_sin_registrar_DocRef);
      // 3. Leer los datos del doc temporal
      if (usuario_sin_registrar_DocSnap.exists()) {
        const usuario_sin_registrar_Data = usuario_sin_registrar_DocSnap.data();
        const usuarioData = {
          email,
          apodo,
          telefono,
          nombre,
          authId: user.uid,
          creadoEn: new Date(),
          ...usuario_sin_registrar_Data,
        };

        // 4. Crear un doc en USUARIOS con los datos
        await setDoc(doc(db, "USUARIOS", nombre), usuarioData);
        // 5. Eliminar el doc temporal
        await deleteDoc(usuario_sin_registrar_DocRef);
        // 6. Eliminar el nombre del array "0_lista"
        const listaDocRef = doc(db, "USUARIOS_SIN_REGISTRAR", "0_lista");
        await updateDoc(listaDocRef, {
          restantes: arrayRemove(nombre)
        });
        
        // const resultado = await esperar();
        // console.log("Resultado:", resultado);
        // 5. Login
        setMensaje({
          texto: "Usuario registrado con éxito",
          clase: "success"
        });
        setTimeout(() => {
          setMensaje({
            texto: "Redirigiendo a login...",
            clase: "success"
          }); 
          setTimeout(() => {
            setViewLogin(true);
            setMensaje({
              texto: "",
              clase: ""
            }); 
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
  const [mensaje, setMensaje] = useState({
    texto: "",
    clase: ""
  });
  
  const { user, userData, loading } = useAuth(); 
  const navigate = useNavigate();       
  
  useEffect(() => {
    if (!loading && user) {
      if (!user.emailVerified) {
        setMensaje({
          texto: "Verifica tu correo antes de continuar",
          clase: "info"
        }); 
        
        auth.signOut();
      } else if (userData) {
        navigate("/user/publicambios");
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
          <Alert variant={mensaje.clase}>
            {mensaje.texto}
          </Alert>
        </Card.Body>
      </Card>
      <br />
      <br />
    </>
  );
}
