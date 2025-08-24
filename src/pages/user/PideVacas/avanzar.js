//Funcion principal:
import { formatearFecha } from "../../../utils/fechas.js";
import { vacaciones} from "./vacaciones.js";
import fs from "fs";
import path from "path";

export function avanzar() {  
  // 1. Comprobar estado vacaciones
  
  if (vacaciones.estado != "Activo") 
    return { success: true };
  // 2. Romper recursividad para controlar el fin
  if (vacaciones.ronda == 7) 
    return { success: true };

  // 3. En cada iteracion recalcular movimientos
  // - M movibles en cada temporada
  // - Huecos disponibles
  // - Ciclos restantes por pedir
  ordenar(vacaciones);
  obtenerMovimientos(vacaciones);

  // 4. Obtener al integrante siguiente 
  const integrante = vacaciones.integrantes[vacaciones.siguiente - 1];
  
  // 5. Obtener peticion valida y su indice del array cupos (fila)
  const [peticion, indexCupo] = obtenerPeticionValida(integrante, vacaciones);

  // 6. Si el integrante no tiene peticion valida: salir
  if (!peticion) {
    // Simulación con distribución 75% / 25%
    if (Math.random() < 0.90) {
      anadirPeticiones(integrante, vacaciones);
      return avanzar(vacaciones);
    } else {
      return salir(vacaciones);
    }
    // return salir(vacaciones);
  }

  // 7. Asignar la peticion valida al integrante siguiente
  asignar(peticion, indexCupo, integrante, vacaciones);

  // 8. Continuar con el siguiente integrante y gestionar el avance de rondas
  return continuar(vacaciones);
}

function obtenerMovimientos(vacaciones) {
  const { ciclos, integrantes, ronda, siguiente } = vacaciones;

  const { baja, alta, m_baja, m_alta, huecos, huecos_total, huecos_baja, huecos_alta } = Object.values(ciclos).reduce((acc, ciclo) => {
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
  let pedidos = integrante.peticiones.filter(p => p.estado == "pedido");
  
  const comprobarSimple = (p) => {
    // fecha de la peticion
    const f = formatearFecha(p.fecha,"aaaa-mm-dd");
    const t = vacaciones.ciclos[f].temporada;
    const ciclo = vacaciones.ciclos[f];
    // indice del cupo 1 si lo hay
    const i_1 = ciclo.cupos.findIndex(c => c == 1);
    const i_M = ciclo.cupos.findIndex(c => c == "M");
    const i_Z = ciclo.cupos.findIndex(c => c == "Z");
    // ciclo movible    
    const esMovible = (i_M > 0 && vacaciones.movimientos[t] > 0);
    // cantidad por temporada
    const tieneCantidad = t == "baja" 
    ? integrante.cantidad_invierno > 0 
    : integrante.cantidad_verano > 0;
    // hay indice con cupo 1 
    // o si es movible y ademas tiene cantidad en temporada
    if (i_1 >= 0) {
      if (tieneCantidad) {
        // devolver peticion exitosa y el indice donde hay 1
        return [p, i_1];
      }
    }
    // no hay cupo 1 pero es movible 
    else {
      if (esMovible) {
        if (tieneCantidad) {          
          const ciclos = Object.values(vacaciones.ciclos);
          // Cambiar 1 x M en el ciclo encontrado
          for (const ciclo of ciclos) {
            if (ciclo.temporada === t) {
              // encontrar el ciclo que tiene un valor 1 en un cupo con indice mayor que 0 (segunda, tercera fila)
              const i = ciclo.cupos.findIndex((v,i) => v === 1 && i > 0);
              if (i !== -1) {
                ciclo.cupos[i] = "M";
                vacaciones.movimientos[t]--;
                break;
              }
            }
          }
          // devolver peticion exitosa y el indice donde hay M
          return [p, i_M];
        }
      }
    }
    // fracaso: la peticion no esta disponible
    p.estado = "nodisponible";
    return [null, null];
  };

  const comprobarDoble = (p) => {
    
    const ciclo1 = vacaciones.ciclos[p.fecha];
    const ciclo2 = vacaciones.ciclos[p.fecha2];
    const i1 = ciclo1.cupos.findIndex(c => c == 1);
    const i2 = ciclo2.cupos.findIndex(c => c == 1);

    let hayCupos1 = false; 
    let tieneCantidad = false;

    // Ambos ciclos tienen cupo 1
    if (i1 >= 0 && i2 >= 0) 
    hayCupos1 = true;
    
    // Sumar cuantos cupos vamos a consumir por temporada
    let alta = 0;
    let baja = 0;
    if (ciclo1.temporada == 'alta') alta++;
    else if (ciclo1.temporada == 'baja') baja++;
    if (ciclo2.temporada == 'alta') alta++;
    else if (ciclo2.temporada == 'baja') baja++;
    
    if (integrante.cantidad_invierno >= baja && integrante.cantidad_verano >= alta) 
      tieneCantidad = true;

    // indice cupo -1, ciclo tiene M y queda al menos 1 movimiento en temporada
    let hayMovimientos = false;
    const esMovible1 = i1 < 0 && ciclo1.cupos.includes("M");
    const esMovible2 = i2 < 0 && ciclo2.cupos.includes("M");
    let movimientos_alta = 0;
    let movimientos_baja = 0;
    if (vacaciones.movimientos[ciclo1.temporada] == 'alta') movimientos_alta++;
    else if (vacaciones.movimientos[ciclo1.temporada] == 'baja') movimientos_baja++;
    if (vacaciones.movimientos[ciclo2.temporada] == 'alta') movimientos_alta++;
    else if (vacaciones.movimientos[ciclo2.temporada] == 'baja') movimientos_baja++;

    if ((esMovible1 || esMovible2) && 
        vacaciones.movimientos.baja >= movimientos_baja && 
        vacaciones.movimientos.alta >= movimientos_alta)
        hayMovimientos = true;
  };

  let [peticion, indexCupo] = [null, null];
  for (const p of pedidos) {
    if (p.tipo == "simple") 
      [peticion, indexCupo] = comprobarSimple(p);

    else if (p.tipo == "doble") 
      [peticion, indexCupo] = comprobarDoble(p);

    else if (peticion.tipo == "quincena") 
      [peticion, indexCupo] = comprobarQuincena(p);

    else if (peticion.tipo == "pasar") 
      [peticion, indexCupo] = ["pasar", 0];
    
    // salir del bucle con peticion valida
    if (peticion && indexCupo >= 0) break;
  }
  return [peticion, indexCupo];
}

function asignar(peticion, indexCupo, integrante, vacaciones) {
  // Escribir apodo en el hueco del ciclo
  vacaciones.ciclos[peticion.fecha].cupos[indexCupo] = integrante.apodo;
  const puntos = vacaciones.ciclos[peticion.fecha].puntos;
  const temporada = vacaciones.ciclos[peticion.fecha].temporada;
  // Actualizar el estado de la peticion del integrante a asignado y ronda
  peticion.estado = "asignado";
  peticion.ronda = vacaciones.ronda;
  // Actualizar los puntos del integrante en esa ronda (acumular suma con la ronda anterior)
  integrante.puntos[vacaciones.ronda] = integrante.puntos[vacaciones.ronda - 1] + puntos;
  // Disminuir la cantidad restante por temporada
  if (temporada == "baja") 
    integrante.cantidad_invierno--;
  else 
    integrante.cantidad_verano--;
}

// simulador peticiones
function anadirPeticiones(integrante, vacaciones) {
  if (!integrante.peticiones) integrante.peticiones = [];

  const fechasYaPedidas = new Set(integrante.peticiones.map(p => p.fecha));

  const fechasDisponibles = Object.keys(vacaciones.ciclos)
  .filter(fecha => {
    const ciclo = vacaciones.ciclos[fecha];

    const yaPedida = fechasYaPedidas.has(fecha);
    if (yaPedida) return false;

    const hayCupo = ciclo.cupos.some(c => c == 1 || (c == "M" && vacaciones.movimientos[ciclo.temporada]));

    const tieneCantidad = 
    (ciclo.temporada === "baja" && integrante.cantidad_invierno > 0) || 
    (ciclo.temporada === "alta" && integrante.cantidad_verano > 0);

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
      // puntos: ciclo.puntos,
      // temporada: ciclo.temporada,
    };
  });

  integrante.peticiones.push(...peticiones);
}

function ordenar(vacaciones) {
  const r = vacaciones.ronda;
  const integrantes = vacaciones.integrantes;

  // Ordenar por puntos de la ronda anterior (ronda - 1)
  integrantes.sort((a, b) => a.puntos[r-1] - b.puntos[r-1]);

  let hayEmpates = false;

  integrantes.forEach((integrante, i) => {
    // Asignar orden
    integrante.orden[r] = i+1;
    
    // Comparar con el anterior para detectar empate
    if (i > 0 && (integrante.puntos[r-1] - integrantes[i-1].puntos[r-1] < 0.1)) {
      hayEmpates = true;
    }
  });
  if (hayEmpates) {
    vacaciones.estado = "Pausado";
    salir(vacaciones);
  }
}

 function continuar(vacaciones) {  
  // Todos los integrantes tienen alguna peticion asignada en la ronda
  if (vacaciones.integrantes.every(integrante => 
        integrante.peticiones?.some(peticion => 
          peticion.ronda == vacaciones.ronda))) {
    // fin de ronda, siguiente ronda
    vacaciones.ronda++;
    vacaciones.siguiente = 1;
    ordenar(vacaciones);
    // Control de pausa por avance de ronda
    if (vacaciones.pausar_inicio_ronda == vacaciones.ronda) {
      vacaciones.estado = "Pausado";
      return salir(vacaciones);
    }

    // fin del programa
    if (vacaciones.ronda == 7) {

      vacaciones.siguiente = vacaciones.integrantes.length+1;
      vacaciones.estado = "Terminado";
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
  return { success: true };
}

function comprobar(vacaciones) {
  obtenerMovimientos(vacaciones);
  // Paso 1: Contar ocurrencias de cada fecha asignada
  const asignacionesPorFecha = {}; // ejemplo: { '15/07/2025': 3 }

  vacaciones.integrantes.forEach((integrante) => {
    integrante.peticiones.forEach((peticion) => {
      if (peticion.estado === "asignado") {
        const fecha = peticion.fecha;
        asignacionesPorFecha[fecha] = (asignacionesPorFecha[fecha] || 0) + 1;
      }
    });
  });

  let totalAsignaciones = 0;

  for (const fecha in asignacionesPorFecha) {
    totalAsignaciones += asignacionesPorFecha[fecha];
  }
  console.log(totalAsignaciones);
}

// Función que guarda el objeto vacaciones en el archivo original
function guardarVacaciones() {
  const archivo = path.resolve("./src/pages/user/PideVacas/vacaciones.js");

  // Genera el contenido como JS válido
  const contenido = `export const vacaciones = ${JSON.stringify(vacaciones, null, 2)};\n`;

  // Sobreescribe el archivo
  fs.writeFileSync(archivo, contenido, "utf8");
  console.log("Archivo vacaciones.js actualizado!");
}

avanzar();
// comprobar(vacaciones);
