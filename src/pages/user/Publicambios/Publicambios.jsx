import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { TituloH1 } from "../../../components/Titulos";
import ListaPublicaciones from "./ListaPublicaciones";
import Publicar from "./Publicar";

export default function Publicambios() {
  const [tab, setTab] = useState("publicar");
  
  return (
    <>      
    <TituloH1 texto="PubliCambios" tag="h1" color="text-dark" margen="my-3"/>
      
      <Tabs activeKey={tab} onSelect={setTab} className="mb-3" fill>

        <Tab eventKey="publicar" title="Publicar" className="border border-1 rounded p-3 m-3">
          <Publicar />
        </Tab>

        <Tab eventKey="P6" title="P6" className="border border-1 rounded p-1">
          <ListaPublicaciones lista="P6" />
        </Tab>

        <Tab eventKey="HV" title="HV" className="border border-1 rounded p-1">
          <ListaPublicaciones lista="HV" />
        </Tab>

        <Tab eventKey="cambios" title={<span className="text-decoration-line-through">Cambios</span>} className="border border-1 rounded p-3 m-3">
          Lista cambios 
        </Tab>

      </Tabs>
    </>
  );
}
