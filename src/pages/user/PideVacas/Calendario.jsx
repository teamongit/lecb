import { Alert, Container } from "react-bootstrap";
import { useVacaciones } from "../../../context/VacacionesContext";
import { formatearFecha } from "../../../utils/fechas";

const temporadaEmoji = {
  baja: "❄️ baja",
  alta: "☀️ alta"
}

const temporadaPuntos = (t, p) => {
  let bgcolor = "#c9daf8";

  if (t === "baja") {
    if (p < 20) bgcolor = "#cfe2f3";
    else if (p >= 20 && p < 30) bgcolor = "#6d9eeb";
    else bgcolor = "#c27ba0";
  }
  if (t === "alta") {
    if (p < 35) bgcolor = "#f9cb9c";
    else bgcolor = "#e06666";
  }
  
  return bgcolor;
}

export function Calendario({vacaciones, peticiones, onClickCiclo}) {
  // const { ciclos } = useVacaciones();

  return (
    <Container className="d-flex justify-content-center flex-wrap gap-3 p-0">
      {Object.entries(vacaciones.ciclos)
        .sort()
        .map(([key, value]) => {
          const tiene1 = value.cupos.some(c => c == 1);
          const tieneM = value.cupos.includes("M");
          const tieneB = value.cupos.includes("B");
          const tieneZ = value.cupos.includes("Z");
          // const variant = peticiones.some(p => p.fecha == key || p.fecha2 == key) ? "success" : "primary";
          return (
            <Alert 
              key={key} 
              // variant={variant} 
              className="my-1"
              style={{
                width: "130px",
                position: "relative",
                borderWidth: "3px",
                borderStyle: tieneM
                  ? "dashed"
                  : "solid",
                borderColor: tieneZ
                  ? "red"
                  : tieneM || tieneB
                    ? "black"
                    : "transparent",
                background: temporadaPuntos(value.temporada, value.puntos),
                opacity: tiene1 ? 1 : 0.5,
              }}
              // onClick={() => {
              //   if (variant !== "success") {
              //     onClickCiclo(key, value);
              //   }
              // }}
            >
              <div
                
                style={{ position: "absolute", top: 4, right: 8, fontSize: "0.7rem", }}
              >
                {value.puntos.toFixed(1)}
              </div>

              <span className="fs-08">{formatearFecha(key,{day:"numeric", weekday:"short", month:"short"})}</span>
              <br />
              <div>
                {value.cupos
                  .filter((cupo) => cupo !== "N") 
                  .map((cupo, i) => (
                    <div key={i}>{cupo}</div>
                  ))}
              </div>
              <div 
                className="text-07 text-muted"
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: 8,
                  fontSize: "0.7rem",
                }}
              >
                {temporadaEmoji[value.temporada]}
              </div>
            </Alert>
          );
        })}
    </Container>
  );
}
