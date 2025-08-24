import { useAuth } from "../../../hooks/useAuth";
import { SubirFoto } from "./SubirFoto";
import { DatosUsuario } from "./DatosUsuario";
import { SiguientesTurnos } from "./SiguientesTurnos";
import { Container, Card } from 'react-bootstrap';
import Divider from "@mui/material/Divider";

export default function Perfil() {
 const { usuario } = useAuth();

  return (
    <Container className="pb-4">
      <Card className="shadow border-0 rounded-3">
        <Card.Body>
          <div className="text-center mb-5">
            <h3>{usuario.apodo} {usuario.nucleo} {usuario.equipo}</h3>
          </div>
          <SubirFoto onUpload={(url) => setFoto(url)} />
          <Divider sx={{ mb: 2, color: "text.secondary" }}>Siguientes turnos</Divider>
          <SiguientesTurnos />
          <Divider sx={{ mb: 2, color: "text.secondary" }}>Datos de usuario</Divider>
          <DatosUsuario />
          <hr />
        </Card.Body>
      </Card>
    </Container>
  );
}

