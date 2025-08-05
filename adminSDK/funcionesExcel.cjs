const XLSX = require('xlsx');
const admin = require('firebase-admin');
const serviceAccount = require('../credentials/teamon-3dc3d-firebase-adminsdk-r6rhe-0648468135.json');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Obtener usuarios registrados de Firestore
const obtenerUsuariosRegistrados = async () => {  
  const colRef = db.collection('USUARIOS');
  const snapshot = await colRef.get();
  const usuariosRegistrados = snapshot.docs
    .filter(doc => doc.data().nombre !== undefined)
    .map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      data: doc.data(),
    }));
  return usuariosRegistrados;
};


const procesarTurneroExcel = async (turnero, dependencia, ano, mes, nucleo) => {
  // 3. Obtener las hojas del archivo Excel
  const ultimaPagina = nucleo === "RUTA" ? 16 : 8; // 16 para RUTA, 8 para TMA
  const hojas = turnero.SheetNames.slice(0, ultimaPagina);
  // 4. Obtener usuarios registrados
  const usuariosRegistrados = await obtenerUsuariosRegistrados();
  const usuariosRegistradosPorNombre = Object.fromEntries(
    usuariosRegistrados.map(u => [u.nombre, u])
  );
  const usuariosTurnero = {};
  const turnosTurnero = {};
  const jornadasTurnero = {};

  // 5. Bucle de hojas del turnero
  hojas.forEach((nombreHoja, indiceHoja) => {
    const hoja = turnero.Sheets[nombreHoja];
    const rango = XLSX.utils.decode_range(hoja['!ref']);
    // Acotar rango de datos validos    
    const primeraFila = 8;
    const primeraColumna = 1;
    const ultimaFila = rango.e.r;
    const ultimaColumna = rango.e.c;
    const rangoDatosValidos = {
      s: { r: primeraFila, c: primeraColumna },
      e: { r: ultimaFila,  c: ultimaColumna },
    };
    const datosValidos = XLSX.utils.sheet_to_json(hoja, {
      range: rangoDatosValidos,
      defval: '',
      header: 1,
    }).filter((row) => row[0] !== '');    

    // Variables básicas del usuario del turnero
    let equipo;
    if (nucleo.includes("RUTA")) {
      nucleo = indiceHoja % 2 ? 'RUTAW' : 'RUTAE';
      equipo = Math.floor(indiceHoja / 2) + 1;      
    }     
    if (nucleo === "TMA") {
      equipo = indiceHoja + 1;       
    }
    // Bucle de filas (cada usuario)
    datosValidos.forEach((row) => {
      const turnos = {};
      // limpiar nombre
      const nombre = row[0].trim().replace(/Ã/g, 'Ñ').replace(/Ã/g, 'Ç');
      const categoria = row[1].trim();
      const filaTurnos = row.slice(2, 33); // 31 días = 31 columnas siempre
      // Bucle de celdas de turnos
      filaTurnos.forEach((t, i) => {
        t = t.trim();
        if (t) {
          const dia = String(i+1).padStart(2, '0'); // día con 2 dígitos
          const fecha = `${ano}-${mes}-${dia}`;
          turnos[fecha] = t;

          jornadasTurnero[fecha] ??= {};
          jornadasTurnero[fecha][dependencia] ??= {};
          jornadasTurnero[fecha][dependencia][nucleo] ??= { M: [], T: [], N: [] };
          const jornada = t.includes('M') ? 'M' : t.includes('T') ? 'T' : 'N';
          // Añadir usuario a la jornada
          jornadasTurnero[fecha][dependencia][nucleo][jornada].push({
            [nombre]: {
              turno: t,
              visto: false,
              cn: "",
              observaciones: "",
            }
          });
        }
      });
      turnosTurnero[nombre] = turnos;
      // TODO: Parsear las últimas hojas fuera de equipo y si usuario existe en turnos combinar sus turnos
      const horas = row[33] || 0;

      usuariosTurnero[nombre] = {        
        // basicos
        // nombre,
        dependencia,
        nucleo,
        equipo,
        categoria,
        // acceso
        estado: "activo",
        rol: ["user"],
        // personal vienen del formulario de registro
        // apodo: "",
        // email: "",
        // telefono: "",
        licencia: "",
        numero: "",
        nivel: "",
        promo: "",
        antiguedad: {
          enaire: "",
          dependencia: "",
          nucleo: "",
          equipo: "",
        },
        historico: {
          equipos: [],
          categorias:[],
        }, 
        // noches
        tablaNoches: {},
        saldoNoches: 1,
        // cambios
        saldoCambios: 3,
      };      
    });
  });
  console.log("FIN");
  
  // Detectar los usuarios del turnero que no estan registrados
  const usuariosNoRegistrados = Object.fromEntries(
    Object.entries(usuariosTurnero).filter(([nombre]) => !usuariosRegistrados.includes(nombre))
  );
  await actualizarUsuariosNoRegistrados(usuariosNoRegistrados, dependencia);
  await actualizarCamposUsuariosExistentes(usuariosTurnero, usuariosRegistradosPorNombre);
  await marcarUsuariosAusentes(usuariosRegistradosPorNombre, usuariosTurnero);
  await subirTurnos(turnosTurnero);
  await subirTurnero(turnosTurnero, dependencia, ano, mes, nucleo);
};

const actualizarCamposUsuariosExistentes = async (usuariosTurnero, usuariosRegistradosPorNombre) => {
  const colRef = db.collection('USUARIOS');
  const batch = db.batch();

  for (const [nombre, nuevoUsuario] of Object.entries(usuariosTurnero)) {
    const usuarioRegistrado = usuariosRegistradosPorNombre[nombre];
    if (!usuarioRegistrado) continue;

    const docRef = colRef.doc(usuarioRegistrado.id);
    const datosActuales = usuarioRegistrado.data;
    const camposActualizables = ['nombre', 'nucleo', 'equipo', 'categoria'];
    const cambios = {};

    camposActualizables.forEach(campo => {
      if (datosActuales[campo] !== nuevoUsuario[campo]) {
        cambios[campo] = nuevoUsuario[campo];
      }
    });

    if (Object.keys(cambios).length > 0) {
      batch.update(docRef, cambios);
    }
  }

  await batch.commit();
  console.log("Usuarios existentes actualizados (si había diferencias)");
};


// Actualizar el doc lista de usuarios no registrados de la dependencia
const actualizarUsuariosNoRegistrados = async (usuariosNoRegistrados, dependencia) => {
  const docRef = db.collection('USUARIOS').doc('#'+dependencia);
  await docRef.set(usuariosNoRegistrados, { merge: true });
  console.log("Usuarios temporales subidos a Firestore en el doc #LECB");
};
const marcarUsuariosAusentes = async (usuariosRegistradosPorNombre, usuariosTurnero) => {
  const colRef = db.collection('USUARIOS');
  const batch = db.batch();

  Object.entries(usuariosRegistradosPorNombre).forEach(([nombre, usuario]) => {
    if (!(nombre in usuariosTurnero)) {
      const docRef = colRef.doc(usuario.id);
      batch.update(docRef, { estado: "ausente" });
    }
  });

  await batch.commit();
  console.log("Usuarios marcados como ausentes si no estaban en el turnero");
};

const subirTurnos = async (turnosTurnero) => {
  const colRef = db.collection('TURNOS');
  const batch = db.batch();

  Object.entries(turnosTurnero).forEach(([nombre, turnos]) => {
    const docRef = colRef.doc(nombre);
    batch.set(docRef, turnos, { merge: true });
  });

  await batch.commit();
  console.log("TURNOS subidos para cada usuario del turnero");
};
const subirTurnero = async (turnosTurnero, dependencia, ano, mes, nucleo) => {
  const colRef = db.collection('TURNEROS_PUBLICADOS');  
  const idTurnero = `${dependencia}_${ano}_${mes}_${nucleo}`;
  const docRef = colRef.doc(idTurnero); 
  await docRef.set(turnosTurnero);
  console.log("TURNERO subido a Firestore");    
};

const main = async () => {
  // 1. Obtener variables de identificación del turnero
  const rutaTurnero = "../turneros/09_lecb-ruta-septiembre-2025.xlsx"; // Cambiar
  const dependenciaTurnero = rutaTurnero.split("/")[2].split("-")[0].split("_")[1].toUpperCase();
  const nucleoTurnero = rutaTurnero.includes("ruta") ? "RUTA" : "TMA";
  const mesTurnero = rutaTurnero.split("/")[2].split("_")[0].padStart(2, "0");
  const anoTurnero = parseInt(rutaTurnero.split("/")[2].split("-")[3].split(".")[0]);

  // 2. Procesar el archivo Excel del turnero
  const turnero = XLSX.readFile(rutaTurnero);
  await procesarTurneroExcel(turnero, dependenciaTurnero, anoTurnero, mesTurnero, nucleoTurnero); 
};

main().catch(console.error);
