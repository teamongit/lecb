// components/PubDetails.jsx
import { useAuth } from "../../../hooks/useAuth";
import { usePublicaciones } from "../../../hooks/usePublicaciones";
import { useTurnos } from "../../../hooks/useTurnos";
import { formatearFecha } from "../../../utils/fechas";
import { PubCandidato } from "./PubCandidato";

export const PubDetalles = ({ pub, onToggleAsignado }) => {
  const { usuario } = useAuth();
  const { intercambiarTurnos } = useTurnos();
  const { editarPublicacion } = usePublicaciones();
  const handleAprobado = () => {
    const fecha = formatearFecha(pub.fecha, "aaaa-mm-dd");
    const candidato = pub.candidatos.find(c => c.asignado);
    if (!candidato) return;
    // const candidatoTurno = elegir de un input radio
    intercambiarTurnos(fecha, usuario.nombre, pub.quitarTurno || "L", candidato.nombre, candidato.turno);
    editarPublicacion(pub.id, { estado : "aprobado" });
  };
  
  return (
    <div className="mx-3 mb-2">
      {pub.comentarios && (
        <small className="text-muted d-block m-2">{pub.comentarios}</small>
      )}
      {(pub.candidatos || []).map((candidato) => (
        <PubCandidato
          key={candidato.nombre}
          candidato={candidato}
          onToggleAsignado={onToggleAsignado}
          handleAprobado={handleAprobado}
        />
      ))}
    </div>
  );
}