import { Alert } from "react-bootstrap";
import { CalendarCheck, CalendarMinus, CalendarPlus, Trash3 } from "react-bootstrap-icons";
import { formatearFecha } from "../../utils/fechas";
import Divider from "@mui/material/Divider";
import React from "react";

export function Peticiones({
  peticiones,
  onEliminar,
  onMarcarMultiple,
  onRevertirMultiple,
  peticionEnEspera,
  onReordenar, // ← Nueva prop: función para actualizar el orden
}) {
  // Separar peticiones por estado
  const asignadas = peticiones.filter(p => p.estado === "asignado");
  const noDisponibles = peticiones.filter(p => p.estado === "nodisponible");
  const pedidas = peticiones.filter(p => p.estado === "pedido");

  // Aplicamos orden de preferencia solo a las "pedido", que el usuario puede reordenar
  const todasOrdenadas = [
    ...asignadas,
    ...noDisponibles,
    ...pedidas
  ];

  const handleDragStart = (e, index) => {
    // Índice dentro del array de peticiones "pedido"
    const pedidoIndex = peticiones.findIndex(p => p.fecha === pedidas[index].fecha);
    e.dataTransfer.setData("text/plain", pedidoIndex); // guardamos el índice global
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // necesario para permitir drop
  };

  const handleDrop = (e, destinoIndex) => {
    e.preventDefault();
    const origenIndexGlobal = Number(e.dataTransfer.getData("text/plain"));
    const destinoIndexGlobal = peticiones.findIndex(p => p.fecha === pedidas[destinoIndex].fecha);

    if (origenIndexGlobal === destinoIndexGlobal) return;

    // Reordenar el array completo de peticiones
    const nuevasPeticiones = [...peticiones];
    const [moved] = nuevasPeticiones.splice(origenIndexGlobal, 1);
    nuevasPeticiones.splice(destinoIndexGlobal, 0, moved);

    onReordenar(nuevasPeticiones);
  };

  return (
    <>
      {todasOrdenadas.map((peticion, idx) => {
        const isPedido = peticion.estado === "pedido";
        const pedidoIndex = isPedido ? pedidas.findIndex(p => p.fecha === peticion.fecha) : -1;

        return (
          <React.Fragment key={peticion.fecha}>
          {isPedido &&
          <Divider sx={{fontSize:"0.7em", color:"grey"}}>Preferencia {pedidoIndex+1}</Divider>
          }
          <Alert
            key={peticion.fecha}
            variant={
              peticion.estado === "asignado"
                ? "success"
                : peticion.estado === "pedido"
                ? "info"
                : "danger"
            }
            className="d-flex justify-content-between align-items-center px-3 py-2"
            style={{
              borderWidth: "2px",
              borderStyle: peticionEnEspera === peticion.fecha ? "dashed" : "solid",
              borderColor: peticionEnEspera === peticion.fecha ? "#0d6efd" : undefined,
              borderRadius: "8px",
              cursor: isPedido ? "move" : "default",
            }}
            draggable={isPedido}
            onDragStart={isPedido ? (e) => handleDragStart(e, pedidoIndex) : undefined}
            onDragOver={isPedido ? handleDragOver : undefined}
            onDrop={isPedido ? (e) => handleDrop(e, pedidoIndex) : undefined}
          >
            <div className="text-start d-flex flex-column">
              {peticionEnEspera === peticion.fecha && (
                <div style={{ fontSize: "0.7rem", color: "#0d6efd", marginTop: "4px" }}>
                  ⏳ Elige un segundo ciclo
                </div>
              )}

              <div>
                {formatearFecha(peticion.fecha, { day: "numeric", month: "numeric" })}
                {peticion.fecha2 && " + " + formatearFecha(peticion.fecha2, { day: "numeric", month: "numeric" })}
              </div>
              <div className="fs-06">{peticion.estado}</div>
            </div>

            <div className="d-flex gap-3">
              {peticion.estado === "pedido" && (
                <div className="text-center">
                  {peticion.fecha2 ? (
                    <CalendarMinus
                      style={{ cursor: "pointer", fontSize: "1.5rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRevertirMultiple(peticion.fecha);
                      }}
                    />
                  ) : (
                    <CalendarPlus
                      style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",                        
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarcarMultiple(peticion.fecha);
                      }}
                    />
                  )}
                  <div style={{ fontSize: "0.7rem" }}>
                    {peticion.fecha2 ? "quitar" : "añadir"}
                  </div>
                </div>
              )}
              {peticion.estado !== "asignado" && (
                <div className="text-center">
                  <Trash3
                    className="text-danger"
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEliminar(peticion.fecha);
                    }}
                  />
                  <div style={{ fontSize: "0.7rem" }}>borrar</div>
                </div>
              )}
            </div>
          </Alert>
          </React.Fragment>
        );
      })}
    </>
  );
}