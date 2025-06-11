import { useState } from "react";
import { Button } from "react-bootstrap";
import { usePublicaciones } from "../../../hooks/usePublicaciones";

function BotonEnviar({ pub, onSuccess }) {

  const { agregarPublicacion } = usePublicaciones();
  
  const [boton, setBoton] = useState({ texto: "Enviar", clase: "primary" });
  const [bloqueado, setBloqueado] = useState(false);

  const handleEnviar = async () => {
    if (bloqueado) return;

    setBoton({ texto: "Enviando...", clase: "info" });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBloqueado(true);
    

    try {
      const resp = await agregarPublicacion(pub);
      if (resp && resp.id) {
        setBoton({ texto: "Enviado", clase:"success" });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onSuccess(resp);
      }
        
      else if (resp == "duplicado") {
        setBoton({ texto: "Duplicado", clase:"danger" });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
    } catch (err) {
      setBoton({ texto: "Error al publicar", clase: "danger" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.error(err);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBoton({ texto: "Enviar", clase: "primary" });
      setBloqueado(false);
    }
  };

  const botonDeshabilitado =
    bloqueado ||
    !(pub.lista && pub.fecha && pub.jornada) ||
    (pub.tipo === "otro" && !pub.comentarios.length);

  return (
    <Button
      className={`my-3 w-100 btn-${boton.clase}`}
      disabled={botonDeshabilitado}
      onClick={handleEnviar}
    >
      {boton.texto}
    </Button>
  );
}

export default BotonEnviar;
