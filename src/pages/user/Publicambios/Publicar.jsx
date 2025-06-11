import { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";

import { Container, Form } from "react-bootstrap";
import { 
  BookmarkPlusFill, 
  BookmarkPlus, 
  BookmarkDashFill, 
  BookmarkDash, 
  Bookmarks,   
} from "react-bootstrap-icons";

import { TituloSmall } from "../../../components/Titulos";
import { PubItem } from "./PubItem";
import { ToggleGrupoBotones } from "./ToggleGrupoBotones";
import { Comentarios } from "./Comentarios";
import BotonEnviar from "./BotonEnviar";

import { useAuth } from "../../../context/AuthProvider";
import { formatearServicio } from "../../../utils/formatearServicio";


function IconosListas({ lista, setCampo }) {
  return (
    <div className="d-flex justify-content-between mb-3">
      <div 
        className={`text-center ${lista === "HV" ? "text-primary" : "text-secondary"}`} 
        role="button" 
        onClick={() => setCampo("lista", "HV")}
      >
        {lista === "HV" 
          ? <BookmarkPlusFill size="68" /> 
          : <BookmarkPlus size="68" />
        }
        <div>HV</div>
      </div>
      
      <div 
        className={`text-center ${lista === "P6" ? "text-primary" : "text-secondary"}`} 
        role="button" 
        onClick={() => setCampo("lista", "P6")}
      >
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
  );
}

function CampoFecha({ pub, setCampo }) {
  return (
    <>
      <TituloSmall texto="Fecha" />
      <Form.Control
        className="mb-3"
        type="date"
        value={pub.fecha.toDate().toISOString().split("T")[0]}
        onChange={(e) => {
          const nuevaFecha = Timestamp.fromDate(new Date(e.target.value));
          setCampo("fecha", nuevaFecha);
        }}
      />
    </>
  );
}

function CampoJornada({ pub, setCampo }) {
  return (
    <>
      <TituloSmall texto="Jornada" />
      <ToggleGrupoBotones
        opciones={[
          { texto: "M", valor: "M" },
          { texto: "T", valor: "T" },
          { texto: "N", valor: "N" },
        ]}
        valorActual={pub.jornada}
        onClick={(nuevoValor) => setCampo("jornada", nuevoValor)}
      />
    </>
  );
}

function CampoTipo({ pub, setCampo, setDesplegarComentarios }) {
  const handleClick = (nuevoValor) => {
    setCampo("tipo", nuevoValor);
    setDesplegarComentarios(nuevoValor === "otro");

  };

  return (
    <>
      <TituloSmall texto="Tipo de servicio" />
      <ToggleGrupoBotones
        opciones={[
          { texto: "Corto", valor: "c" },
          { texto: "Largo", valor: "L" },
          { texto: "Otro", valor: "otro" },
        ]}
        valorActual={pub.tipo}
        onClick={handleClick}
      />
    </>
  );
}

function CampoFuncion({ pub, setCampo }) {
  return (
    <>
      <TituloSmall texto="Funcion" />
      <ToggleGrupoBotones
        opciones={[
          { texto: "SUP", valor: "Sup" },
          { texto: "INS", valor: "A2" },
          { texto: "IMG", valor: "i" },
        ]}
        valorActual={pub.funcion}
        onClick={(nuevoValor) => setCampo("funcion", nuevoValor)}
      />
    </>
  );
}

export default function Publicar() {
  const { userData } = useAuth();
   
   // Estado para nueva publicación
  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);
  const nuevaPublicacion = (camposConValor = {}) => ({
    creado: Timestamp.now(),
    fecha: Timestamp.fromDate(new Date(hoy)),
    apodo: userData?.apodo || "",
    nombre: userData?.nombre || "",
    nucleo: userData?.nucleo || "",
    equipo: userData?.equipo || "",
    lado: userData?.lado || "",
    lista: null,
    jornada: null,
    tipo: null,
    funcion: null,
    servicio: null,
    comentarios: "",
    estado: "publicado",
    candidatos: [],
    asignado: null,
    ...camposConValor
  });
  const [pub, setPub] = useState(nuevaPublicacion());
  const [otra, setOtra] = useState(false);
  const [key, setKey] = useState(Date.now());

  const [desplegarComentarios, setDesplegarComentarios] = useState(false);
  
  const setCampo = (clave, valor) => {
    if (otra) {
      setPub(nuevaPublicacion({ [clave]: valor }));
      setKey(Date.now());
      setOtra(false);
    } else {
      setPub((prev) => ({
        ...prev,
        [clave]: valor,
        ...(clave === "tipo" ? { comentarios: "" } : {}),
      }));
    }
  };

  useEffect(() => {
    const { jornada, tipo, funcion, lado } = pub;
    setPub((prev) => ({ ...prev, servicio: formatearServicio(jornada, tipo, funcion, lado) }));
  }, [pub.jornada, pub.tipo, pub.funcion, pub.lado]);
  

    
  
  
  return (
    <Container className="p-3">
      
      <IconosListas lista={pub.lista} setCampo={setCampo} />
      <CampoFecha   pub={pub} setCampo={setCampo} />
      <CampoJornada pub={pub} setCampo={setCampo} />
      <CampoTipo    pub={pub} setCampo={setCampo} setDesplegarComentarios={setDesplegarComentarios} />
      <CampoFuncion pub={pub} setCampo={setCampo} />
      <Comentarios  pub={pub} setCampo={setCampo} desplegarComentarios={desplegarComentarios} setDesplegarComentarios={setDesplegarComentarios} />
      
      <BotonEnviar pub={pub} onSuccess={(pubEnviada) => {setPub(pubEnviada); setOtra(true);}} />

      <TituloSmall texto={`Enviar publicación a ${userData.nucleo}`} />
      <PubItem 
        key={key}
        pub={pub} 
        mostrarComentarios={false}
        expandedPubId={pub.id}
      />
      <br />
    </Container>
  );
}
