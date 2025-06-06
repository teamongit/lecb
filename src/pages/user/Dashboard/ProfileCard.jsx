
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  ProgressBar,
  Image,
  Tab,
  Tabs,
} from 'react-bootstrap';

import { useAuth } from "../../../hooks/useAuth"


const categorias = {
"CON" : "Controlador",
"INS" : "Instructor",
"SUP" : "Supervisor",
"IS"  : "Inst-Super",
"TIN" : "Técn-Inst",
"TS"  : "Técn-Super",
"INY" : "Instruyendo",
};

const n = Math.floor(Math.random() * 70) + 1;

const ProfileCard = () => {
  const { userData } = useAuth();
  return (
    <Container className="py-4">
      <Card className="shadow border-0 rounded-3">
        
        <Card.Body className="p-4">
          <Row className="align-items-center mb-4">
            <Col>
              <Image src={`https://i.pravatar.cc/150?img=${n}`} roundedCircle fluid className="shadow"/>
            </Col>
            <Col>
              <small className="text-muted">
                {userData.apodo}<br/>
                {userData.email.length > 8 
                  ? userData.email.slice(0, 8) + '...'
                  : userData.email}
                <br />
                {userData.telefono || "telefono"}<br/>
              </small>              
            </Col>            
            <Col>
              <small className="text-muted">
                {userData.nucleo} {userData.lado} {userData.equipo}<br/>
                {categorias[userData.categoria]}<br/>
                {userData.licencia || "licencia"}<br/>
              </small>
            </Col>
          </Row>
          <hr />
          <Tabs defaultActiveKey="servicios" id="user-info-tabs" className="mb-3" fill>
            <Tab eventKey="servicios" title="Serv">
              <h5>Contenido de Servicios (año)</h5>
              <ul>
                <li>Siguientes 8 servicios</li>
                <li>imaginarias activadas vs total</li>
                <li>Servicios jornada larga</li>
                <li>Puntuacion bolsa</li>
              </ul>
              
            </Tab>
            <Tab eventKey="horas" title="Horas">
              <h5>Contenido de Horas</h5>
              <ul>
                <li>Horas ciclo</li>
                <li>Horas mes</li>
                <li>Horas año</li>
                <li>Horas hv</li>
                <li>Horas he</li>
                <li>Cev</li>
                <li>Prognosis</li>
              </ul>
            </Tab>
            <Tab eventKey="noches" title="Noches">
              <h5>Contenido de Noches</h5>
              <ul>
                <li>N realizadas en total</li>
                <li>N realizadas en año</li>
                <li>Tabla numeros noche</li>
              </ul>
            </Tab>
            <Tab eventKey="vacaciones" title="Vacas">
              <h5>Contenido de Vacaciones</h5>
              <ul>
                <li>Ciclos vacaciones este año</li>
                <li>Otros permisos vacaciones / libres</li>
              </ul>
            </Tab>
          </Tabs>
          
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileCard;