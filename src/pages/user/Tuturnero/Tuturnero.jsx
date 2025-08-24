import Calendario from "./Calendario";
import { Titulo } from "../../../components/Titulos";
import { useAuth } from "../../../hooks/useAuth";



export default function TuTurnero() {
  const { usuario } = useAuth();
 
  
  return (
    <>
    <Titulo titulo="TuTurnero"/>
    <Calendario />
    </>
  )
}

