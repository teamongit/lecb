import { useState, useRef } from "react";
import { Alert, Button } from "react-bootstrap";
import { CalendarCheck, CalendarPlus, Trash3 } from "react-bootstrap-icons";
import { DndContext, PointerSensor, closestCenter, useSensors, useSensor, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Titulo } from "../../../components/Titulos";
import { Calendario } from "./Calendario";
import { useVacaciones } from "../../../context/VacacionesContext";
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
  const variant = peticion.estado == "asignado" ? "success" : peticion.estado == "pendiente" ? "info" : "danger";

  return (
    <>
      <Titulo texto={peticion.id + ". " + peticion.tipo + " : " + peticion.estado} />
      <Alert ref={setNodeRef} {...attributes} {...listeners} variant={variant} className="d-flex justify-content-between align-items-center px-3 py-2" style={style}>
        <div className="text-start">
          {peticion.fecha}
          {peticion.fecha2 && " + " + peticion.fecha2}
        </div>

        <div className="d-flex gap-3">
          <div className="text-center">
            {peticion.fecha2 ? <CalendarCheck style={{ fontSize: "1.5rem" }} /> : <CalendarPlus style={{ cursor: "pointer", fontSize: "1.5rem" }} onClick={onMarcarMultiple} />}
            <div style={{ fontSize: "0.7rem" }}>doble ciclo</div>
          </div>

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
  return (
    <>
      {peticiones.map((peticion) => (
        <PeticionItem key={peticion.fecha} id={peticion.fecha} peticion={peticion} modoMultiple={modoMultiple} onRemove={onRemove} onMarcarMultiple={() => onMarcarMultiple(peticion.id)} />
      ))}
    </>
  );
}

// -----------------------------
// Hook personalizado: usePeticiones
// -----------------------------
function usePeticiones(nombreSeleccionado = null) {
  const { vacaciones, setVacaciones } = useVacaciones();
  const { usuario } = useAuth();
  const [peticiones, setPeticiones] = useState([]);
  const [peticionEnModoMultiple, setPeticionEnModoMultiple] = useState(null);
  const nextId = useRef(1);

  const onSeleccionarDia = (key, value) => {
    if (peticionEnModoMultiple !== null) {
      setPeticiones((prev) =>
        prev.map((p) =>
          p.id === peticionEnModoMultiple
            ? {
                ...p,
                fecha2: key,
                puntos2: value.puntos,
                tipo: "multiple",
                temporada2: value.temporada,
              }
            : p
        )
      );
      setPeticionEnModoMultiple(null);
      return;
    }

    const nueva = {
      id: nextId.current++,
      fecha: key,
      puntos: value.puntos,
      tipo: "simple",
      estado: "pendiente",
      temporada: value.temporada,
    };
    setPeticiones((prev) => [...prev, nueva]);
  };

  const onEliminarPeticion = (fecha) => {
    setPeticiones((prev) => prev.filter((p) => p.fecha !== fecha));
  };

  const guardarPeticiones = () => {
    if (!nombreSeleccionado) return;

    const nuevosIntegrantes = vacaciones.integrantes.map((i) => (i.nombre === nombreSeleccionado ? { ...i, peticiones } : i));

    setVacaciones((prev) => ({
      ...prev,
      integrantes: nuevosIntegrantes,
    }));
  };
  return {
    peticiones,
    setPeticiones,
    peticionEnModoMultiple,
    setPeticionEnModoMultiple,
    onSeleccionarDia,
    onEliminarPeticion,
    guardarPeticiones,
  };
}

// -----------------------------
// Componente Principal: Peticiones
// -----------------------------
export function Peticiones({vacaciones}) {
  // const { vacaciones } = useVacaciones();
  const { usuario} = useAuth();
  const [nombreSeleccionado, setNombreSeleccionado] = useState(usuario.nombre);

  const [activeId, setActiveId] = useState(null);
  const { peticiones, setPeticiones, peticionEnModoMultiple, setPeticionEnModoMultiple, onSeleccionarDia, onEliminarPeticion, guardarPeticiones } = usePeticiones(nombreSeleccionado);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = peticiones.findIndex((p) => p.fecha === active.id);
    const newIndex = peticiones.findIndex((p) => p.fecha === over.id);

    setPeticiones(arrayMove(peticiones, oldIndex, newIndex));
    setActiveId(null); // Reinicia activeId después de soltar
  };

  const activePeticion = peticiones.find((p) => p.fecha === activeId);

  return (
    <>
      <Titulo texto={"Selecciona los ciclos para tu solicitud"} />

      <div className="mb-3">
        <label className="form-label">Seleccionar participante</label>
        <select className="form-select" value={nombreSeleccionado} onChange={(e) => setNombreSeleccionado(e.target.value)}>
          {vacaciones.integrantes.map((i) => (
            <option key={i.nombre} value={i.nombre}>
              {i.nombre}
            </option>
          ))}
        </select>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={peticiones.map((p) => p.fecha)} strategy={rectSortingStrategy}>
          <PeticionLista peticiones={peticiones} modoMultiple={peticionEnModoMultiple} onRemove={onEliminarPeticion} onMarcarMultiple={setPeticionEnModoMultiple} />
        </SortableContext>

        <DragOverlay>
          {activePeticion ? (
            <Alert variant="primary" className="mx-3">
              {activePeticion.fecha} - {activePeticion.tipo}
            </Alert>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Button onClick={() => guardarPeticiones(nombreSeleccionado)} className="mt-3">
        Guardar peticiones
      </Button>

      <Calendario peticiones={peticiones} onClickCiclo={onSeleccionarDia} />
    </>
  );
}
