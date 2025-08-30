import { useState, useMemo } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Titulo } from "@/components/Titulos";
import { usePublicaciones } from "@/hooks/usePublicaciones";
import { useAuth } from "@/hooks/useAuth";
import ListaPublicaciones from "./ListaPublicaciones";
import Publicar from "./Publicar";

export default function Publicambios() {
  const [tab, setTab] = useState("publicar");
  const { usuario } = useAuth();
  const { publicaciones } = usePublicaciones();

  const conjuntos = useMemo(() => {
    if (!usuario || !publicaciones) return { todas: [], propias: [], apuntado: [], aprobado: [] };

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

  const className = "border border-1 rounded p-0";

  return (
    <>
      <Titulo titulo="PubliCambios" Tag="h1" />
      <Tabs
        activeKey={tab}
        onSelect={setTab}
        mountOnEnter={false}
        unmountOnExit={false}
        fill
        className="fs-07"
      >
        <Tab eventKey="publicar" title="Publicar" tabClassName="p-1" className={className}>
          <Publicar />
        </Tab>

        <Tab eventKey="todas" title={`Todas (${conjuntos.todas.length})`} tabClassName="p-1" className={className}>
          <small>Publicaciones del resto de usuarios</small><br/><br/>
          <ListaPublicaciones publicaciones={conjuntos.todas} />
        </Tab>

        <Tab eventKey="propias" title={`Propias (${conjuntos.propias.length})`} tabClassName="p-1" className={className}>
          <small>
            Lo que yo he publicado (instrucciones)
            <ol>
              <li>Elige al candidato de la lista</li>
              <li>Cuando el cambio esté aprobado (RRHH, Quintiq, ...)</li>
              <li>Clica en el botón de cambiar turnos</li>
              <li>La publicación pasará a "Aprobado"</li>
            </ol>
          </small>
          <ListaPublicaciones publicaciones={conjuntos.propias} esPropia={true} />
        </Tab>

        <Tab eventKey="apuntado" title={`Apuntado (${conjuntos.apuntado.length})`} tabClassName="p-1" className={className}>
          <small>Publicaciones donde me he apuntado como candidato</small><br/><br/>
          <ListaPublicaciones publicaciones={conjuntos.apuntado} esApuntado={true} />
        </Tab>

        <Tab eventKey="aprobado" title={`Aprobado (${conjuntos.aprobado.length})`} tabClassName="p-1" className={className}>
          <small>Publicaciones con cambios tramitados y aprobados</small><br/><br/>
          <ListaPublicaciones publicaciones={conjuntos.aprobado} esAprobado={true} />
        </Tab>
      </Tabs>
    </>
  );
}
