import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Titulo } from "../../../components/Titulos";
import { PublicacionesPropias } from "./Propias";
import { Publicar } from "./Publicar";
import { PublicacionesProvider } from "../../../context/PublicacionesContext";
import { PublicacionesTodas } from "./Todas";

export default function Publicambios() {
  const [tab, setTab] = useState("publicar");
  
  return (
    <PublicacionesProvider>

      <Titulo titulo="PubliCambios" Tag="h1" />
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
