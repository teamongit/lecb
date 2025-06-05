import { useState } from "react";
import { Container, ButtonGroup, Button, Form } from "react-bootstrap";
import { BookmarkPlusFill, BookmarkPlus, BookmarkDashFill, BookmarkDash, Bookmarks, ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { useAuth } from "../../../context/AuthProvider";
import { addDoc, arrayUnion, collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";

import { db } from "../../../firebaseConfig";

const ButtonGroupLabel = ({ label }) => (
  <div className="d-flex align-items-center text-muted m-0">
    <div className="flex-grow-1 border-top"></div>
    <small className="px-3 text-secondary text-07">{label}</small>
    <div className="flex-grow-1 border-top"></div>
  </div>
);

export default function PublicarForm() {
  const [fecha, setFecha] = useState("");
  const [modalidad, setModalidad] = useState(null);
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
        cuando: Timestamp.fromDate(new Date(fecha)),
        de: userData.nombre,
        solicita: {
          modalidad,
          jornada,
          funcion,
          tipo,
          comentarios,
        },
        creado: Timestamp.now(),
      };


      await addDoc(collection(db, "PUBLICACIONES"), publicacion);
      console.log("Exito")

      const inicioDelDia = new Date(fecha);
      inicioDelDia.setHours(0, 0, 0, 0);

      const finDelDia = new Date(fecha);
      finDelDia.setHours(23, 59, 59, 999);
      
      
        // Busco en HV
        const qHV = query(collection(db, "PUBLICACIONES"), where("cuando", ">=", Timestamp.fromDate(inicioDelDia)), where("cuando", "<=", Timestamp.fromDate(finDelDia)), where("solicita.modalidad", "==", "HV"), where("solicita.jornada", "==", jornada));
        const snapshotHV = await getDocs(qHV);
        // Si hay MATCH
        if (!snapshotHV.empty) {
          for (const docSnap of snapshotHV.docs) {
            const ref = doc(db, "PUBLICACIONES", docSnap.id);
            // Añado mi nombre a candidatos de HV
            setMensaje("Hay candidatos para tu petición de P6.");
            await updateDoc(ref, {
              candidatos: arrayUnion(docSnap.data().de),
            });
          }
        }
        // Busco en P6
        const qP6 = query(collection(db, "PUBLICACIONES"), where("cuando", ">=", Timestamp.fromDate(inicioDelDia)), where("cuando", "<=", Timestamp.fromDate(finDelDia)), where("solicita.modalidad", "==", "P6"), where("solicita.jornada", "==", jornada));
        const snapshotP6 = await getDocs(qP6);
        // Si hay MATCH
        if (!snapshotP6.empty) {          
          for (const docSnap of snapshotP6.docs) {
            const ref = doc(db, "PUBLICACIONES", docSnap.id);
            // Añado mi nombre a candidatos de P6            
            setMensaje("Hay candidatos para tu petición de HV.");
            await updateDoc(ref, {
              candidatos: arrayUnion(docSnap.data().de),
            });
          }
        }
      
      // setMensaje("Publicación guardada correctamente");

    } catch {
      setMensaje("Error al guardar la publicación.");
    }
  };

  return (
    <Container className="w-75 p-3">
      <div className="d-flex justify-content-between mb-3">
        <div className={`text-center ${modalidad === "HV" ? "text-primary" : "text-secondary"}`} role="button" onClick={() => setModalidad("HV")}>
          {modalidad === "HV" ? <BookmarkPlusFill size="68" /> : <BookmarkPlus size="68" />}
          <div>HV</div>
        </div>
        <div className={`text-center ${modalidad === "P6" ? "text-primary" : "text-secondary"}`} role="button" onClick={() => setModalidad("P6")}>
          {modalidad === "P6" ? <BookmarkDashFill size="68" /> : <BookmarkDash size="68" />}
          <div>P6</div>
        </div>
        <div className="text-center text-secondary text-decoration-line-through">
          <Bookmarks size="68" />
          <div>Cambio</div>
        </div>
      </div>

      <Form.Control className="mb-3 btn-group" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <ButtonGroupLabel label={"Jornada"} />
      <ButtonGroup className="w-100 mb-3">
        {["M", "T", "N"].map((t) => (
          <Button key={t} className="w-33" variant={jornada === t ? "outline-primary" : "outline-secondary"} active={jornada === t} onClick={() => setJornada(t)}>
            {t}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroupLabel label={"Función"} />
      <ButtonGroup className="w-100 mb-3 btn-group">
        {["SUP", "INS", "IMG"].map((t) => (
          <Button key={t} className="w-33" variant={funcion === t ? "outline-primary" : "outline-secondary"} active={funcion === t} onClick={() => setFuncion(funcion === t ? null : t)}>
            {t}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroupLabel label={"Tipo"} />
      <ButtonGroup className="w-100 mb-3 btn-group">
        {["Corta", "Larga", "Otro"].map((t) => (
          <Button key={t} className="w-33" variant={tipo === t ? "outline-primary" : "outline-secondary"} active={tipo === t} onClick={() => setTipo(tipo === t ? null : t)}>
            {t}
          </Button>
        ))}
      </ButtonGroup>
      <Form.Group controlId="comentariosDesplegables">
        <div onClick={() => setMostrar(!mostrar)} style={{ cursor: "pointer" }} className="d-flex align-items-center mb-2">
          <span className="me-2">Comentarios</span>
          {mostrar ? <ChevronUp /> : <ChevronDown />}
        </div>

        {mostrar && <Form.Control as="textarea" rows={3} placeholder="...opcional" onChange={(e) => setComentarios(e.target.value)} />}
      </Form.Group>

      <Button className="mt-3 w-100" disabled={!(modalidad && fecha && jornada)} onClick={handleEnviar}>
        Enviar
      </Button>
      <br />
      {mensaje}
    </Container>
  );
}
