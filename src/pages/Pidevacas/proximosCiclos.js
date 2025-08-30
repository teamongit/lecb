const año = 2026;



function obtenerPuntosDias() {
  const diasFestivos = {    
    [`${año-1}-12-25`]:	10,   //Navidad
    [`${año-1}-12-26`]:	5,    //Sant Esteve
    [`${año-1}-12-31`]:	10,   //Nochevieja
    [`${año}-01-01`]:	4,    //Año Nuevo
    [`${año}-01-06`]:	4,    //Reyes
    [`${año}-05-01`]:	5,    //Trabajador
    [`${año}-06-23`]:	5,    //San Juan
    [`${año}-01-24`]:	5,    //San Juan
    [`${año}-08-15`]:	10,   //Virgen
    [`${año}-07-24`]:	5,    //Merce
    [`${año}-10-12`]:	5,    //Hispanidad
    [`${año}-11-01`]:	5,    //Todos Santos
    [`${año}-12-06`]:	5,    //Constitucion
    [`${año}-12-08`]:	5,    //Inmaculada
    [`${año}-12-24`]:	10,   //Nochebuena
    [`${año}-12-25`]:	10,   //Navidad
    [`${año}-12-26`]:	5,    //Sant Esteve
    [`${año}-12-31`]:	10,   //Nochevieja
  };
  const periodosFestivos = [
    {
      inicio: `${año-1}-12-23`, //Navidad
      fin:    `${año-1}-12-31`,
      puntos: 4,
    },
    {
      inicio: `${año}-01-01`, // Año Nuevo Reyes
      fin:    `${año}-01-06`,
      puntos: 4,
    },
    {
      inicio: `${año}-03-30`, // Semana Santa (ajustar cada año)
      fin:    `${año}-04-07`,
      puntos: 5,
    },
    {
      inicio: `${año}-04-01`,
      fin:    `${año}-04-30`,
      puntos: 1,
    },
    {
      inicio: `${año}-05-01`,
      fin:    `${año}-05-31`,
      puntos: 2,
    },
    {
      inicio: `${año}-06-01`,
      fin:    `${año}-06-15`,
      puntos: 2,
    },
    {
      inicio: `${año}-06-16`,
      fin:    `${año}-06-30`,
      puntos: 3,
    },
    {
      inicio: `${año}-07-01`,
      fin:    `${año}-07-30`,
      puntos: 4,
    },
    {
      inicio: `${año}-08-01`,
      fin:    `${año}-08-31`,
      puntos: 4,
    },
    {
      inicio: `${año}-09-01`,
      fin:    `${año}-01-15`,
      puntos: 3,
    },
    {
      inicio: `${año}-09-16`,
      fin:    `${año}-09-30`,
      puntos: 2,
    },
    {
      inicio: `${año}-10-01`,
      fin:    `${año}-10-31`,
      puntos: 1,
    },
    {
      inicio: `${año}-12-23`,
      fin:    `${año}-12-31`,
      puntos: 4,
    },
  ];

  
  const inicioPuntosDias = new Date(`${año-1}-12-25`); // 7 dias antes (año anterior)
  const finPuntosDias = new Date(`${año}-01-08`);      // 8 dias despues
  const puntosDias = [];

  for (let dia = new Date(inicioPuntosDias); dia <= finPuntosDias; dia.setDate(dia.getDate() + 1)) {
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
    0.2,  // L antes -3  
    0.2,  // L antes -2
    0.4,  // L antes -1
    1,    // T ciclo  1
    1,    // T ciclo  2
    1,    // T ciclo  3
    1,    // T ciclo  4
    1,    // T ciclo  6
    0.4,  // L luego +1
    0.4,  // L luego +2
    0.4,  // L luego +3
  ];  
  const inicioPuntosCiclo = new Date('2026-01-08');
  const finPuntosCiclo = new Date('2026-12-31');
  const puntosCiclos = {};  

  const temporada = (fecha) => {
    const mes = fecha.getMonth() + 1;    
    if (mes >= 6 && mes <= 9) return "alta";
    return "baja";
  };

  const generarCupos = () => ['1', '1', 'N'];

  const fechaActual = new Date(inicioPuntosCiclo);

  while (fechaActual <= finPuntosCiclo) {
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
      temporada: temporada(fechaActual)
    };

    // Sumar 8 días
    fechaActual.setDate(fechaActual.getDate() + 8);
  }

  return puntosCiclos;
}
// obtenerProximosCiclos();