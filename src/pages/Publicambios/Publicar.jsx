// Publicar.jsx
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Row, Col, Button, Form, FormGroup } from "react-bootstrap";
import { Checkbox, Divider, TextField, FormControlLabel, FormControl, InputLabel, Select, OutlinedInput, MenuItem, ListItemText } from "@mui/material";
import { useAuth } from "@/context/AuthProvider";
import { useTurnos } from "@/hooks/useTurnos";
import { formatearFecha } from "@/utils/fechas";
import { filtrarOpcionesTurnos } from "@/utils/turnos";
import { BookmarkDash, BookmarkDashFill, BookmarkHeart, BookmarkHeartFill, BookmarkPlus, BookmarkPlusFill, Bookmarks, BookmarksFill, InfoCircle } from "react-bootstrap-icons";
import { DatePicker, LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from 'date-fns/locale';
import { usePublicaciones } from "@/hooks/usePublicaciones";
import { useToast } from "@/context/ToastContext";

const coloresTipo = {
  Quitar: "FireBrick",
  Hacer: "RoyalBlue",
  Cambiar: "Black"
};

// --------------------- Subcomponentes ---------------------
const Tipo = ({ tipo, setTipo }) => {
  const botones = [
    { label: "Quitar",  Icon: BookmarkDash, IconFill: BookmarkDashFill, color: "danger" },
    { label: "Hacer",   Icon: BookmarkPlus, IconFill: BookmarkPlusFill, color: "primary" },
    { label: "Cambiar", Icon: Bookmarks,    IconFill: BookmarksFill,    color: "dark" },
  ];

  return (
    <>
      <Divider className="mb-3">¿Qué tipo de cambio deseas publicar?</Divider>
      <Row className="text-center">
        {botones.map(({ label, Icon, IconFill, color }) => {
          const activo = tipo === label;
          const variante = activo ? `text-${color}` : "text-secondary";
          const Icono = activo ? IconFill : Icon;

          return (
            <Col key={label} role="button" onClick={() => setTipo(label)}>
              <Icono className={`fs-1 ${variante}`} />
              <span className={`d-block ${variante}`}>{label}</span>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

const SelectorFecha = ({ 
  tipo, 
  fecha, 
  setFecha, 
  turnos, 
  turnero, 
  setQuitarTurno, 
  setOpcionesTurnos, 
  setHacerTurnos 
}) => {

  useEffect(() => {
    if (!fecha) return;
    const f = formatearFecha(fecha, "aaaa-mm-dd");
    const t = turnos[f] || "";
    setOpcionesTurnos(filtrarOpcionesTurnos(turnero[f] || {}));
    setQuitarTurno(t ? t : "");
    setHacerTurnos([]);
  }, [fecha, turnos, turnero]);

  const esDisabled = (date) => {
    const f = formatearFecha(date, "aaaa-mm-dd");
    const today = new Date();
    today.setHours(0,0,0,0);

    const hasTurno = turnos[f] !== "L";

    // Deshabilitar fechas pasadas
    if (date < today) return true;

    if (tipo === "Quitar" || tipo === "Cambiar") return !hasTurno; 
    if (tipo === "Hacer") return hasTurno; 
    return false; 
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <DatePicker
        className="mb-3 w-100"
        label={tipo}
        value={fecha}
        onChange={setFecha}
        shouldDisableDate={esDisabled}
              
        slots={{
          day: (props) => {
            const f = formatearFecha(props.day, "aaaa-mm-dd");
            const t = !props.outsideCurrentMonth ? turnos?.[f] : null; 
            const disabled = esDisabled(props.day);
            return (             
              <PickersDay {...props} disabled={disabled} >
                <div style={{ fontSize: "0.7rem", lineHeight: 1 }}>
                  {props.day.getDate()}
                  <div 
                    style={{ 
                      fontSize: "0.55rem", 
                      color: props.selected 
                        ? "White" 
                        : disabled 
                          ? "Grey" 
                          : coloresTipo[tipo]
                    }}
                  >
                    {t}
                  </div>
                </div>
              </PickersDay>                
            );
          },
        }}
      />
    </LocalizationProvider>
  );
};

const SelectorTurnosMultiple = ({ opciones, value, onChange }) => {
  const label = "¿Qué turnos podrías hacer?";

  return (
    <FormControl
      className="w-100"
      fullWidth={true}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          const labels = selected
            .map((val) => {
              const opt = opciones.find((o) => o === val);
              return opt ? opt : val;
            })
            .join(", ");
          return labels || label;
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 170,             
            },
          },          
        }}
      >
        {opciones.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.indexOf(option) !== -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const ModalidadTexto = ({ modalidad, setModalidad }) => {
  const activo = modalidad === "Voluntario/P6";

  const toggle = () => setModalidad(activo ? "" : "Voluntario/P6");

  return (
    <div
      onClick={toggle}
      style={{
        color: activo ? "green" : "gray",        
        cursor: "pointer",
        display: "inline-block",
        padding: "2px 4px",
      }}
    >
      {activo ? <BookmarkHeartFill /> : <BookmarkHeart />} Voluntario/P6
    </div>
  );
};
// --------------------- Hook personalizado ---------------------
const usePublicarForm = ({ 
  tipo, 
  quitarTurno, 
  hacerTurnos, 
  setQuitarTurno, 
  setHacerTurnos,
  setFecha,
  setComentarios,
  setModalidad
}) => {
  const [opcionesTurnos, setOpcionesTurnos] = useState([]);
  const [resumen, setResumen] = useState("");

  // Reset al cambiar de tipo
  useEffect(() => {
    if (!tipo) return;

    setQuitarTurno("");
    setHacerTurnos([]);
    setFecha(null);
    setComentarios("");
    setModalidad("");
  }, [tipo]);

  // Actualizar resumen segun tipo y turnos seleccionados
  useEffect(() => {    
    if (!tipo) return; 

    if (tipo === "Quitar") setResumen(tipo + " " + quitarTurno);
    else if (tipo === "Hacer") setResumen(tipo + " " + hacerTurnos.join(", "));
    else if (tipo === "Cambiar") setResumen(tipo + " " + (quitarTurno || "[Mi Turno]") + " x " + (hacerTurnos.join(", ") || "[Otros turnos...]"));
  }, [tipo, quitarTurno, hacerTurnos]);

  return { opcionesTurnos, resumen, setOpcionesTurnos };
};

// --------------------- Función para construir nueva publicación ---------------------
const construirPublicacion = ({ usuario = {}, tipo = "", fecha = null, quitarTurno = "", hacerTurnos = [], comentarios = "", modalidad = "" }) => ({
  nombre: usuario.nombre || "",
  apodo: usuario.apodo || "",
  nucleo: usuario.nucleo || "",
  equipo: usuario.equipo || "",
  dependencia: usuario.dependencia || "",
  telefono: usuario.telefono,
  creado: Timestamp.fromDate(new Date()),
  tipo,
  fecha: fecha ? Timestamp.fromDate(new Date(fecha)) : null,
  quitarTurno,
  hacerTurnos,
  comentarios,
  candidatos: [],
  modalidad,
  estado: "publicado",
});

// --------------------- Componente principal ---------------------
export default function Publicar() {
  const { usuario } = useAuth();  
  const { turnos, turnero } = useTurnos();
  const { agregarPublicacion, procesando } = usePublicaciones();
  const { triggerToast } = useToast();

  const [tipo, setTipo] = useState("");
  const [fecha, setFecha] = useState(null);
  
  const [quitarTurno, setQuitarTurno] = useState("");
  const [hacerTurnos, setHacerTurnos] = useState([]);
  const [comentarios, setComentarios] = useState("");
  const [modalidad, setModalidad] = useState("");

  const { opcionesTurnos, resumen, setOpcionesTurnos } = usePublicarForm({ 
    tipo, 
    fecha, 
    quitarTurno, 
    hacerTurnos, 
    turnos, 
    turnero, 
    setQuitarTurno, 
    setHacerTurnos, 
    setFecha,
    setComentarios,
    setModalidad
  });

  const handleSubmit = async (e) => {
    if (!tipo || !fecha) {
      triggerToast("Selecciona tipo y fecha", {severity: "warning"});
      return;
    }
    e.preventDefault();
    const nuevaPub = construirPublicacion({ 
      usuario, tipo, fecha, quitarTurno, hacerTurnos, comentarios, modalidad 
    });
    try {
      await agregarPublicacion(nuevaPub);
      triggerToast("Publicado con éxito", {severity: "success"});
      // reset
      setTipo("");
      setFecha(null);
      setQuitarTurno("");
      setHacerTurnos([]);
      setComentarios("");
      setModalidad("");
    } catch (err) {
      console.error("Error al publicar:", err);
      if (err.message === "duplicado") {
        triggerToast("No publicado: duplicado", {severity: "warning"});
      } else {
        // Errores de red, permisos, Firebase, etc.
        triggerToast("No publicado: Error", {severity: "error"});
      }
    }
  };

  const hoy = new Date().setHours(0,0,0,0);
  return (
    <Form onSubmit={handleSubmit} className="p-2">
      <div className="text-center fst-italic text-primary fs-08">
        <InfoCircle className="fs-3"/> 
         {" "} Para actualizar tus turnos hazlo desde <strong>TuTurnero</strong>
      </div>
      <br /><br />
      <Tipo tipo={tipo} setTipo={setTipo} />
      {tipo && 
        <Divider sx={{ 
          fontStyle: "italic", 
          fontSize: "0.8rem", 
          m: 3, 
          color: coloresTipo[tipo]
        }}>
          {resumen}
        </Divider>
      }
      {tipo && 
        <SelectorFecha
          tipo={tipo}
          fecha={fecha}
          setFecha={setFecha}
          turnos={turnos}
          turnero={turnero}
          setQuitarTurno={setQuitarTurno}
          setOpcionesTurnos={setOpcionesTurnos}
          setHacerTurnos={setHacerTurnos}
        />
      }
        
      {(tipo === "Hacer" || tipo === "Cambiar") && fecha &&
        <SelectorTurnosMultiple opciones={opcionesTurnos} value={hacerTurnos} onChange={setHacerTurnos} />
      }
      {fecha >= hoy &&        
        <TextField
          className="mb-3"
          label="Comentarios"
          multiline
          maxRows={4}
          fullWidth
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          margin="normal"
        />
      }
      {fecha >= hoy && tipo !== "Cambiar" && <ModalidadTexto modalidad={modalidad} setModalidad={setModalidad} />}
      {fecha >= hoy && 
        <Button
          className="mt-4 mx-auto w-50 d-block"
          variant="primary"
          size="lg"
          type="submit"
          disabled={
            ((tipo === "Hacer" || tipo === "Cambiar") && !hacerTurnos.length) ||
            procesando
          }// deshabilitar si incompleto o publicando
        >
          {procesando ? "Publicando..." : "Publicar"}
        </Button>
      }        
    </Form>
  );
}
