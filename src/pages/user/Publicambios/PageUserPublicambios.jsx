import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import Titulo from "../../../components/Titulo";
import ListaPublicaciones from "./ListaPublicaciones";
import Publicar from "./Publicar";

export default function PageUserPublicambios() {
  const [tab, setTab] = useState("publicar");

  return (
    <>
      <Titulo tag="h1" texto="PubliCambios" color="text-dark" margen="my-3"/>
      
      <Tabs activeKey={tab} onSelect={setTab} className="mb-3" fill>
        
        <Tab eventKey="publicar" title="Publicar" className="border border-1 rounded p-3 m-3">
          <Publicar />
        </Tab>

        <Tab eventKey="P6" title="P6" className="border border-1 rounded p-3 m-3">
          Lista peticiones de P6
          <ListaPublicaciones lista="P6" />          
        </Tab>

        <Tab eventKey="HV" title="HV" className="border border-1 rounded p-3 m-3">
          Lista voluntarios HV  
          <ListaPublicaciones lista="HV" />            
        </Tab>

        <Tab eventKey="cambios" title="Cambios" className="border border-1 rounded p-3 m-3">
          Lista cambios
        </Tab>

      </Tabs>
    </>
  );
}
