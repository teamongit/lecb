import { Container, Form } from "react-bootstrap";
import { Integrantes } from "./Integrantes";
import { Disfrutadas } from "./Disfrutadas";
import { Calendario } from "./Calendario";
import { Normas } from "./Normas";
import { IniciarBoton } from "./IniciarBoton";
import { useVacaciones } from "../../context/VacacionesContext";
import { useMemo, useState } from "react";

function SwitchSeccion({ label, seccion, secciones, setSecciones }) {
  const checked = secciones.includes(seccion);

  const toggle = (e) => {
    const isChecked = e.target.checked;
    const nuevasSecciones = isChecked
      ? [...secciones, seccion]
      : secciones.filter((s) => s !== seccion);

    setSecciones(nuevasSecciones);
  };

  return (
    <Form.Check
      type="switch"

      label={label}
      className="d-flex align-items-center"
      checked={checked}
      onChange={toggle}
    />
  );
}


export function ConfigTerminado() {
  const { 
    vacaciones, 
    cantidades, setCantidades,
    integrantes, setIntegrantes,
    proximosCiclos, setProximosCiclos,
    ciclos, 
    normas, setNormas,
  } = useVacaciones();
  const [ secciones, setSecciones ] = useState([]);

  const calendarioMemo = useMemo(
    () => <Calendario proximosCiclos={proximosCiclos} setProximosCiclos={setProximosCiclos} />,
    [proximosCiclos, setProximosCiclos]
  );
  const normasMemo = useMemo(
    () => <Normas normas={normas} setNormas={setNormas} />,
    [normas, setNormas]
  );
  if (!vacaciones) return <p>Cargando...</p>;


  return (
    <Container className="mb-5">
      
      <Integrantes 
        cantidades={cantidades}
        setCantidades={setCantidades}
        setIntegrantes={setIntegrantes}
      />
      <SwitchSeccion
        id="integrantes"
        label="Revisado y correcto"
        seccion="integrantes"
        secciones={secciones}
        setSecciones={setSecciones}
      />

      <Disfrutadas 
        integrantes={integrantes}
        setIntegrantes={setIntegrantes}
        ciclos={ciclos}
      />
      <SwitchSeccion
        label="Revisado y correcto"
        seccion="disfrutadas"
        secciones={secciones}
        setSecciones={setSecciones}
      />

      {calendarioMemo}
      <SwitchSeccion
        label="Revisado y correcto"
        seccion="calendario"
        secciones={secciones}
        setSecciones={setSecciones}
      />

      {normasMemo}
      <SwitchSeccion
        label="Revisado y correcto"
        seccion="normas"
        secciones={secciones}
        setSecciones={setSecciones}
      />

      <IniciarBoton secciones={secciones} />
    </Container>
  );
}
