import { useState, useEffect, useRef } from "react";
import { Alert, Button } from "react-bootstrap";
import { CalendarCheck, CalendarPlus, Trash3 } from "react-bootstrap-icons";
import { DndContext, PointerSensor, closestCenter, useSensors, useSensor, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


import { Calendario } from "../src/pages/PideVacas/Calendario";

import { useAuth } from "../../../context/AuthProvider";

// -----------------------------
// Componente: PeticionItem
// -----------------------------
function PeticionItem({ id, peticion, modoMultiple, onRemove, onMarcarMultiple }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "move",
    touchAction: "none",
    border: modoMultiple === peticion.id ? "3px dashed #0d6efd" : undefined,
  };
  const variant = peticion.estado === "asignado" ? "success" : peticion.estado === "pedido" ? "info" : "danger";

return (
  <>
    
    <Alert
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      variant={variant}
      className="d-flex justify-content-between align-items-center px-3 py-2"
      style={style}
    >
      <div className="text-start d-flex flex-column">
        <div>
          {peticion.fecha}
          {peticion.fecha2 && " + " + peticion.fecha2}
        </div>
        <div className="fs-06">({peticion.estado})</div>
      </div>

      <div className="d-flex gap-3">
        {peticion.estado === "pedido" && (
          <div className="text-center">
            {peticion.fecha2 ? (
              <CalendarCheck style={{ fontSize: "1.5rem" }} />
            ) : (
              <CalendarPlus
                style={{ cursor: "pointer", fontSize: "1.5rem" }}
                onClick={() => onMarcarMultiple(peticion.id)}
              />
            )}
            <div style={{ fontSize: "0.7rem" }}>doble ciclo</div>
          </div>
        )}

        <div className="text-center">
          <Trash3
            className="text-danger"
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
          />
          <div style={{ fontSize: "0.7rem" }}>eliminar</div>
        </div>
      </div>
    </Alert>
  </>
);
}

// -----------------------------
// Componente: PeticionLista
// -----------------------------
function PeticionLista({ peticiones, modoMultiple, onRemove, onMarcarMultiple }) {
  return peticiones.map((peticion) => (
    <PeticionItem
      key={peticion.fecha}
      id={peticion.fecha}
      peticion={peticion}
      modoMultiple={modoMultiple}
      onRemove={onRemove}
      onMarcarMultiple={onMarcarMultiple}
      // onMarcarMultiple={() => onMarcarMultiple(peticion.id)}
    />
  ));
}

// -----------------------------
// Hook personalizado: usePeticiones
// -----------------------------
function usePeticiones(vacaciones) {
  const [peticiones, setPeticiones] = useState([]);
  const [peticionEnModoMultiple, setPeticionEnModoMultiple] = useState(null);
  const nextIdRef = useRef(1);


  useEffect(() => {
    if (!vacaciones) return;

    const integrante = vacaciones.integrantes.find((i) => i.apodo === "RUIZ PIÑER");
    const peticionesActuales = integrante?.peticiones || [];

    setPeticiones(peticionesActuales);

    // Recalcula el próximo ID
    const maxId = peticionesActuales.length > 0 ? Math.max(...peticionesActuales.map((p) => p.id)) : 0;
    nextIdRef.current = maxId + 1;
  }, [vacaciones]);

  const onSeleccionarDia = (key) => {
    // Evitar duplicados
    if (peticiones.some((p) => p.fecha === key || p.fecha2 === key)) {
      alert("Este ciclo ya está seleccionado.");
      return;
    }

    if (peticionEnModoMultiple !== null) {
      setPeticiones((prev) =>
        prev.map((p) =>
          p.id === peticionEnModoMultiple
            ? {
                ...p,
                fecha2: key,
                tipo: "doble",
              }
            : p
        )
      );
      setPeticionEnModoMultiple(null);
      return;
    }

    const nueva = {
      id: nextIdRef.current++,
      fecha: key,
      tipo: "simple",
      estado: "pedido",
    };
    setPeticiones((prev) => [...prev, nueva]);
  };

  const onEliminarPeticion = (id) => {
    setPeticiones((prev) => prev.filter((p) => p.id !== id));
  };



  return {
    peticiones,
    setPeticiones,
    peticionEnModoMultiple,
    setPeticionEnModoMultiple,
    onSeleccionarDia,
    onEliminarPeticion,

  };
}

// -----------------------------
// Componente Principal: Peticiones
// -----------------------------
export function Peticiones({ vacaciones }) {
  const [activeId, setActiveId] = useState(null);

  const {
    peticiones,
    setPeticiones,
    peticionEnModoMultiple,
    setPeticionEnModoMultiple,
    onSeleccionarDia,
    onEliminarPeticion,
    guardarPeticiones,
  } = usePeticiones(vacaciones);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = peticiones.findIndex((p) => p.id === active.id);
    const newIndex = peticiones.findIndex((p) => p.id === over.id);

    setPeticiones(arrayMove(peticiones, oldIndex, newIndex));
    setActiveId(null);
  };

  const activePeticion = peticiones.find((p) => p.id === activeId);

  return (
    <> 
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={peticiones.map((p) => p.id)} strategy={rectSortingStrategy}>
          <PeticionLista
            peticiones={peticiones}
            modoMultiple={peticionEnModoMultiple}
            onRemove={onEliminarPeticion}
            onMarcarMultiple={setPeticionEnModoMultiple}
          />
        </SortableContext>

        <DragOverlay>
          {activePeticion 
            ? <Alert>{activePeticion.fecha} - {activePeticion.tipo}</Alert>
            : null
          }
        </DragOverlay>
      </DndContext>

      <Calendario vacaciones={vacaciones} peticiones={peticiones} onClickCiclo={onSeleccionarDia} />
    </>
  );
}