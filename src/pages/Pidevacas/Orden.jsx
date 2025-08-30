import { Alert, Container, Row, Col } from "react-bootstrap";
import { useVacaciones } from "../../context/VacacionesContext";

export function Orden({vacaciones}) {
  // const { vacaciones } = useVacaciones();
    
    return (
    <Container className="m-0 p-0">
      <Row >
        {vacaciones.integrantes.map((integrante, i) => {
          const variant = i+1 == vacaciones.siguiente
            ? "info"
            : i+1 < vacaciones.siguiente
              ? "success"
              : integrante.peticiones?.some(p => p.estado == "pendiente")
                ? "warning" 
                : "light"
          ;      
          return (
          <Col key={integrante.apodo} xs={4}>
            <Alert variant={variant} className="mx-0 px-0 fs-08" style={{width:"100px", height:"100px"}}>
              {i+1}
              <br />
              <strong>{integrante.apodo}</strong>
              <br />
              {integrante.puntos[vacaciones.ronda].inicio.toFixed(1)}
            </Alert>
          </Col>
        )})}
      </Row>
    </Container>
  );
}

