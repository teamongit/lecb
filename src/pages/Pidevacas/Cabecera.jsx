
import { Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

export function Cabecera({vacaciones}) {
  
  
  const [estadoColor, setEstadoColor] = useState("secondary");

  useEffect(() => {
    if (vacaciones?.estado === "Terminado") {
      setEstadoColor("danger");
    } else if (vacaciones?.estado === "Activo") {
      setEstadoColor("primary");
    } else {
      setEstadoColor("secondary");
    }
  }, [vacaciones?.estado]);

  if (!vacaciones) return <div>Cargando...</div>;


  return (
    <div>
      <h5>
        <Badge bg={estadoColor}>{vacaciones.estado} : Ronda {vacaciones.ronda}</Badge>
      </h5>
    </div>
  );
}
