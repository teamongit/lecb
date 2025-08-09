// Publicar.jsx
import { useState, useEffect, useReducer, useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import { Row, Col, Button } from "react-bootstrap";
import { Titulo } from "../../../components/Titulos";
import { useAuth } from "../../../context/AuthProvider";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearTurno } from "../../../utils/turnos";
import { useForm } from "react-hook-form";
import { Divider, TextField } from "@mui/material";
import { MuiDatePicker, MuiSelect } from "../../../components/MUI";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { useTurnos } from "../../../hooks/useTurnos";
import { formatearFecha } from "../../../utils/fechas";


// Configuración del menú
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const MUISelectMultipleCheckboxes = ({
  label = "Seleccionar",
  value = [], // array: ["Sup", "Ins"]
  onChange, // función que recibe event
  options = [], // [{ value: "Sup", label: "Supervisor" }]
  className = "",
  required = false,
  disabled = false,
  fullWidth = true,
}) => {
  return (
    <FormControl
      className={className}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          const labels = selected
            .map(val => {
              const opt = options.find(o => o.value === val);
              return opt ? opt.label : val;
            })
            .join(", ");
          return labels || "Sin selección";
        }}
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) !== -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
const FUNCIONES = [
  { value: "Sup", label: "Supervisor" },
  { value: "Ins", label: "Instructor" },
  { value: "Img", label: "Imaginaria" },
];

// Duracions de cambio
const TIPOS_CAMBIO = {
  QUITAR: "quitar",
  HACER: "hacer",
  CAMBIAR: "cambiar",
};



export const ComentariosField = ({ value, onChange }) => (
  <TextField
    id="comentarios"
    label="Comentarios (opcional)"
    multiline
    maxRows={4}
    fullWidth
    value={value}
    onChange={(e) => onChange(e.target.value)}
    margin="normal"
    placeholder="Ej: Prefiero no turnos seguidos, cambio por necesidad familiar..."
  />
);

export const ModalidadSelector = ({ modalidad, onChange, duracion }) => {
  const opciones = duracion === "quitar"
    ? [{ value: "P6", label: "P6" }, { value: "Saldo", label: "Saldo" }]
    : [{ value: "Voluntario", label: "Voluntario" }, { value: "Saldo", label: "Saldo" }];

  return (
    <MuiSelect
      className="my-3"
      label="Modalidad del cambio"
      value={modalidad}
      onChange={(e) => onChange(e.target.value)}
      options={opciones}
      required
    />
  );
};


export const TurnoSelector = ({ label, value, onChange, showDuracion = true, showFuncion = true, showCualquieraEnFuncion = false, }) => {
  const ocultarDuracion = !value.jornada || value.jornada === "N";
  const fecha = value.fecha;
  const jornada = value.jornada;
  const duracion = value.duracion;
  const funcion = value.funcion;

  const opcionesFuncionBase = [
    { value: "Sup", label: "Supervisor" },
    { value: "Ins", label: "Instructor" },
    { value: "Img", label: "Imaginaria" },
  ];

  const opcionesFuncion = showCualquieraEnFuncion
    ? [{ value: "cualquiera", label: "Cualquiera" }, ...opcionesFuncionBase]
    : opcionesFuncionBase;

  return (
    <>
      <Tienes f={fecha} />
      <MuiDatePicker
        className="my-3"
        label={label}
        value={fecha}
        onChange={(date) => onChange("fecha")(date)}
        required
      />
      <MuiSelect
        className="my-3"
        label="Servicio"
        value={jornada}
        onChange={(e) => onChange("jornada")(e)}
        options={[
          { value: "M", label: "Mañana (M)" },
          { value: "T", label: "Tarde (T)" },
          { value: "N", label: "Noche (N)" },
        ]}
        required
      />
      {/* {showDuracion && ( */}
      {/* {!ocultarDuracion && ( */}
        
        <MuiSelect
          className="my-3"
          label="Duracion del servicio"
          value={duracion}
          onChange={(e) => onChange("duracion")(e)}
          defaultOptionLabel="Cualquiera"
          options={[
            { value: "c", label: "Corta" },
            { value: "l", label: "Larga" },
          ]}
          hidden={ocultarDuracion}
        />
        
      {/* )} */}
      {showFuncion && value.jornada && (
        <MUISelectMultipleCheckboxes
          
          label="Función que aceptas (opcional)"
          value={Array.isArray(value.funcion) ? value.funcion : []}
          onChange={(e) => onChange("funcion")(e)}
          options={[
            { value: "Sup", label: "Supervisor" },
            { value: "Ins", label: "Instructor" },
            { value: "Img", label: "Imaginaria" },
          ]}
          // hidden={!value.jornada}
        />
      )}
    </>
  );
};

// Reducer para manejar el estado del formulario
const publicacionReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "RESET":
      return {
        ...payload, // ← payload ya incluye el `cambio` correcto
        // No sobrescribas `cambio`, `modalidad`, etc. aquí
      };
      // return {
      //   ...payload,
      //   cambio: "",
      //   modalidad: "",
      //   comentarios: "",
      //   ofrece: { ...payload.ofrece },
      //   solicita: { ...payload.solicita },
      // };

    case "SET_CAMBIO":
      return {
        ...state,
        cambio: payload,
      };

    case "UPDATE_OFRECE":
      return {
        ...state,
        ofrece: { ...state.ofrece, ...payload },
      };

    case "UPDATE_SOLICITA":
      return {
        ...state,
        solicita: { ...state.solicita, ...payload },
      };

    case "UPDATE_CAMPO":
      return {
        ...state,
        [payload.campo]: payload.valor,
      };

    default:
      return state;
  }
};

function Tienes({ f }) {
  const { turnos } = useTurnos();
  // // if (loading || !f) return "";
  const turno = turnos[formatearFecha(f, "AAAA-MM-DD")];
const texto = !f
  ? ""
  : "tengo " + (turno || "L");
  
  return (
    <Divider sx={{ fontSize: "0.8rem", my: 0, minHeight: "1.5em" }}>
      {texto}
    </Divider>
  );
}

export function Publicar() {
  const { usuario } = useAuth();
  const { agregarPublicacion } = usePublicaciones();

  // Estado inicial
  const estadoInicial = useMemo(
    () => ({
      creado: Timestamp.now(),
      apodo: usuario.apodo,
      nombre: usuario.nombre,
      nucleo: usuario.nucleo,
      equipo: usuario.equipo,
      estado: "publicado",
      candidatos: [],
      cambio: "",
      modalidad: "",
      comentarios: "",
      ofrece: { fecha: null, jornada: "", duracion: "", funcion: [], turno: "" },
      solicita: { fecha: null, jornada: "", duracion: "", funcion: [], turno: "" },
    }),
    [usuario]
  );

  const [state, dispatch] = useReducer(publicacionReducer, estadoInicial);
    useEffect(() => {
    if (state.cambio) {
      // Cuando el usuario selecciona un nuevo duracion de cambio,
      // reseteamos TODO excepto el propio `cambio`
      const nuevoEstado = {
        ...estadoInicial,
        cambio: state.cambio, // mantenemos el nuevo duracion
        creado: Timestamp.now(), // actualizamos la fecha de creación
      };
      dispatch({ type: "RESET", payload: nuevoEstado });
    }
    // ❌ Importante: NO incluyas `estadoInicial` en las dependencias
    // porque causaría un loop infinito
  }, [state.cambio]);
  // Inicializar react-hook-form
  const {
    handleSubmit: handleSubmitForm,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: estadoInicial,
  });

  // Sincronizar react-hook-form con el reducer (opcional, pero útil para validaciones)
  useEffect(() => {
    Object.entries(state).forEach(([key, value]) => {
      if (key !== "ofrece" && key !== "solicita") {
        setValue(key, value, { shouldValidate: true });
      }
    });
  }, [state, setValue]);

  // Resetear formulario al cambiar usuario
  // useEffect(() => {
  //   dispatch({ type: "RESET", payload: estadoInicial });
  // }, [estadoInicial]);

  // Manejadores
  const handleCambioChange = (e) => {
  const value = e.target.value;
  dispatch({ type: "SET_CAMBIO", payload: value });
};

  const handleOfreceChange = (campo) => (valor) => {
  // Si es un evento (tiene .target), extrae el valor
  const value = valor?.target?.value !== undefined ? valor.target.value : valor;

  dispatch({
    type: "UPDATE_OFRECE",
    payload: { [campo]: value },
  });
};


const handleSolicitaChange = (campo) => (valor) => {
  const value = valor?.target?.value !== undefined ? valor.target.value : valor;

  dispatch({
    type: "UPDATE_SOLICITA",
    payload: { [campo]: value },
  });
};


const handleCampoChange = (campo) => (valor) => {
  const nuevoValor = valor && valor.target ? valor.target.value : valor;
  dispatch({
    type: "UPDATE_CAMPO",
    payload: { campo, valor: nuevoValor },
  });
};

  // Validación de habilitación del botón
  const esValido = useMemo(() => {
    switch (state.cambio) {
      case TIPOS_CAMBIO.CAMBIAR:
        return Boolean(
          state.ofrece.jornada &&
            state.solicita.jornada &&
            state.ofrece.fecha &&
            state.solicita.fecha
        );
      case TIPOS_CAMBIO.QUITAR:
      case TIPOS_CAMBIO.HACER:
        return Boolean(state.ofrece.jornada && state.modalidad);
      default:
        return false;
    }
  }, [state]);

  const handleSubmit = async (formData) => {
    if (!esValido) return;

    const formatearFecha = (fecha) =>
      fecha ? Timestamp.fromDate(new Date(fecha)) : null;

    const pubFinal = {
      ...state,
      ofrece: {
        ...state.ofrece,
        turno: formatearTurno(
          state.ofrece.jornada,
          state.ofrece.duracion,
          state.ofrece.funcion
        ),
        fecha: formatearFecha(state.ofrece.fecha),
      },
      solicita: {
        ...state.solicita,
        turno: formatearTurno(
          state.solicita.jornada,
          state.solicita.duracion,
          state.solicita.funcion
        ),
        fecha: formatearFecha(state.solicita.fecha), // ✅ Correcto
      },
    };

    console.log("Publicación enviada:", pubFinal);

    // Descomentar cuando estés listo
    /*
    try {
      setBotonTexto("Enviando...");
      const resp = await agregarPublicacion(pubFinal);
      if (resp?.id) {
        alert("¡Publicado con éxito!");
        dispatch({ type: "RESET", payload: estadoInicial });
      } else if (resp === "duplicado") {
        alert("Ya tienes una publicación similar.");
      } else {
        alert("Error al publicar.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Hubo un problema al publicar.");
    } finally {
      setBotonTexto("Publicar");
    }
    */
  };

  return (
    <div className="p-3">
      

      <form onSubmit={handleSubmitForm(handleSubmit)}>
        <MuiSelect
          className="my-3"
          label="¿Qué deseas hacer?"
          value={state.cambio}
          onChange={handleCambioChange}
          options={[
            { value: TIPOS_CAMBIO.QUITAR, label: "Quitar un turno (-1)" },
            { value: TIPOS_CAMBIO.HACER, label: "Hacer un turno (+1)" },
            { value: TIPOS_CAMBIO.CAMBIAR, label: "Intercambiar un turno (1x1)" },
          ]}
          required
        />

        {/* --- OPCIÓN: Quitar o Hacer --- */}
        {(state.cambio === TIPOS_CAMBIO.QUITAR ||
          state.cambio === TIPOS_CAMBIO.HACER) && (
          <>
            
            <TurnoSelector
              label={
                state.cambio === TIPOS_CAMBIO.QUITAR
                  ? "Turno que cedo"
                  : "Turno que puedo cubrir"
              }
              value={state.ofrece}
              onChange={handleOfreceChange}
            />
            
            
            <ModalidadSelector
              modalidad={state.modalidad}
              onChange={handleCampoChange("modalidad")}
              duracion={state.cambio}
            />
          </>
        )}

        {/* --- OPCIÓN: Cambiar --- */}
        {state.cambio === TIPOS_CAMBIO.CAMBIAR && (
          <Row>
            <Col xs={6} md={6}>
              <TurnoSelector
                label="Ofrezco"
                value={state.ofrece}
                onChange={handleOfreceChange}                
              />
            </Col>
            <Col xs={6} md={6}>
              <TurnoSelector
                label="Solicito"
                value={state.solicita}
                onChange={handleSolicitaChange}
                showCualquieraEnFuncion={true}
              />
            </Col>
          </Row>
        )}

        {/* Comentarios */}
        {state.cambio && (
          <ComentariosField
            value={state.comentarios}
            onChange={handleCampoChange("comentarios")}
          />
        )}

        <Button
          type="submit"
          className="mt-4 w-100"
          variant="primary"
          disabled={!esValido}
          size="lg"
        >
          Publicar
        </Button>
      </form>
    </div>
  );
}