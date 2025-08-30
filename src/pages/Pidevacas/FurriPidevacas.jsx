import { Container, Form } from "react-bootstrap";
import { FurriIntegrantes } from "./FurriIntegrantes";
// import { Disfrutadas } from "./Disfrutadas";
// import { Calendario } from "./Calendario";
// import { Normas } from "./Normas";
// import { IniciarBoton } from "./IniciarBoton";

import { useMemo, useState } from "react";
import { FurriVacacionesDisfrutadas } from "./FurriVacacionesDisfrutadas";

// function SwitchSeccion({ label, seccion, secciones, setSecciones }) {
//   const checked = secciones.includes(seccion);

//   const toggle = (e) => {
//     const isChecked = e.target.checked;
//     const nuevasSecciones = isChecked
//       ? [...secciones, seccion]
//       : secciones.filter((s) => s !== seccion);

//     setSecciones(nuevasSecciones);
//   };

//   return (
//     <Form.Check
//       type="switch"

//       label={label}
//       className="d-flex align-items-center"
//       checked={checked}
//       onChange={toggle}
//     />
//   );
// }


export default function ConfigTerminado() {
  // const [ secciones, setSecciones ] = useState([]);

  // const calendarioMemo = useMemo(
  //   () => <Calendario proximosCiclos={proximosCiclos} setProximosCiclos={setProximosCiclos} />,
  //   [proximosCiclos, setProximosCiclos]
  // );
  // const normasMemo = useMemo(
  //   () => <Normas normas={normas} setNormas={setNormas} />,
  //   [normas, setNormas]
  // );
  


  return (
    
    <Container className="mb-5">
      
      <FurriIntegrantes />
      {/* <SwitchSeccion
        id="integrantes"
        label="Revisado y correcto"
        seccion="integrantes"
        secciones={secciones}
        setSecciones={setSecciones}
      /> */}

      <FurriVacacionesDisfrutadas />
      {/* 
      <SwitchSeccion
        label="Revisado y correcto"
        seccion="disfrutadas"
        secciones={secciones}
        setSecciones={setSecciones}
      /> */}

      {/* {calendarioMemo}
      <SwitchSeccion
        label="Revisado y correcto"
        seccion="calendario"
        secciones={secciones}
        setSecciones={setSecciones}
      /> */}

      {/* {normasMemo}
      <SwitchSeccion
        label="Revisado y correcto"
        seccion="normas"
        secciones={secciones}
        setSecciones={setSecciones}
      /> */}

      {/* <IniciarBoton secciones={secciones} /> */}
    </Container>
    
  );
}
