import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useDatosApps } from "../../../context/DatosAppsContext";
import Calendario from "../../../components/Calendario";
import ListaPublicaciones from "./ListaPublicaciones";
import PublicarForm from "./PublicarForm";
import IconToggle from "./IconToggle";
import ListaHv from "./ListaHv";

export default function PageUserPublicambios() {
  const [tab, setTab] = useState("publicar");
  const { data, loading, cargarCampo } = useDatosApps();
  const [vista, setVista] = useState("list");

  useEffect(() => {
    cargarCampo("publicaciones");
    cargarCampo("usuarios");
    cargarCampo("servicios");
  }, []);

  return (
    <>
      <div className="text-center">
        <h1 className="m-5 text-shadow">PubliCambios</h1>
      </div>
      <Tabs activeKey={tab} onSelect={setTab} className="mb-3" fill>
        <Tab eventKey="publicar" title="Publicar" className="border border-1 rounded p-3 m-3">
          <PublicarForm />
        </Tab>

        <Tab eventKey="P6" title="P6" className="border border-1 rounded p-3 m-3">
          <IconToggle selected={vista} onChange={setVista} />
          {vista === "list" ? (
            <ListaPublicaciones data={data} />
          ) : (
            <Calendario />
          )}
        </Tab>

        <Tab eventKey="HV" title="HV" className="border border-1 rounded p-3 m-3">
          <IconToggle selected={vista} onChange={setVista} />
          {vista === "list" ? (
            <ListaHv data={data} />
          ) : (
            <Calendario />
          )}
        </Tab>
        <Tab eventKey="cambios" title="Cambios" className="border border-1 rounded p-3 m-3">
          Lista cambios
        </Tab>
      </Tabs>
    </>
  );
}
