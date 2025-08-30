//Funcion principal:
import { formatearFecha } from "../../utils/fechas.js";
import { vacaciones} from "./vacaciones.js";
import fs from "fs";
import path from "path";

export function avanzar() {  
  // 1. Comprobar estado vacaciones
  // 2. Romper recursividad para controlar el fin
  if (vacaciones.estado === "Terminado") {
    comprobar(vacaciones);
    return salir(vacaciones);
  }

  // 3. En cada iteracion recalcular movimientos
  obtenerMovimientos(vacaciones);
  // ordenar(vacaciones);

  // 4. Obtener al integrante siguiente 
  const integranteSiguiente = vacaciones.integrantes[vacaciones.siguiente - 1];
  
  // 5. Obtener peticion valida y su indice del array cupos (fila)
  const peticion = obtenerPeticionValida(integranteSiguiente, vacaciones);

  // 6. Si el integrante no tiene peticion valida: salir
  if (!peticion) {
    // return salir(vacaciones);    
    // Simulación con distribución 90% / 10%
    const azar = Math.random() < 0.90;
    if (true) {
      anadirPeticiones(integranteSiguiente, vacaciones);
      return avanzar(vacaciones);
    } else {
      return salir(vacaciones);
    }
  }

  // 7. Asignar la peticion valida al integrante siguiente
  // asignar(peticion, integranteSiguiente, vacaciones);

  // 8. Continuar con el siguiente integrante y gestionar el avance de rondas
  return continuar(vacaciones);
}

function obtenerMovimientos(vacaciones) {
  const { ciclos, integrantes, ronda, siguiente } = vacaciones;

  const { baja, alta, m_baja, m_alta, huecos, huecos_total, huecos_baja, huecos_alta } = Object.values(ciclos)
    .reduce((acc, ciclo) => {
    if (ciclo.cupos[1] == 1) {
      ciclo.temporada == "baja" ? acc.baja++ : acc.alta++;
    }
    if (ciclo.cupos[1] == "M") {
      ciclo.temporada == "baja" ? acc.m_baja++ : acc.m_alta++;
    }
    if (ciclo.cupos[0] == 1 || ciclo.cupos[1] == 1) {
      acc.huecos++;
    }
    // para controlar que todo esta bien configurado de inicio
    if (ciclo.cupos[0] == 1) {
      acc.huecos_total++;
    }
    if (ciclo.cupos[1] == 1) {
      acc.huecos_total++;
    }
    if (ciclo.cupos[0] == 1) {
      ciclo.temporada == "baja" ? acc.huecos_baja++ : acc.huecos_alta++;
    }
    if (ciclo.cupos[1] == 1) {
      ciclo.temporada == "baja" ? acc.huecos_baja++ : acc.huecos_alta++;
    }
    return acc;
  }, { baja: 0, alta: 0, m_baja: 0, m_alta: 0, huecos: 0, huecos_total: 0, huecos_baja: 0, huecos_alta: 0});

  const restantes = integrantes.length * (7 - ronda) - siguiente;
  vacaciones.movimientos = {
    restantes,
    huecos,
    baja,
    alta,
    m_baja,
    m_alta,
    huecos_total,
    huecos_baja,
    huecos_alta,
  };
}

function obtenerPeticionValida(integrante, vacaciones) {
  let pedidos = integrante.peticiones.filter(p => p.estado === "pedido");

  for (const peticion of pedidos) {
    let resultado;

    if (peticion.tipo === "simple") {
      resultado = comprobarSimple(peticion, vacaciones.ronda, integrante, vacaciones);
    } 
    else if (peticion.tipo === "doble") {
      resultado = comprobarDoble(peticion, vacaciones.ronda, integrante, vacaciones);
    } 
    else if (peticion.tipo === "quincena") {
      resultado = comprobarQuincena(peticion, integrante, vacaciones);
    } 
    else if (peticion.tipo === "pasar") {
      resultado = peticion;
    }

    // si la petición fue válida, devolverla y salir
    if (resultado) {
      return resultado;
    }
    // si fue inválida, seguimos probando con la siguiente
  }

  // si ninguna funcionó, devolvemos null
  return null;
}

function comprobarSimple(peticion, ronda, integrante, vacaciones) {
  
  // fecha de la peticion
  const fecha = formatearFecha(peticion.fecha,"aaaa-mm-dd");
  // temporada de la peticion
  const temporada = vacaciones.ciclos[fecha].temporada;
  // ciclo de la peticion
  const ciclo = vacaciones.ciclos[fecha];
  // indice del cupo 1/M/Z si lo hay
  const i_1 = ciclo.cupos.findIndex(c => c == 1);
  const i_M = ciclo.cupos.findIndex(c => c == "M");
  const i_Z = ciclo.cupos.findIndex(c => c == "Z");
  // ciclo movible    
  const esMovible = (i_M > 0 && !!vacaciones.movimientos[temporada]);
  // cantidad por temporada
  const cantidadTemporada = !!integrante.cantidad[temporada];
  
  if (i_Z >= 0 && cantidadTemporada && esMovible) {
    moverM(vacaciones, temporada); // crear un nuevo ciclo movible en temporada
    // exito
    asignar(peticion, ronda, integrante, vacaciones, i_Z);
    return true;
  }

  // hay indice con cupo 1 o si es movible y ademas tiene cantidad en temporada
  if (i_1 >= 0) {
    if (cantidadTemporada) {
      // exito
      asignar(peticion, ronda, integrante, vacaciones, i_1);
      return true;
    }
  }
  // no hay cupo 1 
  else {
    // pero es movible 
    if (esMovible) {
      // tiene cantidad en temporada
      if (cantidadTemporada) {
        // filtrar: misma temporada y con cupos 1 en indice mayor que 0 (segunda y tercera fila)
        moverM(vacaciones)
        // exito
        asignar(peticion, ronda, integrante, vacaciones, i_M);        
        return true;
      }
    }
  }
  // fracaso: la peticion no esta disponible
  peticion.estado = "nodisponible";
  return false;
};

function comprobarDoble(peticion, ronda, integrante, vacaciones) {
  // clonar para no mutar el original (copia profunda)
  const vacacionesCopia = JSON.parse(JSON.stringify(vacaciones)); 
  const integranteCopia = JSON.parse(JSON.stringify(integrante)); 
  // dividir la peticion en copias superficiales (no mutan)
  const { fecha, fecha2, ...peticionSinFecha } = peticion;
  const peticionCopia1 = { ...peticionSinFecha, fecha: peticion.fecha };
  const peticionCopia2 = { ...peticionSinFecha, fecha: peticion.fecha2 };

  // simular con las copias
  // si alguna no es valida descartar la peticion original
  for (const peticionCopia of [peticionCopia1, peticionCopia2]) {
    const resultado = comprobarSimple(peticionCopia, ronda, integranteCopia, vacacionesCopia);
    if (!resultado) {
      peticion.estado = "nodisponible";
      return false;
    }
  }
  // exito  
  const index = integrante.peticiones.indexOf(peticion);  
  integrante.peticiones.splice(index, 1, peticionCopia1, peticionCopia2);
  // si ambas pasaron en vacacionesCopia → aplicamos en vacaciones real
  comprobarSimple(peticionCopia1, vacaciones.ronda, integrante, vacaciones);
  comprobarSimple(peticionCopia2, vacaciones.ronda+1, integrante, vacaciones);
  return true;
}
function moverM(vacaciones, temporada) {
  const ciclos = Object.values(vacaciones.ciclos).filter(ciclo => 
    ciclo.temporada === temporada && ciclo.cupos.some((valorCupo, i) => valorCupo === 1 && i > 0)
  );
  // bucle de ciclos validos 
  for (const ciclo of ciclos) {
    const i = ciclo.cupos.findIndex((valorCupo, i) => valorCupo === 1 && i > 0);
    if (i !== -1) {
      // cambiar 1 x M en el ciclo encontrado            
      ciclo.cupos[i] = "M";
      // se ha consumido un movimiento, salir del bucle
      vacaciones.movimientos[temporada]--;
      break;
    }            
  }
}
function asignar(peticion, ronda, integrante, vacaciones, indexCupo) {  
  const fecha = peticion.fecha;
  // asignado en ronda
  peticion.estado = "asignado";
  peticion.ronda = ronda;
  // apodo en cupo ciclo
  vacaciones.ciclos[fecha].cupos[indexCupo] = integrante.apodo;
  const { puntos, temporada } = vacaciones.ciclos[fecha];
  // puntos del ciclo asignado
  let penalizar = 1;
  if (peticion.tipo === "doble" || peticion.tipo === "quincena") {
    const peticionAnterior = integrante.peticiones.find(p => p.ronda === ronda-1 && p.estado === "asignado");
    if (!peticionAnterior || peticionAnterior.tipo !== "pasar") 
      penalizar = vacaciones.penalizaciones.sinPasar;
  }
  integrante.puntos[ronda].parcial = puntos * penalizar;
  integrante.puntos[ronda].fin = integrante.puntos[ronda].inicio + integrante.puntos[ronda].parcial;  
  if (ronda+1 <= 6)
    integrante.puntos[ronda+1].inicio = integrante.puntos[ronda].fin;
  // disminuir la cantidad restante por temporada
  integrante.cantidad[temporada]--;
}

// simulador peticiones
function anadirPeticiones(integrante, vacaciones) {
  const fechasYaPedidas = new Set(integrante.peticiones.map(p => p.fecha));

  const fechasDisponibles = Object.keys(vacaciones.ciclos)
  .filter(fecha => {
    const ciclo = vacaciones.ciclos[fecha];

    const yaPedida = fechasYaPedidas.has(fecha);
    if (yaPedida) return false;

    const hayCupo = ciclo.cupos.some(c => c == 1 || (c == "M" && vacaciones.movimientos[ciclo.temporada]));
    const tieneCantidad = integrante.cantidad[ciclo.temporada] > 0;
    return hayCupo && tieneCantidad;
  });

  // Añadir 4 peticiones (si las hay)
  const fechasAleatorias = fechasDisponibles.sort(() => 0.5 - Math.random()).slice(0, 4);

  // Crear peticiones para las fechas seleccionadas
  const peticiones = fechasAleatorias.map((fecha) => {
    // const ciclo = vacaciones.ciclos[fecha];
    return {
      fecha,
      estado: "pedido",
      tipo: "simple",
    };
  });

  integrante.peticiones.push(...peticiones);
}

function ordenar(vacaciones) {
  const { ronda, integrantes } = vacaciones;  
  integrantes.sort((a, b) => a.puntos[ronda].inicio - b.puntos[ronda].inicio);
}

function empates(vacaciones) {
  const { ronda, integrantes } = vacaciones;  
    integrantes.forEach((integrante, i) => {
    // Comparar con el integrante anterior y siguiente (si existe) para detectar empate
    const difAnt = integrante.puntos[ronda].inicio - integrantes[i-1]?.puntos[ronda].inicio;
    const difSig = integrantes[i+1]?.puntos[ronda].inicio - integrante.puntos[ronda].inicio;
    const hayEmpate = (difAnt < 0.01 || difSig < 0.01);
    integrante.empate = hayEmpate;
  });

  if (integrantes.some(integrante => integrante.empate)) {
    // TODO: resolver empate aqui segun normas
    if (vacaciones.resolver_empates === "aleatorio") {
      console.log("hay empates pero continuar");
    } else {      
      Pausar(vacaciones);
      return salir(vacaciones);
    }
  }
}

function continuar(vacaciones) {  
  // todos los integrantes tienen alguna peticion asignada en la ronda
  const esFinRonda = vacaciones.integrantes.every(integrante => 
    integrante.peticiones.some(peticion => peticion.ronda === vacaciones.ronda)
  );
  if (esFinRonda) {    
    // siguiente ronda
    vacaciones.ronda++;
    const esTerminado = vacaciones.ronda === 7;
    if (!esTerminado) {
      vacaciones.siguiente = 1;
      if (vacaciones.ronda_reset_puntos === vacaciones.ronda) {
        vacaciones.integrantes.forEach(integrante => integrante.puntos[vacaciones.ronda].inicio -= integrante.puntos[1].inicio);
      }
      ordenar(vacaciones);
      empates(vacaciones);
      // Control de pausa por avance de ronda
      if (vacaciones.pausar_inicio_ronda === vacaciones.ronda) {
        Pausar(vacaciones); 
        return salir(vacaciones);
      }
    } else {
      // Terminado      
      vacaciones.estado = "Terminado";
      vacaciones.ronda = "Fin";
      comprobar(vacaciones);  
      // guardar datos en firestore
      return salir(vacaciones);
    }
    
    
  // Hay integrantes sin peticion asignada en la ronda
  } else {
    vacaciones.siguiente++;    
  }
  // continuar
  return avanzar(vacaciones);
}

function salir(vacaciones) {
  // const docRef = db.collection("VACACIONES").doc("2026_LECB_RUTA_3_E");
  // try {
  //   docRef.update(vacaciones);
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, error: error.message };
  // }
  guardarVacaciones();
  throw new Error("FIN_AVANCE_VACACIONES"); // marca de corte
}

function Pausar(vacaciones) {
  vacaciones.estado = "Pausado";
}
// Función que guarda el objeto vacaciones en el archivo original
function guardarVacaciones() {
  const archivo = path.resolve("./src/pages/Pidevacas/vacaciones.js");

  // Genera el contenido como JS válido
  const contenido = `export const vacaciones = ${JSON.stringify(vacaciones, null, 2)};\n`;

  // Sobreescribe el archivo
  fs.writeFileSync(archivo, contenido, "utf8");
  console.log("Archivo vacaciones.js actualizado!");
}

function comprobar(vacaciones) {
  obtenerMovimientos(vacaciones);

  const asignacionesPorFecha = {};
  const asignacionesPorIntegrante = {};

  vacaciones.integrantes.forEach((integrante) => {
    const contadorTemporadas = { alta: 0, baja: 0 };

    integrante.peticiones
      .filter(peticion => peticion.estado === "asignado")
      .forEach((peticion) => {
        const fecha = peticion.fecha;
        const temporada = vacaciones.ciclos[fecha].temporada;

        // acumular global por fecha
        asignacionesPorFecha[fecha] = (asignacionesPorFecha[fecha] || 0) + 1;

        // acumular por temporada para el integrante
        contadorTemporadas[temporada]++;
      });

    asignacionesPorIntegrante[integrante.apodo] = contadorTemporadas;
  });

  let totalAsignaciones = 0;
  for (const fecha in asignacionesPorFecha) {
    totalAsignaciones += asignacionesPorFecha[fecha];
  }

  return {
    totalAsignaciones,
    asignacionesPorFecha,
    asignacionesPorIntegrante
  };
}



try {
  avanzar();
} catch (e) {
  if (e.message === "FIN_AVANCE_VACACIONES") {
    console.log("Ejecución finalizada correctamente.");
  } else {
    throw e; // re-lanzar si es un error real
  }
}
comprobar(vacaciones);
