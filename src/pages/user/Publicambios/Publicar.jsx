import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { db } from "../../../firebaseConfig";

import { 
  Container, 
  ButtonGroup, 
  Button, 
  Form 
} from "react-bootstrap";

import { 
  BookmarkPlusFill, 
  BookmarkPlus, 
  BookmarkDashFill, 
  BookmarkDash, 
  Bookmarks, 
  ChevronDown, 
  ChevronUp 
} from "react-bootstrap-icons";

import { 
  addDoc, 
  arrayUnion, 
  collection, 
  doc, 
  getDocs, 
  query, 
  Timestamp, 
  updateDoc, 
  where 
} from "firebase/firestore";
import Titulo from "../../../components/Titulo";


export default function Publicar() {

  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    return hoy.toISOString().split("T")[0]; 
  });
  const [lista, setLista] = useState(null);
  const [jornada, setJornada] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [funcion, setFuncion] = useState(null);
  const [mostrar, setMostrar] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [mensaje, setMensaje] = useState("");

  const { userData } = useAuth();

  const handleEnviar = async () => {
    try {
      const publicacion = {
        creado: Timestamp.now(),
        fecha: Timestamp.fromDate(new Date(fecha)),
        apodo: userData.apodo,
        nombre: userData.nombre,
        equipo: userData.equipo,
        nucleo: userData.nucleo,
        lado: userData.lado,
        estado: "publicado",        
        lista,
        jornada,
        tipo,
        funcion,
        comentarios,        
        candidatos: [],
      };
      const construirServicio = () => {
        let servicio = jornada;

        if (funcion == "IMG") {
          servicio = "i" + servicio;
        }
        // Noche
        if (jornada == "N") {
          // Imaginaria: añadir i
          // RUTA: añadir letra al final
          if (funcion == "SUP") {
            servicio += "Sup";            
          }
          if (funcion == "INS") {
            servicio += "A2";            
          }
          if (userData.nucleo.includes("RUTA")) {
            servicio += userData.nucleo.slice(-1); 
          }
          // Salir
          return servicio;       
        }

        if (funcion == "SUP") {
          servicio += "Sup";
          if (userData.nucleo.includes("RUTA")) {
            servicio += userData.nucleo.slice(-1); 
          }
          return servicio;
        }        
        if (tipo == "Corta") {
          servicio += "c";
        }
        if (tipo == "Larga") {
          servicio += "L";
        }
        if (funcion == "INS") {
          servicio += "A2";            
        }
        return servicio;
      };
      // construir servicio aquí
      let servicio = construirServicio();
      
      publicacion.servicio = servicio;

      // Etiqueta que identifica al usuario que publica
      const tagUsuario = userData.apodo + " " + userData.nucleo + " " + userData.lado + " " + userData.equipo;

      const inicioDelDia = new Date(fecha);
      inicioDelDia.setHours(0, 0, 0, 0);

      const finDelDia = new Date(fecha);
      finDelDia.setHours(23, 59, 59, 999);
      
      const listaContraria = lista == "P6" ? "HV" : "P6";
      const q = query(
        collection(db, "PUBLICACIONES"),
        where("fecha", ">=", Timestamp.fromDate(inicioDelDia)),
        where("fecha", "<=", Timestamp.fromDate(finDelDia)),
        where("lista", "==", listaContraria),
        where("nucleo", "==", userData.nucleo),
        where("jornada", "==", jornada)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setMensaje("Hay candidatos para tu petición de " + lista);
        for (const docSnap of snapshot.docs) {
          const ref = doc(db, "PUBLICACIONES", docSnap.id);

          // Añadir a candidatos del otro documento
          await updateDoc(ref, {
            candidatos: arrayUnion(tagUsuario),
          });

          // Añadir al array local de candidatos si no está ya
          const tagCandidato = docSnap.data().apodo + " " + docSnap.data().nucleo + " " + docSnap.data().lado + " " + docSnap.data().equipo;
          
          if (!publicacion.candidatos.includes(tagCandidato)) {
            publicacion.candidatos.push(tagCandidato);
          }
        }
      } else {
        setMensaje("Publicado con éxito (sin candidatos compatibles)");
      }
      await addDoc(collection(db, "PUBLICACIONES"), publicacion);
    } catch (err) {
      setMensaje("Error al guardar la publicación.");
      console.log(err)
    }
  };

  return (
    <Container className="w-75 p-3">
      <div className="d-flex justify-content-between mb-3">
        <div className={`text-center ${lista === "HV" ? "text-primary" : "text-secondary"}`} role="button" onClick={() => setLista("HV")}>
          {lista === "HV" 
            ? <BookmarkPlusFill size="68" /> 
            : <BookmarkPlus size="68" />
          }
          <div>HV</div>
        </div>
        <div className={`text-center ${lista === "P6" ? "text-primary" : "text-secondary"}`} role="button" onClick={() => setLista("P6")}>
          {lista === "P6" 
            ? <BookmarkDashFill size="68" /> 
            : <BookmarkDash size="68" />
          }
          <div>P6</div>
        </div>
        <div className="text-center text-secondary text-decoration-line-through">
          <Bookmarks size="68" />
          <div>Cambio</div>
        </div>
      </div>
      
      <Titulo tag="small" texto="Fecha" color="text-secondary" tamano="text-07" margen="m-0"/>
      <Form.Control className="mb-3 btn-group" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      
      <Titulo tag="small" texto="Jornada" color="text-secondary" tamano="text-07" margen="m-0"/>
      <ButtonGroup className="w-100 mb-3">
        {["M", "T", "N"].map((t) => (
          <Button key={t} className="w-33" variant={jornada === t ? "outline-primary" : "outline-secondary"} active={jornada === t} onClick={() => setJornada(t)}>
            {t}
          </Button>
        ))}
      </ButtonGroup>

      <Titulo tag="small" texto="Tipo" color="text-secondary" tamano="text-07" margen="m-0"/>
      <ButtonGroup className="w-100 mb-3 btn-group">
        {["Corta", "Larga", "Otro"].map((t) => (
          <Button key={t} className="w-33" variant={tipo === t ? "outline-primary" : "outline-secondary"} active={tipo === t} onClick={() => setTipo(tipo === t ? null : t)}>
            {t}
          </Button>
        ))}
      </ButtonGroup>

      <Titulo tag="small" texto="Funcion" color="text-secondary" tamano="text-07" margen="m-0"/>
      <ButtonGroup className="w-100 mb-3 btn-group">
        {["SUP", "INS", "IMG"].map((t) => (
          <Button key={t} className="w-33" variant={funcion === t ? "outline-primary" : "outline-secondary"} active={funcion === t} onClick={() => setFuncion(funcion === t ? null : t)}>
            {t}
          </Button>
        ))}
      </ButtonGroup>

      <Titulo tag="small" texto="Comentarios" color="text-secondary" tamano="text-07" margen="m-0"/>
      <Form.Group controlId="comentariosDesplegables">
        <div onClick={() => setMostrar(!mostrar)} style={{ cursor: "pointer" }} className="text-center mb-2">
          {mostrar 
            ? <ChevronUp /> 
            : <ChevronDown />
          }
        </div>

        {mostrar && <Form.Control as="textarea" rows={3} placeholder="...opcional" onChange={(e) => setComentarios(e.target.value)} />}
      </Form.Group>

      <Button className="my-3 w-100" disabled={!(lista && fecha && jornada)} onClick={handleEnviar}>
        Enviar
      </Button>
      <br />
      {mensaje}
    </Container>
  );
}
