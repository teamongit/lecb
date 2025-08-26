import { useState, useMemo } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Titulo } from "@/components/Titulos";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { useAuth } from "../../../hooks/useAuth";
import ListaPublicaciones from "./ListaPublicaciones";
import Publicar from "./Publicar";


export default function Publicambios() {
  const [tab, setTab] = useState("publicar");
  const { usuario } = useAuth();
  const { publicaciones } = usePublicaciones();

  // Memoizamos los conjuntos de publicaciones
  const conjuntos = useMemo(() => {
    if (!usuario || !publicaciones) return {};

    const todas = publicaciones.filter(
      (pub) => pub.estado === "publicado" && pub.nombre !== usuario.nombre
    );

    const propias = publicaciones.filter(
      (pub) => pub.estado === "publicado" && pub.nombre === usuario.nombre
    );

    const apuntado = publicaciones.filter(
      (pub) =>
        pub.estado === "publicado" &&
        pub.nombre !== usuario.nombre &&
        pub.candidatos.some((c) => c.nombre === usuario.nombre)
    );

    const aprobado = publicaciones.filter(
      (pub) =>
        pub.estado === "aprobado" &&
        (pub.nombre === usuario.nombre || pub.candidatos.some((c) => c.nombre === usuario.nombre))
    );

    return { todas, propias, apuntado, aprobado };
  }, [publicaciones, usuario]);

  const className="border border-1 rounded p-1";
  return (
    <>
      <Titulo titulo="PubliCambios" Tag="h1" />
      <Tabs activeKey={tab} onSelect={setTab} fill mountOnEnter={false} unmountOnExit={false}>
        
        <Tab eventKey="publicar" title="Publicar" className={className}>
          <Publicar />
        </Tab>

        <Tab eventKey="todas" title="Todas" className={className}>
          <Titulo titulo="Publicaciones del resto de usuarios" Tag="small" estilo="mb-3"/>
          <ListaPublicaciones publicaciones={conjuntos.todas} />
        </Tab>
               
        <Tab eventKey="propias" title="Propias" className={className}>
          <Titulo titulo="Mis propias publicaciones" Tag="small" estilo="mb-3"/>
          <div className="ms-3 mb-3">
          <small>
            1. Elige al candidato de la lista.<br />
            2. Cuando el cambio esté aprobado (RRHH, Quintiq, ...)<br />
            3. Clica en el botón de intercambiar turnos.<br />
            4. La publicación pasará a "Aprobado".
          </small>
          </div>
          <ListaPublicaciones publicaciones={conjuntos.propias} esPropia={true}/>
        </Tab>  

        <Tab eventKey="apuntado" title="Apuntado" className={className}>
          <Titulo titulo="Publicaciones donde me he apuntado como candidato" Tag="small" estilo="mb-3"/>
          <ListaPublicaciones publicaciones={conjuntos.apuntado} esApuntado={true}/>
        </Tab>   

        <Tab eventKey="aprobado" title="Aprobado" className={className}>
          <Titulo titulo="Publicaciones con cambios tramitados y aprobados" Tag="small" estilo="mb-3"/>
          <ListaPublicaciones publicaciones={conjuntos.aprobado} esAprobado={true}/>
        </Tab>        

      </Tabs>
    </>
    
  );
}
