function obtenerPuntosDias() {
  const diasFestivos = {
    "2025-12-25":	10, //Navidad
    "2025-12-26":	5, //Sant Esteve
    "2025-12-31":	10, //Nochevieja
    "2026-01-01":	4, //Año Nuevo
    "2026-01-06":	4, //Reyes
    "2026-05-01":	5, //Trabajador
    "2026-06-23":	5, //San Juan
    "2026-06-24":	5, //San Juan
    "2026-08-15":	10, //Virgen
    "2026-07-24":	5, //Merce
    "2026-10-12":	5, //Hispanidad
    "2026-11-01":	5, //Todos Santos
    "2026-12-06":	5, //Constitucion
    "2026-12-08":	5, //Inmaculada
    "2026-12-24":	10, //Nochebuena
    "2026-12-25":	10, //Navidad
    "2026-12-26":	5, //Sant Esteve
    "2026-12-31":	10, //Nochevieja
  };
  const periodosFestivos = [
    {
      inicio: "2025-12-23", //Navidad
      fin:    "2025-12-31",
      puntos: 4,
    },
    {
      inicio: "2026-01-01", // Año Nuevo Reyes
      fin:    "2026-01-06",
      puntos: 4,
    },
    {
      inicio: "2026-03-30", // Semana Santa (ajustar cada año)
      fin:    "2026-04-07",
      puntos: 5,
    },
    {
      inicio: "2026-04-01",
      fin:    "2026-04-30",
      puntos: 1,
    },
    {
      inicio: "2026-05-01",
      fin:    "2026-05-31",
      puntos: 2,
    },
    {
      inicio: "2026-06-01",
      fin:    "2026-06-15",
      puntos: 2,
    },
    {
      inicio: "2026-06-16",
      fin:    "2026-06-30",
      puntos: 3,
    },
    {
      inicio: "2026-07-01",
      fin:    "2026-07-30",
      puntos: 4,
    },
    {
      inicio: "2026-08-01",
      fin:    "2026-08-31",
      puntos: 4,
    },
    {
      inicio: "2026-09-01",
      fin:    "2026-09-15",
      puntos: 3,
    },
    {
      inicio: "2026-09-16",
      fin:    "2026-09-30",
      puntos: 2,
    },
    {
      inicio: "2026-10-01",
      fin:    "2026-10-31",
      puntos: 1,
    },
    {
      inicio: "2026-12-23",
      fin:    "2026-12-31",
      puntos: 4,
    },
  ];

  const puntosDias = [];
  const inicio = new Date("2025-12-25");
  const fin = new Date("2027-01-08");

  for (let dia = new Date(inicio); dia <= fin; dia.setDate(dia.getDate() + 1)) {
    const a = dia.getFullYear();
    const m = String(dia.getMonth() + 1).padStart(2, '0');
    const d = String(dia.getDate()).padStart(2, '0');
    const AAAA_MM_DD = `${a}-${m}-${d}`;
    const fecha = new Date(AAAA_MM_DD);
    
    // comprobar para cada dia
    const diaSemana = fecha.getDay(); 
    const esViernes    = diaSemana === 5;
    const esSabado     = diaSemana === 6;
    const esDomingo    = diaSemana === 0;
    // eslint-disable-next-line no-prototype-builtins
    const esDiaFestivo = diasFestivos.hasOwnProperty(AAAA_MM_DD);
    // puntos de cada dia
    let puntos = 1;
    if (esViernes) puntos += 0.5;
    else if (esSabado) puntos += 1;
    else if (esDomingo) puntos += 1;
    if (esDiaFestivo) puntos += diasFestivos[AAAA_MM_DD];

    
    for (const periodo of periodosFestivos) {
      const inicio = new Date(periodo.inicio);
      const fin = new Date(periodo.fin);
      if (fecha >= inicio && fecha <= fin) {
        puntos += periodo.puntos;
        
        break;
      }
    }
    puntosDias.push({fecha:AAAA_MM_DD, puntos});
  }
  return puntosDias;
}

export function obtenerProximosCiclos() {
  const puntosDias = obtenerPuntosDias();
  const ponderar = [
    0.2,
    0.2,
    0.4,
    1,
    1,
    1,
    1,
    1,
    0.4,
    0.4,
    0.4,
  ];  
  const puntosCiclos = {};
  const fechaInicio = new Date('2026-01-08');
  const fechaFin = new Date('2026-12-31');
  

  const esTemporadaAlta = (fecha) => {
    const mes = fecha.getMonth() + 1;
    return mes >= 6 && mes <= 9;
  };

  const generarCupos = () => ['1', '1', 'N'];

  let fechaActual = new Date(fechaInicio);

  while (fechaActual <= fechaFin) {
    const AAAA_MM_DD = fechaActual.toISOString().split('T')[0];
    const index = puntosDias.findIndex(p => p.fecha == AAAA_MM_DD);
    let puntos = 0;
    let j = 0;
    for (let i = index-3; i<index+8; i++) {
      puntos += ponderar[j] * puntosDias[i].puntos;
      j++;
    }
    
    puntosCiclos[AAAA_MM_DD] = {
      puntos,
      cupos: generarCupos(),
      temporada: esTemporadaAlta(fechaActual) ? 'alta' : 'baja'
    };

    // Sumar 8 días
    fechaActual.setDate(fechaActual.getDate() + 8);
  }

  return puntosCiclos;
}
// obtenerProximosCiclos();