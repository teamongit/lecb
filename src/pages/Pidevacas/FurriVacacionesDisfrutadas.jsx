import React from "react";
import { Badge, Card, Col, Form, Row } from "react-bootstrap";
import { formatearFecha } from "@/utils/fechas"; 
import { useState } from "react";
import { useVacaciones } from "@/context/VacacionesContext";

// Subcomponente: Badge editable de puntos
function PuntosBadge({ integrante, i, integrantes, setIntegrantes }) {
  const [editando, setEditando] = useState(false);
  const [valorEditado, setValorEditado] = useState("");

  const totalPuntos = integrante.puntos[6].fin;

  const guardarValorEditado = () => {
    const nuevoValor = parseFloat(valorEditado);
    if (!isNaN(nuevoValor)) {
      integrante.puntos[6].fin = nuevoValor;
    }    
    setEditando(false);
  };

  if (editando) {
    return (
      <Form.Control
        type="number"
        size="sm"
        autoFocus
        step="0.1"
        style={{ width: "80px" }}
        value={valorEditado}
        onChange={(e) => setValorEditado(e.target.value)}
        onBlur={guardarValorEditado}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            guardarValorEditado();
          } else if (e.key === "Escape") {
            setEditando(false);
          }
        }}
      />
    );
  }

  return (
    <Badge role="button" onClick={() => {
      setEditando(true);
      setValorEditado(totalPuntos);
    }}>
      {totalPuntos}
    </Badge>
  );
}

// Subcomponente: Selector de fechas por ronda
function RondaSelector({ peticion, n, ciclos, onFechaChange }) {
  const fecha = peticion?.fecha || "";

  return (
    <div className="text-center">
      <Form.Select
        className="border-0 p-0 m-0 bg-transparent text-center fs-08"
        style={{ backgroundImage: "none", appearance: "none" }}
        value={fecha}
        onChange={(e) => onFechaChange(n, e.target.value)}
      >
        {Object.entries(ciclos)
          .sort()
          .map(([key]) => (
            <option key={key} value={key}>
              {formatearFecha(key, {day:"numeric", month:"short"})}
            </option>
          ))}
      </Form.Select>
      <span className="text-muted fs-07">
        {ciclos[fecha]?.puntos ?? 0}
      </span>
    </div>
  );
}

// Componente principal de tarjeta por integrante
const IntegranteCard = React.memo(function IntegranteCard({ integrante, i, ciclos, integrantes, setIntegrantes }) {
  
  return (
    <Card className="mb-3 p-2 fs-06">
      <Row>
        <Col>
          <h5>{integrante.apodo}</h5>
        </Col>
        <Col xs="auto">
          <PuntosBadge
            integrante={integrante}
            i={i}
            integrantes={integrantes}
            setIntegrantes={setIntegrantes}
          />
        </Col>
      </Row>
      <Row>
        {[1, 2, 3, 4, 5, 6].map(n => {
          
          return (
          <Col key={n} className="p-0">
            <div>{formatearFecha(integrante.peticiones.find(p => p.ronda === n).fecha, {day:"numeric", month:"numeric"})}</div>
            <div>{integrante.puntos[n].parcial}</div>
          </Col>
          );
        })}
      </Row>
    </Card>
  );
}, areEqualIntegrante);

// Comparación personalizada: evita rerender si no cambió el integrante
function areEqualIntegrante(prevProps, nextProps) {
  return JSON.stringify(prevProps.integrante) === JSON.stringify(nextProps.integrante);
}
function areEqualDisfrutadas(prevProps, nextProps) {
  return (
    JSON.stringify(prevProps.integrantes) === JSON.stringify(nextProps.integrantes) &&
    JSON.stringify(prevProps.ciclos) === JSON.stringify(nextProps.ciclos)
  );
}
// export function Disfrutadas({ integrantes, setIntegrantes, ciclos }) {
export const FurriVacacionesDisfrutadas = React.memo(function Disfrutadas() {
  const { vacaciones, integrantes, setIntegrantes, ciclos } = useVacaciones();
  
  return (
    <Card className="mt-5">
      <Card.Header>
        <h2>Vacaciones disfrutadas</h2>
      </Card.Header>
      <Card.Body>
        {integrantes.map((integrante, i) => (
          <IntegranteCard
            key={i}
            integrante={integrante}
            i={i}
            ciclos={ciclos}
            integrantes={integrantes}
            setIntegrantes={setIntegrantes}
          />
        ))}
      </Card.Body>
    </Card>
  );
}, areEqualDisfrutadas);
