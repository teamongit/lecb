import { useMemo } from 'react';
import { formatearFecha } from '@/utils/fechas';
import Table from 'react-bootstrap/Table';
import { useTurnos } from '@/hooks/useTurnos';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Divider } from '@mui/material';
import { COLORES_TURNOS, TURNOS } from '@/utils/constants';

export const SiguientesTurnos = () => {
  const { turnos, loading } = useTurnos();

  const { turnos8dias, textoMes } = useMemo(() => {
    if (!turnos) return { turnos8dias: [], textoMes: '' };

    const hoy = new Date();
    const ultimo = new Date();
    ultimo.setDate(hoy.getDate() + 7);

    const turnos8dias = Array.from({ length: 8 }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      const claveFecha = formatearFecha(fecha, 'aaaa-mm-dd');

      const turnoClave = turnos[claveFecha] || ''; // ej. "Mc", "Tc", "N", "L"
      const turnoObj = TURNOS[turnoClave] || { jornada: '', funcion: '', duracion: '' };

      return { fecha: claveFecha, turno: turnoObj, label: turnoClave };
    });

    const textoMes =
      hoy.getMonth() === ultimo.getMonth()
        ? formatearFecha(hoy, { month: 'long' })
        : `${formatearFecha(hoy, { month: 'long' })} / ${formatearFecha(ultimo, { month: 'long' })}`;

    return { turnos8dias, textoMes };
  }, [turnos]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Divider>{textoMes}</Divider>
      <Table bordered className="text-center fs-07">
        <thead>
          <tr>
            {turnos8dias.map(({ fecha }) => (
              <td key={`weekday-${fecha}`}>{formatearFecha(fecha, { weekday: "short" })}</td>
            ))}
          </tr>
          <tr>
            {turnos8dias.map(({ fecha }) => (
               <td key={`day-${fecha}`} className="text-muted">{formatearFecha(fecha, { day: '2-digit' })}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {turnos8dias.map(({ turno, label }, i) => {
              const bgColor = COLORES_TURNOS.colorFondo[turno.jornada || ''] || '#E0E0E0';
              const textColor = COLORES_TURNOS.colorTexto[turno.jornada || ''] || 'Black';
              return (
                <td key={`turno-${i}`} style={{ backgroundColor: bgColor, color: textColor }}>
                  {label || '-'}
                </td>
              );
            })}
          </tr>
        </tbody>
      </Table>
    </>
  );
};
