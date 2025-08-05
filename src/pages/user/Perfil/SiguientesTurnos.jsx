import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { formatearFecha } from '../../../utils/fechas';
import Table from 'react-bootstrap/Table';
import { TituloSmall } from '../../../components/Titulos';

export const SiguientesTurnos = ({ nombre }) => {
  const [fechas, setFechas] = useState([]);
  const [textoMes, setTextoMes] = useState("");

  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        const docRef = doc(db, 'TURNOS', nombre);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const hoy = new Date();
          const resultados = [];

          for (let i = 0; i <= 7; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);

            const yyyy = fecha.getFullYear();
            const mm = String(fecha.getMonth() + 1).padStart(2, '0');
            const dd = String(fecha.getDate()).padStart(2, '0');
            const clave = `${yyyy}-${mm}-${dd}`;

            const valor = data[clave] ?? 'L';
            resultados.push([clave, valor]);
          }

          setFechas(resultados);
          console.log(resultados[0][0])
          console.log(formatearFecha(resultados[0][0],4))
          const resultadoTextoMes = formatearFecha(resultados[0][0], 2) === formatearFecha(resultados[7][0], 2)
            ? formatearFecha(resultados[0][0], 4)
            : `${formatearFecha(resultados[0][0], 4)} / ${formatearFecha(resultados[7][0], 4)}`;
          setTextoMes(resultadoTextoMes);
  
        }
      } catch (error) {
        console.error('Error al recuperar turnos:', error);
      }
    };

    cargarTurnos();
  }, [nombre]);
  const anchoColumna = 100 / fechas.length + '%';
 
  return (

    <>
    <TituloSmall texto={textoMes} />
    <Table striped bordered className='fs-07'>      
      <thead>
        <tr>
          {fechas.map(([fecha], idx) => (
            <td key={idx} className="text-muted" style={{ width: anchoColumna, minWidth: '30px', textAlign: 'center' }}>
              {formatearFecha(fecha, 1)}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {fechas.map(([_, valor], idx) => (
            <td key={idx} style={{ width: anchoColumna, minWidth: '30px', textAlign: 'center' }}>
              {valor}
            </td>
          ))}
        </tr>
      </tbody>
    </Table>
    </>
  );
}