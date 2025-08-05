import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { TituloH1 } from "../../../components/Titulos";
import { PublicacionesPropias } from "./PublicacionesPropias";
import { Publicar } from "./Publicar";
import { PublicacionesProvider } from "../../../context/PublicacionesContext";
import { PublicacionesTodas } from "./PublicacionesTodas";

export default function Publicambios() {
  const [tab, setTab] = useState("publicar");
  
  return (
    <PublicacionesProvider>

      <TituloH1 texto="PubliCambios" tag="h1" color="text-dark" margen="my-3"/>
      <Tabs activeKey={tab} onSelect={setTab} className="mb-3" fill>
        <Tab eventKey="publicar" title="Publicar" className="border border-1 rounded p-1">
          <Publicar />
        </Tab>
        <Tab eventKey="propios" title="Propias" className="border border-1 rounded p-1">
          <PublicacionesPropias />
        </Tab>        
        <Tab eventKey="todas" title="Todas" className="border border-1 rounded p-1">          
          <PublicacionesTodas />
        </Tab>        
      </Tabs>
    </PublicacionesProvider>
    
  );
}
