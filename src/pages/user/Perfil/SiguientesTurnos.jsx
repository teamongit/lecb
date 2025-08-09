import { useMemo } from 'react';
import { formatearFecha } from '../../../utils/fechas';
import Table from 'react-bootstrap/Table';
import { Titulo } from '../../../components/Titulos';
import { useTurnos } from '../../../hooks/useTurnos';
import LoadingSpinner from '../../../components/LoadingSpinner';

// const horasMes = Object.entries(turnos).reduce((total, [clave, valor]) => {
//   if (formatearFecha(clave, {month: "numeric"}) == 8) {
//     const horas = TURNOS[valor]?.horas || 0;
//     return total + horas;
//   }
//   return total;
// }, 0);
export const SiguientesTurnos = () => {
  const { turnos, loading } = useTurnos();

  if (loading || !turnos) return <LoadingSpinner />;

  const { turnos8dias, textoMes } = useMemo(() => {
    

    
    const hoy = new Date();
    const ultimo = new Date();
    ultimo.setDate(hoy.getDate() + 7);

    // Fechas entre hoy y 7 dias siguientes
    const turnos8dias = Array.from({ length: 8 }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);

      const clave = fecha.toISOString().slice(0, 10); // formato AAAA-MM-DD
      const valor = turnos[clave] ?? 'L';

      return [clave, valor];
    });

    const textoMes =
      hoy.getMonth() === ultimo.getMonth()
        ? formatearFecha(hoy, { month: 'long' })
        : `${formatearFecha(hoy, { month: 'long' })} / ${formatearFecha(ultimo, { month: 'long' })}`;

    return { turnos8dias, textoMes };
  }, [turnos]);

  const anchoColumna = 100 / turnos8dias.length + '%';

  return (
    <>
      <Titulo titulo={textoMes} Tag="span" estilo={{ div: 'fs-08 text-muted' }} />
      <Table bordered className="fs-07">
        <thead>
          <tr>
            {turnos8dias.map(([fecha], idx) => (
              <td
                key={idx}
                className="text-muted"
                style={{ width: anchoColumna, minWidth: '30px', textAlign: 'center' }}
              >
                {formatearFecha(fecha, { day: '2-digit' })}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {turnos8dias.map(([_, valor], idx) => {
              let bgColor = '';
              if (valor === 'L') bgColor = 'WhiteSmoke';
              else if (valor.startsWith('i')) bgColor = 'LightYellow'; 
              else if (valor.includes('M')) bgColor = 'LightBlue';
              else if (valor.includes('T')) bgColor = 'PapayaWhipe';
              else if (valor.includes('N')) bgColor = 'Plum'; 

              return (
                <td
                  key={idx}
                  style={{
                    width: anchoColumna,
                    minWidth: '30px',
                    textAlign: 'center',
                    backgroundColor: bgColor
                  }}
                >
                  {valor}
                </td>
              );
            })}
          </tr>
        </tbody>
      </Table>
      
    </>
  );
};
