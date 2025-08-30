import React from "react";
import { Badge, Card, Col, Form, Row } from "react-bootstrap";
import { formatearFecha } from "../../utils/formatearFecha";
import { useState } from "react";

// Subcomponente: Badge editable de puntos
function PuntosBadge({ integrante, idx, integrantes, setIntegrantes }) {
  const [editando, setEditando] = useState(false);
  const [valorEditado, setValorEditado] = useState("");

  const totalPuntos = integrante.peticiones
    .filter(p => p.ronda >= 1 && p.ronda <= 6)
    .reduce((acc, p) => acc + (p.puntos ?? 0), 0)
    .toFixed(1);

  const guardarValorEditado = () => {
    const nuevoValor = parseFloat(valorEditado);
    if (!isNaN(nuevoValor)) {
      const nuevos = structuredClone(integrantes);
      const puntosOriginales = nuevos[idx].peticiones
        .filter(p => p.ronda >= 1 && p.ronda <= 6)
        .reduce((acc, p) => acc + (p.puntos ?? 0), 0);

      const diferencia = nuevoValor - puntosOriginales;
      const peticion1 = nuevos[idx].peticiones.find(p => p.ronda === 1);
      peticion1.puntos = (peticion1.puntos ?? 0) + diferencia;

      nuevos[idx].puntos = [0];
      for (let i = 1; i <= 6; i++) {
        const pet = nuevos[idx].peticiones.find(p => p.ronda === i);
        nuevos[idx].puntos[i] = pet?.puntos ?? 0;
      }

      setIntegrantes(nuevos);
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
        className="border-0 p-0 m-0 bg-transparent text-center text-08"
        style={{ backgroundImage: "none", appearance: "none" }}
        value={fecha}
        onChange={(e) => onFechaChange(n, e.target.value)}
      >
        {Object.entries(ciclos)
          .sort()
          .map(([key]) => (
            <option key={key} value={key}>
              {formatearFecha(key, "dd_mes_corto")}
            </option>
          ))}
      </Form.Select>
      <span className="text-muted text-07">
        {ciclos[fecha]?.puntos ?? 0}
      </span>
    </div>
  );
}

// Componente principal de tarjeta por integrante
const IntegranteCard = React.memo(function IntegranteCard({ integrante, idx, ciclos, integrantes, setIntegrantes }) {
  const handleFechaChange = (n, nuevaFecha) => {
    const nuevos = structuredClone(integrantes);
    const peticion = nuevos[idx].peticiones.find(p => p.ronda === n);
    peticion.fecha = nuevaFecha;
    peticion.puntos = ciclos[nuevaFecha].puntos;

    nuevos[idx].puntos = [0];
    for (let i = 1; i <= 6; i++) {
      const pet = nuevos[idx].peticiones.find(p => p.ronda === i);
      nuevos[idx].puntos[i] = pet?.puntos ?? 0;
    }

    setIntegrantes(nuevos);
  };
  console.log("IntegranteCard", idx);
  return (
    <Card className="mb-3 p-2">
      <Row>
        <Col>
          <h5>{integrante.apodo}</h5>
        </Col>
        <Col xs="auto">
          <PuntosBadge
            integrante={integrante}
            idx={idx}
            integrantes={integrantes}
            setIntegrantes={setIntegrantes}
          />
        </Col>
      </Row>
      <Row>
        {[1, 2, 3, 4, 5, 6].map(n => {
          const peticion = integrante.peticiones.find(p => p.ronda === n);
          return (
          <Col key={n} className="p-0">
            <RondaSelector
              key={n}
              peticion={peticion}
              n={n}
              ciclos={ciclos}
              onFechaChange={handleFechaChange}
            />
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
export const Disfrutadas = React.memo(function Disfrutadas({ integrantes, setIntegrantes, ciclos }) {
  console.log("Disfrutadas");
  return (
    <Card className="mt-5">
      <Card.Header>
        <h2>Vacaciones disfrutadas</h2>
      </Card.Header>
      <Card.Body>
        {integrantes.map((integrante, idx) => (
          <IntegranteCard
            key={idx}
            integrante={integrante}
            idx={idx}
            ciclos={ciclos}
            integrantes={integrantes}
            setIntegrantes={setIntegrantes}
          />
        ))}
      </Card.Body>
    </Card>
  );
}, areEqualDisfrutadas);
