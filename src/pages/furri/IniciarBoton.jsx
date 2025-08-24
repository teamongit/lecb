import { Button } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; 
import { useVacaciones } from "../../context/VacacionesContext";

/*TODO:
  guardar bien el orden inicial del array de integrantes por puntos de inicio
*/
// export function IniciarBoton({ secciones }) {
export function IniciarBoton() {
  const {
    
    integrantes, 
    cantidades, 
    proximosCiclos, 
    normas, 
    
  } = useVacaciones();
  
const handleClick = async () => {
const ordenadosPorPuntos = [...integrantes].sort((a, b) => a.puntos[7] - b.puntos[7]);

const nuevosIntegrantes = ordenadosPorPuntos.map(integrante => {
  const nombre = integrante.nombre;
  const posicionOrden = ordenadosPorPuntos.findIndex(i => i.nombre === nombre);

  const integranteCantidad = cantidades.find(c => c.nombre === nombre) || {};

  return {
    apodo: integrante.apodo,
    nombre: integrante.nombre,
    cantidad_invierno: integranteCantidad.cantidad_invierno,
    cantidad_verano: integranteCantidad.cantidad_verano,
    orden: [posicionOrden, 0, 0, 0, 0, 0, 0, 0],
    puntos: [integrante.puntos[7] ?? 0, 0, 0, 0, 0, 0, 0, 0],
    renuncias: 0
  };
});


  const nuevasVacaciones = {
    ciclos: proximosCiclos,
    estado: "Activo",
    integrantes: nuevosIntegrantes,
    normas,
    ronda: 1,
    siguiente: 1,
  }

  // console.log(nuevasVacaciones);
  try {
    const docRef = doc(db, "VACACIONES", "2026_LECB_RUTA_3_E");
    await setDoc(docRef, nuevasVacaciones);

  } 
  catch(err) {
    console.log(err);
  }
}

  return (
    <div className="text-center">
      <Button 
        variant="primary" 
        size="lg" 
        className="my-5"
        // disabled={!["integrantes", "disfrutadas", "calendario", "normas"].every(s => secciones.includes(s))}
        onClick={handleClick}
        
      >
        Iniciar PideVacas
      </Button>
    </div>
  );
}
