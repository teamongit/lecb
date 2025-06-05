import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

import TitlePage from "../../../components/TitlePage";
import Calendario from "../../../components/Calendario";
import ListaP6 from "./ListaP6";
import PublicarForm from "./PublicarForm";
import IconToggle from "./IconToggle";
import ListaHV from "./ListaHV";

export default function PageUserPublicambios() {
  const [tab, setTab] = useState("publicar");
  const [vista, setVista] = useState("list");



  return (
    <>
      <div className="text-center">
        <TitlePage texto="PubliCambios"/>
      </div>
      <Tabs activeKey={tab} onSelect={setTab} className="mb-3" fill>
        <Tab eventKey="publicar" title="Publicar" className="border border-1 rounded p-3 m-3">
          <PublicarForm />
        </Tab>

        <Tab eventKey="P6" title="P6" className="border border-1 rounded p-3 m-3">
          Lista peticiones de P6
          <ListaP6 />
          {/* <IconToggle selected={vista} onChange={setVista} />
          {vista === "list" ? ( 
            <ListaP6 />
           ) : (
            <Calendario />
          )} */}
        </Tab>

        <Tab eventKey="HV" title="HV" className="border border-1 rounded p-3 m-3">
          Lista voluntarios HV  
            <ListaHV />
          {/*<IconToggle selected={vista} onChange={setVista} />
           {vista === "list" ? (
            <ListaHV />
          ) : (
            <Calendario />            
          )} */}
        </Tab>
        <Tab eventKey="cambios" title="Cambios" className="border border-1 rounded p-3 m-3">
          Lista cambios
        </Tab>
      </Tabs>
    </>
  );
}
