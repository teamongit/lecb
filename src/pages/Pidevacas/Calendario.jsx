import { Alert, Container } from "react-bootstrap";
import { useVacaciones } from "../../context/VacacionesContext";
import { formatearFecha } from "../../utils/fechas";

const temporadaEmoji = {
  baja: "❄️ baja",
  media: "🌀 media",
  alta: "☀️ alta"
}
const colorPallete = [
  "",          //0        
  "#e3f2fd", //1 baja  00-15
  "#bbdefb", //2 baja  15-30
  "#64b5f6", //3 baja  30-45
  "#2196f3", //4 baja  45+
  "#e2cfea", //5 media 00-20
  "#c8b1e4", //6 media 20-40
  "#9b72cf", //7 media 40+
  "#fbc4ab", //8 alta  35-
  "#f08080", //9 baja  35+
  
  "#52b788", //10 ya asignado
  "#ee6055", //11 ya rechazado 
  "#80ed99", //12 ya pedido



]; 
const temporadaPuntos = (t, p) => {   
  if (t === "baja") {
    if (p < 15)                 return colorPallete[1];
    else if (p >= 15 && p < 30) return colorPallete[2];
    else if (p >= 30 && p < 45) return colorPallete[3];     
    else                        return colorPallete[4];
  }
  if (t === "media") {
    if (p < 20)                 return colorPallete[5];
    else if (p >= 20 && p < 40) return colorPallete[6];
    else                        return colorPallete[7];
  }
  if (t === "alta") {
    if (p < 35)                 return colorPallete[8];
    else                        return colorPallete[9];
  }
  
  return colorPallete[0];
}

export function Calendario({vacaciones, peticiones, onClickCiclo}) {
  // console.log(vacaciones)


  return (
    <Container className="d-flex justify-content-space-evenly flex-wrap gap-1 m-0 p-0">
      {Object.entries(vacaciones.ciclos)
        .sort()
        .map(([fecha, ciclo]) => {
          
          const tiene1 = ciclo.cupos.some(c => c == 1);
          const tieneM = ciclo.cupos.includes("M");
          const tieneB = ciclo.cupos.includes("B");
          const tieneZ = ciclo.cupos.includes("Z");
          const yaAsignado = ciclo.cupos.some(c => c === "RUIZ PIÑER");
          const yaRechazado = peticiones.some(p => p.fecha === fecha && p.estado === "nodisponible");
         
          const yaPedido = peticiones.some(p => p.fecha === fecha || p.fecha2 === fecha);
          const esMovible = !!vacaciones.movimientos[ciclo.temporada];
          const esClickeable = () => { 
            if (yaPedido) return false;
            if (!tiene1) {              
              if (!tieneM && !tieneZ)   return false; 
              if (tieneM && !esMovible) return false;
              if (tieneZ && !esMovible) return false;
            } 
            return true;
          };   
          
          const borderStyle = tieneM ? "dashed" : "solid"; 
          const borderColor = tieneZ ? "red" : (tieneM || tieneB) ? "black" : "transparent";
          const background = () => {
            if (yaAsignado) return  colorPallete[10];
            if (yaRechazado) return colorPallete[11];
            if (yaPedido) return colorPallete[12];
            return temporadaPuntos(ciclo.temporada, ciclo.puntos);
          } 
           
          const opacity =  yaAsignado ? 1 : esClickeable() ? 1 : 0.5;
          return (
            <Alert 
              key={fecha}                             
              className="m-0"
              role={esClickeable() && !yaAsignado && !yaPedido ? "button" : undefined}
              style={{
                position:"relative",
                width: "113px",                
                borderWidth: "2px",
                borderStyle,
                borderColor,
                background: background(),
                opacity,
              }}
              onClick={() => {
                if (esClickeable() && !yaAsignado && !yaPedido) {
                  onClickCiclo(fecha);
                }
              }}
            >
              <div style={{ position: "absolute", top: 4, right: 8, fontSize: "0.7rem", }}>
                {ciclo.puntos.toFixed(1)}
              </div>
              <div className="fs-07">
                {formatearFecha(fecha, {weekday:"short", day:"2-digit", month:"2-digit"})}
              </div>
              <div className="fs-06 my-3">
                {ciclo.cupos.map((cupo, i) => {
                  if (cupo !== "N") return <div key={i}>{cupo}</div>
                })}
              </div>
              <div className="fs-06 text-muted" style={{position: "absolute", bottom: 4, left: 8}}>
                {temporadaEmoji[ciclo.temporada]}
              </div>
            </Alert>
          );
        })}
    </Container>
  );
}
