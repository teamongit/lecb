import { useVacaciones } from "../../../context/VacacionesContext";
import { Badge, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

export function Cabecera({vacaciones}) {
  // const { vacaciones, setVacaciones } = useVacaciones();
  
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

  // const handleChangeEstado = (e) => {
  //   const nuevoEstado = e.target.value;
  //   setVacaciones((prev) => ({ ...prev, estado: nuevoEstado }));
  // };

  return (
    <div>
      <h5>
        <Badge bg={estadoColor}>{vacaciones.estado}</Badge>
        <br />
        Ronda {vacaciones.ronda}
      </h5>
      {/* <Form.Select
        value={vacaciones.estado}
        onChange={handleChangeEstado}
        size="sm"
        style={{ width: "auto", marginTop: "10px" }}
      >
        <option value="Activo">Activo</option>
        <option value="Pausado">Pausado</option>
        <option value="Terminado">Terminado</option>
      </Form.Select> */}
    </div>
  );
}
