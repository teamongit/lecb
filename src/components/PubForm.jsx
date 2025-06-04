import { useState } from "react";
import { Form, Button, InputGroup, ButtonGroup, ToggleButton } from "react-bootstrap";

function PubForm() {
  const [modalidad, setModalidad] = useState('');
  const [jornada, setJornada] = useState('');
  const [fecha, setFecha] = useState('');
  const modalidades = [
    { name: "Puedo Hacer", value: "PH" },
    { name: "Quiero Quitarme", value: "QQ" },
  ];
  const jornadas = [
    { name: "M", value: "M" },
    { name: "T", value: "T" },
    { name: "N", value: "N" },    
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Modalidad:", modalidad);
    console.log("Fecha:", fecha);
    console.log("Jornada:", jornada);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="p-3">
        <InputGroup.Text>Fecha</InputGroup.Text>
        <Form.Control
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </InputGroup>  
      <InputGroup className="p-3 d-flex flex-column align-items-start">        
        <ButtonGroup>
          {modalidades.map((mod) => (
            <ToggleButton
              key={mod.value}
              id={`mod-${mod.value}`}
              
              type="radio"
              variant={modalidad === mod.value ? "primary" : "outline-primary"}
              name="modalidad"
              value={mod.value}
              checked={modalidad === mod.value}
              onChange={(e) => setModalidad(e.currentTarget.value)}
            >
              {mod.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </InputGroup>   

      <InputGroup className="p-3">
        
        <ButtonGroup>
          {jornadas.map((jor) => (
            <ToggleButton
              key={jor.value}
              id={`jor-${jor.value}`}
              
              type="radio"
              variant={jornada === jor.value ? "primary" : "outline-primary"}
              name="jornada"
              value={jor.value}
              checked={jornada === jor.value}
              onChange={(e) => setJornada(e.currentTarget.value)}
            >
              {jor.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </InputGroup>   

      <hr/>
      <InputGroup className="p-3">
        <Button variant="primary" type="submit">Enviar</Button>
      </InputGroup>
    
    </Form>
  );
}

export default PubForm;
