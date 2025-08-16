// Publicar.jsx
import { useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useAuth } from "../../../context/AuthProvider";
import { usePublicaciones } from "../../../hooks/usePublicaciones";

import { Divider, TextField } from "@mui/material";
import { MuiFechaTurno, CheckboxMultiple, MuiRadio } from "../../../components/MUI";
import { useTurnos } from "../../../hooks/useTurnos";
import { formatearFecha } from "../../../utils/fechas";
import { TURNOS, DURACIONES, CATEGORIA_FUNCION, SERVICIOS } from "../../../utils/constants";
import { formatearTurno } from "../../../utils/turnos";
import { Timestamp } from "firebase/firestore";
import { BookmarkDash, BookmarkDashFill, BookmarkPlus, BookmarkPlusFill, Bookmarks, BookmarksFill } from "react-bootstrap-icons";


const TipoCambio = ({ tipo, setTipo }) => {
  return (
    <>
      <Divider className="mb-3">¿Qué tipo de cambio deseas publicar?</Divider>
      <Row className="text-center">
        <Col role="button" onClick={() => setTipo("quitar")}>
          {tipo === "quitar"
            ? <>
              <BookmarkDashFill className="fs-1 text-danger" />
              <span className="d-block text-danger">Quitar</span>
            </>
            : <>
              <BookmarkDash className="fs-1 text-secondary" />
              <span className="d-block text-secondary">Quitar</span>
            </>
          }
        </Col>
        <Col role="button" onClick={() => setTipo("hacer")}>
          {tipo === "hacer"
            ? <>
              <BookmarkPlusFill className="fs-1 text-primary" />
              <span className="d-block text-primary">Hacer</span>
            </>
            : <>
              <BookmarkPlus className="fs-1 text-secondary" />
              <span className="d-block text-secondary">Hacer</span>
            </>
          }
        </Col>
        <Col role="button" onClick={() => setTipo("cambiar")}>
          {tipo === "cambiar"
            ? <>
              <BookmarksFill className="fs-1" />
              <span className="d-block">Cambiar</span>
            </>
            : <>
              <Bookmarks className="fs-1 text-secondary" />
              <span className="d-block text-secondary">Cambiar</span>
            </>

          }
        </Col>
      </Row>
    </>
  )
}

const Resumen = ({ 
  tipo, 
  quitarFecha, 
  quitarServicio, 
  quitarDuracion, 
  quitarFuncion, 
  
  hacerFecha, 
  hacerServicio, 
  hacerDuracion, 
  hacerFuncion, 
}) => {
  let texto = "", texto2 = "";
  let hidden = true;
  if (tipo === "quitar") {
    texto = "Quitar: " + (formatearTurno(quitarServicio, quitarDuracion, quitarFuncion) || "Servicio") + " x Libre";
  }
  if (tipo === "hacer") {
    texto = "Hacer: Libre x " + (formatearTurno(hacerServicio, hacerDuracion, hacerFuncion) || "Servicio");
  }
  if (tipo === "cambiar") {
    texto = "Cambiar: " + (formatearTurno(quitarServicio, quitarDuracion, quitarFuncion) || "Servicio") + " x " + (formatearTurno(hacerServicio, hacerDuracion, hacerFuncion) || "Servicio");
    if (quitarFecha && hacerFecha && (quitarFecha.getTime() === hacerFecha.getTime())) {
      hidden = false;
      texto = "(1) Quitar: " + (formatearTurno(quitarServicio, quitarDuracion, quitarFuncion) || "Servicio") + " x Libre";
      texto2 = "(2) Hacer: Libre x " + (formatearTurno(hacerServicio, hacerDuracion, hacerFuncion) || "Servicio");
    }
  }
  return (
    <>
    <Divider sx={{ color: "Chocolate", fontStyle: "italic", fontSize: "0.8rem", my: 3, minHeight: "1.5em" }}>
      {texto}
    </Divider>
    <Divider 
      hidden={hidden}
      sx={{ color: "Chocolate", fontStyle: "italic", fontSize: "0.8rem", my: 3, minHeight: "1.5em" }}>
      {texto2}
    </Divider>
    </>
  );
}

const Servicio = ({ tipo, value, setValue }) => {
  const options = tipo == "cambiar"
    ? [...SERVICIOS, {value: "L", label: "Libre (L)"}]
    : SERVICIOS;
  return (
    <MuiRadio
      sx={{ mb: 3, width: "100%" }}
      label="Servicio *"
      value={value}
      onChange={setValue}
      options={options}
    />
  );
}

const Duracion = ({ value, setValue }) => { 
  return (
    <MuiRadio
      sx={{ mb: 3, width: "100%" }}
      label="Duración"
      value={value}
      onChange={setValue}
      options={DURACIONES}
    />
  );
}
const Funcion = ({ categoria, value, setValue }) => {  
  return (
    <CheckboxMultiple
      sx={{ mb: 3 }}
      label="Función"
      value={value}
      onChange={setValue}
      options={CATEGORIA_FUNCION[categoria]}
    />
  );
}
const Comentarios = ({ value, setValue }) => {
  return (
    <TextField
      className="mb-3"
      id="comentarios"
      label="Comentarios"
      multiline
      maxRows={4}
      fullWidth
      value={value}
      onChange={setValue}
      margin="normal"
      placeholder=""
    />
  );
}


export function Publicar() {
  const { usuario } = useAuth();
  const { turnos } = useTurnos();

  const { agregarPublicacion } = usePublicaciones();
  // quitar
  const [quitarFecha, setQuitarFecha] = useState(null);
  const [quitarServicio, setQuitarServicio] = useState("");
  const [quitarDuracion, setQuitarDuracion] = useState("");
  const [quitarFuncion, setQuitarFuncion] = useState([]);
  const [quitarTurno, setQuitarTurno] = useState("");

  // hacer
  const [hacerFecha, setHacerFecha] = useState(null);
  const [hacerServicio, setHacerServicio] = useState("");
  const [hacerDuracion, setHacerDuracion] = useState("");
  const [hacerFuncion, setHacerFuncion] = useState([]);
  const [hacerTurno, setHacerTurno] = useState("");
  // comunes
  const [tipo, setTipo] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [modalidad, setModalidad] = useState(["Voluntario", "Saldo"]);
  // estilos
  const [cols, setCols] = useState(12);
  // acciones

  // quitar
  useEffect(() => {
    if (!quitarFecha) return;
    const f = formatearFecha(quitarFecha, "aaaa-mm-dd");
    const turno = turnos[f] || "";
    const { servicio, duracion, funcion } = TURNOS[turno] || {};

    setQuitarTurno(turno || "??");
    setQuitarServicio(servicio || "??");
    setQuitarDuracion(duracion || "");
    setQuitarFuncion(funcion || []);
  }, [quitarFecha]);
  // hacer
   useEffect(() => {
    if (!hacerFecha) return;
    const f = formatearFecha(hacerFecha, "aaaa-mm-dd");
    const turno = turnos[f] || "";
    const { servicio, duracion, funcion } = TURNOS[turno] || {};

    setHacerTurno(turno || "??");
    setHacerServicio(servicio || "??");
    setHacerDuracion(duracion || "");
    setHacerFuncion(funcion || []);
  }, [hacerFecha]);
  useEffect(() => {
    if (tipo === "cambiar") 
      setCols(6);
    else 
      setCols(12);
  }, [tipo]);
  // resetear
  useEffect(() => {
    if (!tipo) return;
    setQuitarFecha(null);
    setQuitarServicio("");
    setQuitarDuracion("");
    setQuitarFuncion([]);
    setQuitarTurno("");
    setHacerFecha(null);
    setHacerServicio("");
    setHacerDuracion("");
    setHacerFuncion([]);
    setHacerTurno("");
    setComentarios("");
    setModalidad(["Voluntario", "Saldo"]);
  }, [tipo]);
  // publicar
  const handleSubmit = async (e) => {
    e.preventDefault();

    const pubBase = {
      // usuario    
      nombre: usuario.nombre,
      apodo: usuario.apodo,
      nucleo: usuario.nucleo,
      equipo: usuario.equipo,
      // publicacion
      creado: Timestamp.fromDate(new Date()),
      comentarios,
      modalidad,
      candidatos: [],
      estado: "publicado",
    };

    try {
      switch (tipo) {
        case "quitar": {
          const nuevaPub = {
            ...pubBase,
            tipo,
            fecha: Timestamp.fromDate(quitarFecha),
            servicio: quitarServicio,
            duracion: quitarDuracion,
            funcion: quitarFuncion,
            turno: quitarTurno,
          };
          await agregarPublicacion(nuevaPub);
          break;
        }

        case "hacer": {
          const nuevaPub = {
            ...pubBase,
            tipo,
            fecha: Timestamp.fromDate(hacerFecha),
            servicio: hacerServicio,
            duracion: hacerDuracion,
            funcion: hacerFuncion,
            turno: hacerTurno,
          };
          await agregarPublicacion(nuevaPub);
          break;
        }

        case "cambiar": {
          if (quitarFecha.getTime() === hacerFecha.getTime()) {
            const nuevaPub = {
              ...pubBase,
              tipo,
              fecha: Timestamp.fromDate(hacerFecha),
              servicio: hacerServicio,
              duracion: hacerDuracion,
              funcion: hacerFuncion,
              turno: quitarTurno + " x " + hacerTurno,
            };

            await agregarPublicacion(nuevaPub);
          } else {
            const pubQuitar = {
              ...pubBase,
              tipo: "quitar",
              fecha: Timestamp.fromDate(quitarFecha),
              servicio: quitarServicio,
              duracion: quitarDuracion,
              funcion: quitarFuncion,
              turno: quitarTurno,
            };

            const pubHacer = {
              ...pubBase,
              tipo: "hacer",
              fecha: Timestamp.fromDate(hacerFecha),
              servicio: hacerServicio,
              duracion: hacerDuracion,
              funcion: hacerFuncion,
              turno: hacerTurno,
            };

            await Promise.all([
              agregarPublicacion(pubQuitar),
              agregarPublicacion(pubHacer)
            ]);
          }
          break;
        }
      }

      alert("¡Publicado con éxito!");
    } catch (err) {
      console.error("Error al publicar:", err);
      alert("Hubo un problema al publicar.");
    }
  };


  return (
    <Form onSubmit={handleSubmit} className="p-2">
      <TipoCambio tipo={tipo} setTipo={setTipo} />
      <Resumen 
        tipo={tipo} 
        quitarFecha={quitarFecha} 
        quitarServicio={quitarServicio} 
        quitarDuracion={quitarDuracion}
        quitarFuncion={quitarFuncion}
        hacerFecha={hacerFecha}
        hacerServicio={hacerServicio}
        hacerDuracion={hacerDuracion}
        hacerFuncion={hacerFuncion}        
      />      
      <Row>
        {/* QUITAR */}
        <Col 
          xs={cols} 
          className="mt-3" 
          hidden={!tipo || tipo === "hacer"}
        > 
          <MuiFechaTurno 
            className="mb-3 w-100"
            label={"Quitar"}
            value={quitarFecha}
            turnos={turnos}
            onChange={(date) => setQuitarFecha(date)}
            required
          />           
          
          {quitarFecha && (
            <>
              <Servicio tipo={tipo} value={quitarServicio} setValue={setQuitarServicio} />
              {!(["N", "L"].includes(quitarServicio)) && 
                <Duracion value={quitarDuracion} setValue={setQuitarDuracion} />
              }
              {quitarServicio != "L" && 
                <Funcion categoria={usuario.categoria} value={quitarFuncion} setValue={setQuitarFuncion} />
              }
            </>
          )}
        </Col>
        {/* HACER */}
        <Col 
          xs={cols} 
          className="mt-3" 
          hidden={!tipo || tipo === "quitar"}
        >
          <MuiFechaTurno 
            className="mb-3 w-100"
            label={"Hacer"}
            value={hacerFecha}
            turnos={turnos}
            onChange={(date) => setHacerFecha(date)}
            required
          />
          {hacerFecha && (
            <>
              <Servicio tipo={tipo} value={hacerServicio} setValue={setHacerServicio} />
              <Duracion value={hacerDuracion} setValue={setHacerDuracion} />
              <Funcion categoria={usuario.categoria} value={hacerFuncion} setValue={setHacerFuncion} />              
            </>
          )}
        </Col>
      </Row>
      {(quitarFecha || hacerFecha) && (
        <>
          <Comentarios value={comentarios} setValue={(e) => setComentarios(e.target.value)} />
          <Button className="mt-4 mx-auto w-50 d-block" variant="primary" size="lg" type="submit">
            Publicar
          </Button>
        </>
      )}
    </Form>
  );
}