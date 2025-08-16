import { useMemo } from 'react';
import { formatearFecha } from '../../../utils/fechas';
import Table from 'react-bootstrap/Table';
import { Titulo } from '../../../components/Titulos';
import { useTurnos } from '../../../hooks/useTurnos';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Divider } from '@mui/material';

const bgColor = {
  get(valor) {
    if (valor === 'L' || '')    return 'WhiteSmoke';
    if (valor.startsWith('i'))  return 'LightYellow';
    if (valor.includes('M'))    return 'LightBlue';
    if (valor.includes('T'))    return 'PapayaWhip';
    if (valor.includes('N'))    return 'Plum';
    return 'WhiteSmoke';
  }
};

export const SiguientesTurnos = () => {
  const { turnos, loading } = useTurnos();
  
  const { turnos8dias, textoMes } = useMemo(() => {
    if (!turnos) return { turnos8dias: [], textoMes: '' };
    const hoy = new Date();
    const ultimo = new Date();
    ultimo.setDate(hoy.getDate() + 7);

    // Fechas entre hoy y 7 dias siguientes
    const turnos8dias = Array.from({ length: 8 }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);

      const clave = formatearFecha(fecha, 'aaaa-mm-dd'); 
      const valor = turnos[clave] ?? '';

      return [clave, valor];
    });

    const textoMes =
      hoy.getMonth() === ultimo.getMonth()
        ? formatearFecha(hoy, { month: 'long' })
        : `${formatearFecha(hoy, { month: 'long' })} / ${formatearFecha(ultimo, { month: 'long' })}`;

    return { turnos8dias, textoMes };
  }, [turnos]);
  if (loading) return <LoadingSpinner />;
  const anchoColumna = 100 / turnos8dias.length + '%';

  return (
    <>
      {/* <Titulo titulo={textoMes} Tag="span" estilo={{ div: 'fs-08 text-muted' }} /> */}
      <Divider>{textoMes}</Divider>
      <Table bordered className="text-center fs-07">
        <thead>
          <tr>
            {turnos8dias.map(([fecha], idx) => (
              <td key={`dia-${idx}`}>
                {formatearFecha(fecha, { weekday: "short" })}
              </td>
            ))}
          </tr>
          <tr>
            {turnos8dias.map(([fecha], idx) => (
              <td key={idx} className="text-muted">
                {formatearFecha(fecha, { day: '2-digit' })}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {turnos8dias.map(([_, valor], idx) => {
              return (
                <td key={idx} style={{ backgroundColor: bgColor.get(valor) }}>
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
