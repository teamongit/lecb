import { Alert, Container, Row, Col } from "react-bootstrap";
import { useVacaciones } from "../../../context/VacacionesContext";

export function Orden({vacaciones}) {
  // const { vacaciones } = useVacaciones();
    
    return (
    <Container>
      <Row>
        {vacaciones.integrantes.map((integrante, i) => {
          const variant = vacaciones.siguiente == i+1
            ? "info"
            : vacaciones.siguiente > i+1
              ? "success"
              : integrante.peticiones?.some(p => p.estado == "pendiente")
                ? "warning" 
                : "light"
          ;      
          return (
          <Col key={integrante.apodo} xs={4}>
            <Alert variant={variant} className="wh-120px text-08">
              {i+1}
              <br />
              <strong>{integrante.apodo}</strong>
              <br />
              {integrante.puntos[vacaciones.ronda]}
            </Alert>
          </Col>
        )})}
      </Row>
    </Container>
  );
}

