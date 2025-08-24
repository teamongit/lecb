// Publicar.jsx
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Row, Col, Button, Form, FormGroup, FormControlLabel } from "react-bootstrap";
import { Checkbox, Divider, TextField } from "@mui/material";
import { useAuth } from "@/context/AuthProvider";
import { useTurnos } from "@/hooks/useTurnos";
import { usePublicaciones } from "@/hooks/usePublicaciones";
import { formatearFecha } from "@/utils/fechas";
import { filtrarOpcionesTurnos } from "@/utils/turnos";
import { MuiFechaTurno, MuiSelectMultiple2 } from "@/components/MUI";
import { BookmarkDash, BookmarkDashFill, BookmarkPlus, BookmarkPlusFill, Bookmarks, BookmarksFill } from "react-bootstrap-icons";

// --------------------- Subcomponentes ---------------------
const Tipo = ({ tipo, setTipo }) => {
  const opciones = [
    { key: "quitar", label: "Quitar", icon: BookmarkDash, iconFill: BookmarkDashFill, color: "danger" },
    { key: "hacer", label: "Hacer", icon: BookmarkPlus, iconFill: BookmarkPlusFill, color: "primary" },
    { key: "cambiar", label: "Cambiar", icon: Bookmarks, iconFill: BookmarksFill, color: "dark" },
  ];

  return (
    <>
      <Divider className="mb-3">¿Qué tipo de cambio deseas publicar?</Divider>
      <Row className="text-center">
        {opciones.map(({ key, label, icon: Icon, iconFill: IconFill, color }) => {
          const activo = tipo === key;
          const colorClass = activo ? `text-${color}` : "text-secondary";
          const Icono = activo ? IconFill : Icon;

          return (
            <Col key={key} role="button" onClick={() => setTipo(key)}>
              <Icono className={`fs-1 ${colorClass}`} />
              <span className={`d-block ${colorClass}`}>{label}</span>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

const Comentarios = ({ value, setValue }) => (
  <TextField
    className="mb-3"
    id="comentarios"
    label="Comentarios"
    multiline
    maxRows={4}
    fullWidth
    value={value}
    onChange={(e) => setValue(e.target.value)}
    margin="normal"
  />
);

const Resumen = ({ texto }) => (
  <Divider sx={{ color: "Chocolate", fontStyle: "italic", fontSize:"0.8rem", m: 3, minHeight: "1.5em" }}>
    {texto}
  </Divider>
);

const SelectorFecha = ({ tipo, fecha, setFecha, turnos, turneros, setQuitarTurno, setOpcionesTurnos, setHacerTurnos }) => {
  useEffect(() => {
    if (!fecha) return;
    const f = formatearFecha(fecha, "aaaa-mm-dd");
    const t = turnos[f] || "";
    setOpcionesTurnos(filtrarOpcionesTurnos(turneros[f] || {}));
    setQuitarTurno(t ? t : "");
    setHacerTurnos([]);
  }, [fecha, turnos, turneros, setQuitarTurno, setOpcionesTurnos, setHacerTurnos]);

  return (
    <MuiFechaTurno
      className="mb-3 w-100"
      label={tipo}
      value={fecha}
      turnos={turnos}
      onChange={setFecha}
      required
    />
  );
};

const SelectorTurnosMultiple = ({ opciones, value, onChange }) => (
  <MuiSelectMultiple2
    className="w-100"
    label="¿Qué turnos podrías hacer?"
    options={opciones}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const ModalidadCheckbox = ({ value, setValue }) => (
  <FormGroup>
    <FormControlLabel
      control={
        <Checkbox
          onChange={(e) => setValue(e.target.checked ? "Voluntario/P6" : "")}
          checked={value === "Voluntario/P6"}
        />
      }
      label="Voluntario/P6"
    />
  </FormGroup>
);

// --------------------- Hook personalizado ---------------------
const usePublicarForm = ({ tipo, quitarTurno, hacerTurnos, setQuitarTurno, setHacerTurnos }) => {
  const [opcionesTurnos, setOpcionesTurnos] = useState([]);
  const [resumen, setResumen] = useState("");

  useEffect(() => {
    if (!tipo) return;
    setQuitarTurno("");
    setHacerTurnos([]);
  }, [tipo, setQuitarTurno, setHacerTurnos]);

  useEffect(() => {    
    if (tipo === "quitar") setResumen("Quitar " + quitarTurno);
    else if (tipo === "hacer") setResumen("Hacer " + hacerTurnos.join(", "));
    else if (tipo === "cambiar") setResumen("Cambiar " + quitarTurno + " x " + hacerTurnos.join(", "));
  }, [tipo, quitarTurno, hacerTurnos]);

  return { opcionesTurnos, resumen, setOpcionesTurnos };
};

// --------------------- Función para construir nueva publicación ---------------------
const construirPublicacion = ({ usuario, tipo, fecha, quitarTurno, hacerTurnos, comentarios, modalidad }) => ({
  nombre: usuario.nombre,
  apodo: usuario.apodo,
  nucleo: usuario.nucleo,
  equipo: usuario.equipo,
  dependencia: usuario.dependencia,
  creado: Timestamp.fromDate(new Date()),
  tipo,
  fecha: Timestamp.fromDate(new Date(fecha)),
  quitarTurno,
  hacerTurnos,
  comentarios,
  candidatos: [],
  modalidad,
  estado: "publicado",
});

// --------------------- Componente principal ---------------------
export function Publicar() {
  const { usuario } = useAuth();
  const { turnos, turneros } = useTurnos();
  const { agregarPublicacion } = usePublicaciones();  

  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState(null);
  const [quitarTurno, setQuitarTurno] = useState("");
  const [hacerTurnos, setHacerTurnos] = useState([]);
  const [comentarios, setComentarios] = useState("");
  const [modalidad, setModalidad] = useState("");

  const { opcionesTurnos, resumen, setOpcionesTurnos } = usePublicarForm({ tipo, fecha, quitarTurno, hacerTurnos, turnos, turneros, setQuitarTurno, setHacerTurnos });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaPub = construirPublicacion({ usuario, tipo, fecha, quitarTurno, hacerTurnos, comentarios, modalidad });
    try {
      await agregarPublicacion(nuevaPub);
      alert("¡Publicado con éxito!");
    } catch (err) {
      console.error("Error al publicar:", err);
      alert("Hubo un problema al publicar.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-2">
      <div className="text-center">
        Nota: Para actualizar tus turnos hazlo desde TuTurnero
      </div>
      <br /><br />
      <Tipo tipo={tipo} setTipo={setTipo} /> 
      {tipo && <Resumen texto={resumen} />}
      {tipo && 
        <SelectorFecha 
          tipo={tipo} 
          fecha={fecha} 
          setFecha={setFecha} 
          turnos={turnos} 
          turneros={turneros} 
          setQuitarTurno={setQuitarTurno} 
          setOpcionesTurnos={setOpcionesTurnos} 
          setHacerTurnos={setHacerTurnos} 
        />
      }
      {(tipo === "hacer" || tipo === "cambiar") && fecha &&
        <SelectorTurnosMultiple opciones={opcionesTurnos} value={hacerTurnos} onChange={setHacerTurnos} />
      }
      {fecha && 
        <>
          <Comentarios value={comentarios} setValue={setComentarios} />
          {tipo !== "cambiar" && <ModalidadCheckbox value={modalidad} setValue={setModalidad} />}
          <Button className="mt-4 mx-auto w-50 d-block" variant="primary" size="lg" type="submit">
            Publicar
          </Button>
        </>
      }      
    </Form>
  );
}
