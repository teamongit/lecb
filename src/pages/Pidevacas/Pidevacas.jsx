import { Container } from "react-bootstrap";
import { Cabecera } from "./Cabecera";
import { Orden } from "./Orden";
import { Puntos } from "./Puntos";
import { Historial } from "./Historial";
import { Peticiones } from "./Peticiones";
import { Calendario } from "./Calendario";

import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useVacaciones } from "../../context/VacacionesContext";
// Función auxiliar para calcular días entre fechas
const diffDias = (fecha1, fecha2) => {
  const ms = new Date(fecha2) - new Date(fecha1);
  return Math.abs(ms / (1000 * 60 * 60 * 24)); // días absolutos
};

export function Pidevacas() {
  const { vacaciones } = useVacaciones();

  const [peticiones, setPeticiones] = useState(vacaciones.integrantes.find(i => i.apodo === "RUIZ PIÑER").peticiones);
  const [peticionEnEspera, setPeticionEnEspera] = useState(null); 
  const onClickCiclo = (fechaCiclo) => {
    
    if (peticionEnEspera) {
      // Ya existe una en espera: completar rango
      setPeticiones((prev) =>
        prev.map((p) => {
          if (p.fecha === peticionEnEspera) {
            const fecha1 = new Date(p.fecha);
            const fecha2 = new Date(fechaCiclo);
            const diffDias = Math.abs((fecha2 - fecha1) / (1000 * 60 * 60 * 24));
            const tipo = diffDias <= 8 ? "quincena" : "doble";

            return {
              ...p,
              fecha2: fechaCiclo,
              tipo,
            };
          }
          return p;
        })
      );
      setPeticionEnEspera(null);
    } else {
      // No hay en espera: añadir nueva petición simple
      const yaExiste = peticiones.some(p => p.fecha === fechaCiclo || p.fecha2 === fechaCiclo);
      if (!yaExiste) {
        const nuevaPeticion = {
          fecha: fechaCiclo,
          estado: "pedido",
          tipo: "simple",
        };
        setPeticiones(prev => [...prev, nuevaPeticion]);
      }
    }
  };

  const onEliminar = (fecha) => {
    setPeticiones(prev => prev.filter(p => p.fecha !== fecha));
  };

  const onMarcarMultiple = (fecha) => {
    const peticion = peticiones.find(p => p.fecha === fecha);
    if (peticion && peticion.estado === "pedido" && !peticion.fecha2) {
      setPeticionEnEspera(fecha); 
    }
  };
  
  const onRevertirMultiple = (fecha) => {
    setPeticiones((prev) =>
      prev.map((p) => {
        if (p.fecha === fecha && (p.tipo === "quincena" || p.tipo === "doble")) {
          return {
            ...p,
            fecha2: undefined,
            tipo: "simple",
          };
        }
        return p;
      })
    );
  };

  const onReordenar = (nuevasPeticiones) => {
    setPeticiones(nuevasPeticiones);
  };

  return (
    <>
      <Divider>PideVacas</Divider>      
      <Container className="ms-auto text-center">
        <Cabecera vacaciones={vacaciones}/>
        <Orden vacaciones={vacaciones}/>
        <Peticiones 
          peticiones={peticiones} 
          onEliminar={onEliminar} 
          onMarcarMultiple={onMarcarMultiple}
          peticionEnEspera={peticionEnEspera}
          onRevertirMultiple={onRevertirMultiple}
           onReordenar={onReordenar}
        />
        <Calendario 
          vacaciones={vacaciones} 
          peticiones={peticiones} 
          onClickCiclo={onClickCiclo}
        />
        <Puntos vacaciones={vacaciones}/>
        <Historial vacaciones={vacaciones}/>
      </Container>
    </>
  );
}
