import { TituloH1 } from "../../../components/Titulos";
import {
  Container,
  Card,
  Row,
  Col,
  Image,
  Tab,
  Tabs,
  Alert,
} from 'react-bootstrap';
import { useAuth } from "../../../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useEffect, useState } from 'react';
import { formatearFecha } from "../../../utils/fechas";
import { CATEGORIAS } from "../../../utils/constants";
import { SiguientesTurnos } from "./SiguientesTurnos";


const n = Math.floor(Math.random() * 70) + 1;
// const SiguientesTurnos = ({ nombre }) => {
//   const [fechas, setFechas] = useState([]);

//   useEffect(() => {
//     const cargarTurnos = async () => {
//       try {
//         const docRef = doc(db, 'TURNOS', nombre);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           const hoy = new Date();
//           const resultados = [];

//           for (let i = 0; i <= 7; i++) {
//             const fecha = new Date(hoy);
//             fecha.setDate(hoy.getDate() + i);

//             const yyyy = fecha.getFullYear();
//             const mm = String(fecha.getMonth() + 1).padStart(2, '0');
//             const dd = String(fecha.getDate()).padStart(2, '0');
//             const clave = `${yyyy}-${mm}-${dd}`;

//             const valor = data[clave] ?? 'L';
//             resultados.push([clave, valor]);
//           }

//           setFechas(resultados);
//         }
//       } catch (error) {
//         console.error('Error al recuperar turnos:', error);
//       }
//     };

//     cargarTurnos();
//   }, [nombre]);

//   return (
//     <div className="d-flex justify-content-between flex-grow flex-wrap gap-1">
//       {fechas.map(([fecha, valor], idx) => (
//         <Alert key={idx} variant="light" className="m-1 p-1 w-60px fs-07">
//           <div><strong>{formatearFecha(fecha,"numDia")}</strong></div>
//           <div>{valor}</div>
//         </Alert>
//       ))}
//     </div>
//   );
// };



const ContenidoPerfil = () => {
  const { usuario } = useAuth();

  return (
    <Container className="pb-4">
      <Card className="shadow border-0 rounded-3">
        
        <Card.Body className="p-3">
          <Row className="align-items-center mb-4">
            <Col>
              <Image src={`https://i.pravatar.cc/150?img=${n}`} roundedCircle fluid className="shadow"/>
            </Col>
            <Col>
              <small className="text-muted">
                {usuario.apodo}<br/>
                {usuario.email.length > 8 
                  ? usuario.email.slice(0, 8) + '...'
                  : usuario.email}
                <br />
                {usuario.telefono || "telefono"}<br/>
              </small>              
            </Col>            
            <Col>
              <small className="text-muted">
                {usuario.nucleo} {usuario.equipo}<br/>
                {CATEGORIAS[usuario.categoria]}<br/>
                {usuario.licencia || "licencia"}<br/>
              </small>
            </Col>
          </Row>
          <hr />
          <Tabs defaultActiveKey="servicios" id="user-info-tabs" className="mb-3" fill>
            <Tab eventKey="servicios" title="Turnos">
              <SiguientesTurnos nombre={usuario.nombre} />             
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

export default function Perfil() {
  return (
  <>
    <TituloH1 texto="Perfil"/>
    <ContenidoPerfil />
  </>
  );
}
