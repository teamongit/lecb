
import { useVacaciones } from "../../../context/VacacionesContext";
import { Container } from "react-bootstrap";
import { Orden } from "./Orden";
import { Puntos } from "./Puntos";
import { Peticiones } from "./Peticiones";
import { Cabecera } from "./Cabecera";
import { avanzar } from "./avanzar";

import BotonLlamarFuncion from "./BotonLlamarFuncion";
import { vacaciones } from "./vacaciones";
import Divider from "@mui/material/Divider";
import { Calendario } from "./Calendario";

export function Pidevacas() {
  // const { vacaciones } = useVacaciones();
  
  // console.log(vacaciones)
  if (!vacaciones) return (<div>loading</div>);
  // vacaciones.integrantes.sort((a,b) => a.orden[vacaciones.ronda] - b.orden[vacaciones.ronda])
  return (
    <>
      <Divider>PideVacas</Divider>
      
      <Container className="ms-auto text-center">
        <Cabecera vacaciones={vacaciones}/>
        <Orden vacaciones={vacaciones}/>
        {/* <Puntos vacaciones={vacaciones}/> */}
      {/* 
        <Peticiones vacaciones={vacaciones}/> 
      */}
      {/* <button onClick={() => avanzar(vacaciones)}>AVANZAR</button> */}
      <Calendario vacaciones={vacaciones}/>
      </Container>
    </>
  );
}
