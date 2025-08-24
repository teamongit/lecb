// import { functions } from "../../../firebaseConfig";
// import { httpsCallable } from "firebase/functions";

// import { useVacaciones } from "../../../context/VacacionesContext";

export default function BotonLlamarFuncion() {
  // const { vacaciones } = useVacaciones();
  // console.log(vacaciones);
  // const handleClick = async () => {
  //   const myFunction = httpsCallable(functions, "avanzarPidevacas");

  //   try {
  //     const res = await myFunction({ vacaciones });
  //     const resultado = res.data;

  //     if (resultado.success) {
  //       console.log("✔️ Éxito:", resultado);
        
  //     } else {
  //       console.warn("⚠️ Falló la operación:", resultado.error);
       
  //     }
  //   } catch (err) {
  //     console.error("❌ Error al llamar a la función:", err.message);
      
  //   }
  // };

  // return <button onClick={handleClick}>avanzar Pidevacas</button>;
  return <button>avanzar Pidevacas</button>;
}
