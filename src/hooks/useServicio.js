import { useEffect } from "react";
import { formatearServicio } from "../utils/formatearServicio";

export function useServicio(pub, setCampo, userLado) {
  useEffect(() => {
    const nuevoServicio = formatearServicio(pub.jornada, pub.tipo, pub.funcion, userLado);
    setCampo("servicio", nuevoServicio);
  }, [pub.jornada, pub.tipo, pub.funcion]);
}
