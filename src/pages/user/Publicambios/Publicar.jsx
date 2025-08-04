import { useMemo, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Col, Form, Row, Button } from "react-bootstrap";
import { TituloSmall } from "../../../components/Titulos";
import { useAuth } from "../../../context/AuthProvider";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { formatearTurno } from "../../../utils/turnos";

export default function Publicar() {
  const { userData } = useAuth();
  const { agregarPublicacion } = usePublicaciones();
  const [boton, setBoton] = useState({ texto: "Enviar", clase: "primary" });
  const [bloqueado, setBloqueado] = useState(false);
  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  const nuevaPublicacion = useMemo(() => ({
    creado: Timestamp.now(),
    fecha: Timestamp.fromDate(new Date(hoy)),
    apodo: userData?.apodo || "",
    nombre: userData.nombre,
    nucleo: userData.nucleo,
    equipo: userData.equipo,
    ofrece: { jornada: "", tipo: "", funcion: "", turno: "" },
    solicita: { jornada: "", tipo: "", funcion: "", turno: "" },
    modalidad: "",
    comentarios: "",
    estado: "publicado",
    candidatos: [], 
  }), [userData, hoy]);

  const [pub, setPub] = useState(nuevaPublicacion);

  // Refs
  const fechaRef = useRef();
  const comentariosRef = useRef();
  const refs = useRef({});

const handleSubmit = async (e) => {
  e.preventDefault();
  if (bloqueado) return;

  const nuevaPub = {
    ...pub,
    fecha: Timestamp.fromDate(new Date(fechaRef.current.value)),
    comentarios: comentariosRef.current.value,
    ofrece: {
      jornada: refs.current.ofrece_jornada.value,
      tipo: refs.current.ofrece_tipo.value,
      funcion: refs.current.ofrece_funcion.value,
      turno: formatearTurno(
        refs.current.ofrece_jornada.value,
        refs.current.ofrece_tipo.value,
        refs.current.ofrece_funcion.value,        
      ),
    },
    solicita: {
      jornada: refs.current.solicita_jornada.value,
      tipo: refs.current.solicita_tipo.value,
      funcion: refs.current.solicita_funcion.value,
      turno: formatearTurno(
        refs.current.solicita_jornada.value,
        refs.current.solicita_tipo.value,
        refs.current.solicita_funcion.value,       
      ),
    },
    modalidad: refs.current.modalidad.value,
  };

  setPub(nuevaPub);
  setBoton({ texto: "Enviando...", clase: "info" });
  setBloqueado(true);

  try {
    const resp = await agregarPublicacion(nuevaPub);
    // console.log("Publicación enviada:", nuevaPub);
    if (resp && resp.id) {
      setBoton({ texto: "Enviado", clase: "success" });
      // Puedes añadir lógica adicional aquí, como limpiar el formulario o redirigir
    } else if (resp === "duplicado") {
      setBoton({ texto: "Duplicado", clase: "danger" });
    } else {
      setBoton({ texto: "Error", clase: "danger" });
    }
  } catch (err) {
    console.error("Error al publicar:", err);
    setBoton({ texto: "Error", clase: "danger" });
  } finally {
    setTimeout(() => {
      setBoton({ texto: "Enviar", clase: "primary" });
      setBloqueado(false);
    }, 1500);
  }
};


  const handleEnviar = async () => {
    if (bloqueado) return;

    setBoton({ texto: "Enviando...", clase: "info" });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBloqueado(true);
    

    try {
      const resp = await agregarPublicacion(pub);
      if (resp && resp.id) {
        setBoton({ texto: "Enviado", clase:"success" });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onSuccess(resp);
      }
        
      else if (resp == "duplicado") {
        setBoton({ texto: "Duplicado", clase:"danger" });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
    } catch (err) {
      setBoton({ texto: "Error al publicar", clase: "danger" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.error(err);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBoton({ texto: "Enviar", clase: "primary" });
      setBloqueado(false);
    }
  };

  return (
    
      <Form onSubmit={handleSubmit} className="p-3">
        <TituloSmall texto="Fecha" />
        <Form.Control
          className="mb-3"
          type="date"
          defaultValue={pub.fecha.toDate().toISOString().split("T")[0]}
          ref={fechaRef}
        />

        <Row>
          <Col>
            <TituloSmall texto="OFREZCO" />
            <TituloSmall texto="jornada" />
            <Form.Select ref={(el) => refs.current.ofrece_jornada = el} defaultValue="">
              <option value=""></option>
              <option value="M">M</option>
              <option value="T">T</option>
              <option value="N">N</option>
              <option value="L">L</option>
            </Form.Select>
            <TituloSmall texto="tipo" />
            <Form.Select ref={(el) => refs.current.ofrece_tipo = el} defaultValue="">
              <option value=""></option>
              <option value="c">Corto</option>
              <option value="L">Largo</option>
              <option value="otro">Otro (especificar)</option>
            </Form.Select>
            <TituloSmall texto="función" />
            <Form.Select ref={(el) => refs.current.ofrece_funcion = el} defaultValue="">
              <option value=""></option>
              <option value="Sup">Supervisor</option>
              <option value="A2">Instructor</option>
              <option value="i">Imaginaria</option>
              <option value="otro">Otro (especificar)</option>
            </Form.Select>
          </Col>

          <Col>
            <TituloSmall texto="SOLICITO" />
            <TituloSmall texto="jornada" />
            <Form.Select ref={(el) => refs.current.solicita_jornada = el} defaultValue="">
              <option value=""></option>
              <option value="M">M</option>
              <option value="T">T</option>
              <option value="N">N</option>
              <option value="L">L</option>
            </Form.Select>
            <TituloSmall texto="tipo" />
            <Form.Select ref={(el) => refs.current.solicita_tipo = el} defaultValue="">
              <option value=""></option>
              <option value="c">Corto</option>
              <option value="L">Largo</option>
              <option value="otro">Otro (especificar)</option>
            </Form.Select>
            <TituloSmall texto="función" />
            <Form.Select ref={(el) => refs.current.solicita_funcion = el} defaultValue="">
              <option value=""></option>
              <option value="Sup">Supervisor</option>
              <option value="A2">Instructor</option>
              <option value="i">Imaginaria</option>
              <option value="otro">Otro (especificar)</option>
            </Form.Select>
          </Col>
        </Row>

        <TituloSmall texto="modalidad" />
        <Form.Select ref={(el) => refs.current.modalidad = el} defaultValue="" required>
          <option value=""></option>
          <option value="S">Saldo</option>
          <option value="V">Voluntario</option>
        </Form.Select>

        <TituloSmall texto="comentarios" />
        <Form.Control
          as="textarea"
          rows={2}
          className="form-control-sm small"
          defaultValue={pub.comentarios}
          ref={comentariosRef}
        />

        <Button type="submit" className={`mt-3 btn-${boton.clase} w-50 mx-auto d-block`} disabled={bloqueado}>
          {boton.texto}
        </Button>


      </Form>
    
  );
}
