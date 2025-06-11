import { 
  ButtonGroup, 
  Button,
} from "react-bootstrap";

export function ToggleGrupoBotones({ opciones, valorActual, onClick }) {
  return (
    <ButtonGroup className="w-100 mb-3 btn-group">
      {opciones.map(({ texto, valor }) => (
        <Button
          key={texto}
          className="w-33"
          variant={valorActual === valor ? "outline-primary" : "outline-secondary"}
          active={valorActual === valor}
          onClick={() => onClick(valorActual === valor ? null : valor)}
        >
          {texto}
        </Button>
      ))}
    </ButtonGroup>
  );
}
