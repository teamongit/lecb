import { useState } from "react";
import { Container, ButtonGroup, Button, Form } from "react-bootstrap";
import { BookmarkPlusFill, BookmarkPlus, BookmarkDashFill, BookmarkDash, Bookmarks } from "react-bootstrap-icons";

export default function PublicarForm() {
  const [fecha, setFecha] = useState("");
  const [modalidad, setModalidad] = useState(null);
  const [jornada, setJornada] = useState(null);
  const [tipoServicio, setTipoServicio] = useState(null);

  return (
    <Container className="w-75 p-3">
      <div className="d-flex justify-content-between mb-3">
        <div className={`text-center ${modalidad === "HV" ? "text-primary" : "text-secondary"}`} role="button" onClick={() => setModalidad("HV")}>
          {modalidad === "HV" ? <BookmarkPlusFill size="68" /> : <BookmarkPlus size="68" />}
          <div>HV</div>
        </div>
        <div className={`text-center ${modalidad === "P6" ? "text-primary" : "text-secondary"}`} role="button" onClick={() => setModalidad("P6")}>
          {modalidad === "P6" ? <BookmarkDashFill size="68" /> : <BookmarkDash size="68" />}
          <div>P6</div>
        </div>
        <div className="text-center text-secondary text-decoration-line-through" role="button" onClick={() => setModalidad("")}>
          <Bookmarks size="68" />
          <div>Cambio</div>
        </div>
      </div>

      <Form.Control className="mb-3 btn-group" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <ButtonGroup className="w-100 mb-3">
        {["M", "T", "N"].map((letra) => (
          <Button key={letra} variant={jornada === letra ? "outline-primary" : "outline-secondary"} active={jornada === letra} onClick={() => setJornada(letra)}>
            {letra}
          </Button>
        ))}
      </ButtonGroup>
      
      <ButtonGroup className="w-100 mb-3 btn-group">
        {["SUP", "INS", "IMG"].map((t) => (
          <Button
            key={t}
            variant={tipoServicio === t ? "outline-primary" : "outline-secondary"}
            active={tipoServicio === t}  
            onClick={() => setTipoServicio(tipoServicio === t ? null : t)}
          >
            {t}
          </Button>
        ))}
      </ButtonGroup>
      <Form.Group controlId="exampleForm.ControlTextarea">
        <Form.Label>Comentarios</Form.Label>
        <Form.Control as="textarea" rows={3} placeholder="...opcional" />
      </Form.Group>

      <Button className="mt-3 w-100" disabled={!(modalidad && fecha && jornada)}>Enviar</Button>
    </Container>
  );
}
