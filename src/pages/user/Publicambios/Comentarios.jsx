import { Form } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { TituloSmall } from "../../../components/Titulos";

export function Comentarios({ pub, setCampo, desplegarComentarios, setDesplegarComentarios }) {
  return (
    <>
      <TituloSmall
        texto={
          <div
            onClick={() => setDesplegarComentarios(!desplegarComentarios)}
            style={{ cursor: "pointer" }}
            className="d-flex align-items-center justify-content-center gap-2 mb-2"
          >
            {pub.tipo === "otro"
              ? "Comentarios"
              : <>Comentarios {desplegarComentarios ? <ChevronUp /> : <ChevronDown />}</>}
          </div>
        }
      />

      <Form.Group controlId="comentariosDesplegables">
        {desplegarComentarios && (
          <Form.Control
            as="textarea"
            rows={2}
            className="form-control-sm small"
            placeholder={pub.tipo === "otro" ? "obligatorio: aclarar tipo de servicio" : "opcional"}
            required={pub.tipo === ""}
            value={pub.comentarios}
            onChange={(e) => setCampo("comentarios", e.target.value)}
          />
        )}
      </Form.Group>
    </>
  );
}
