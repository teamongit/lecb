// Roles del sistema
export const ROLES = {
  ADMIN: 'admin',
  FURRI: 'furri',
  SUPER: 'super',
  USER: 'user'
};

// Rutas base (útil para navegar o construir rutas dinámicamente)
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  NOAUTORIZADO: '/noautorizado',

  USUARIO_PERFIL: '/perfil',
  USUARIO_NOCTURNOS: '/nocturnos',
  USUARIO_PIDEVACAS: '/pidevacas',
  USUARIO_PUBLICAMBIOS: '/publicambios',
  USUARIO_TUTURNERO: '/tuturnero',

  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_HVOLUNTARIAS: '/admin/hvoluntarias',

  FURRI_NOCTURNOS: '/furri/nocturnos',
  FURRI_PIDEVACAS: '/furri/pidevacas',

  SUPER_ESCALONADA: '/super/escalonada',
  SUPER_SECTORES: '/super/sectores',
};

export const CATEGORIAS = {
  CON: "Controlador",
  INS: "Instructor",
  SUP: "Supervisor",
  IS: "Inst-Super",
  TIN: "Técn-Inst",
  TS: "Técn-Super",
  INY: "Instruyendo",
};

export const CATEGORIA_FUNCION = {
  CON: [{ value: "Img", label: "Imaginaria" }],
  INS: [{ value: "Ins", label: "Instructor" }, { value: "Img", label: "Imaginaria" }],
  SUP: [{ value: "Sup", label: "Supervisor" }, { value: "Img", label: "Imaginaria" }],
  IS: [{ value: "Sup", label: "Supervisor" }, { value: "Ins", label: "Instructor" }, { value: "Img", label: "Imaginaria" }],
  TIN: [{ value: "Ins", label: "Instructor" }, { value: "Img", label: "Imaginaria" }],
  TS: [{ value: "Sup", label: "Supervisor" }, { value: "Img", label: "Imaginaria" }],
  INY: [],
}

export const FUNCIONES = [
  { value: "Sup", label: "Supervisor" },
  { value: "Ins", label: "Instructor" },
  { value: "Img", label: "Imaginaria" },
];

// Duraciones de cambio
export const DURACIONES = [
  { value: "", label: "Cualquiera" },
  { value: "c", label: "Corta" },
  { value: "L", label: "Larga" },
];

export const TIPOS_CAMBIO = {
  QUITAR: { value: "quitar", label: "Quitar un turno" },
  HACER: { value: "hacer", label: "Hacer un turno" },
  CAMBIAR: { value: "cambiar", label: "Intercambiar un turno" },
};

export const SERVICIOS = [
  { value: "M", label: "Mañana (M)" },
  { value: "T", label: "Tarde (T)" },
  { value: "N", label: "Noche (N)" },
];
export const COLORES_TURNOS = {
  colorFondo: {
    M: "#A1DAD4",
    T: "#FFCB1D",
    N: "#5954A4",
    X: "#FD7F6E",
    L: "#FD7F6E",
    "": "#E0E0E0", // ejemplo: gris para turno vacío
  },
  colorTexto: {
    M: "Black",
    T: "Black",
    N: "White",
    X: "Black",
    L: "Black",
    "": "Black", // color de texto cuando el turno es ""
  }
};
export const TURNOS = {  
  Mc: { jornada: "M", funcion: "", duracion: "C" },
  Ml: { jornada: "M", funcion: "", duracion: "L" },
  Tc: { jornada: "T", funcion: "", duracion: "C" },
  Tl: { jornada: "T", funcion: "", duracion: "L" },
  N: { jornada: "N", funcion: "", duracion: "N" },
  imc: { jornada: "M", funcion: "Img", duracion: "C" },
  iml: { jornada: "M", funcion: "Img", duracion: "L" },
  itc: { jornada: "T", funcion: "Img", duracion: "C" },
  itl: { jornada: "T", funcion: "Img", duracion: "L" },
  in: { jornada: "N", funcion: "Img", duracion: "N" },
  McSupE: { jornada: "M", funcion: "Sup", duracion: "C" },
  TcSupE: { jornada: "T", funcion: "Sup", duracion: "C" },
  NSupE: { jornada: "N", funcion: "Sup", duracion: "N" },
  McSupO: { jornada: "M", funcion: "Sup", duracion: "C" },
  TcSupO: { jornada: "T", funcion: "Sup", duracion: "C" },
  NSupO: { jornada: "N", funcion: "Sup", duracion: "N" },
  McSup: { jornada: "M", funcion: "Sup", duracion: "C" },
  TcSup: { jornada: "T", funcion: "Sup", duracion: "C" },
  NSup: { jornada: "N", funcion: "Sup", duracion: "N" },
  McA2: { jornada: "M", funcion: "", duracion: "C" },
  MlA2: { jornada: "M", funcion: "", duracion: "L" },
  TcA2: { jornada: "T", funcion: "", duracion: "C" },
  TlA2: { jornada: "T", funcion: "", duracion: "L" },
  NA2: { jornada: "N", funcion: "", duracion: "N" },
  McA2e: { jornada: "M", funcion: "", duracion: "C" },
  MlA2e: { jornada: "M", funcion: "", duracion: "L" },
  TcA2e: { jornada: "T", funcion: "", duracion: "C" },
  TlA2e: { jornada: "T", funcion: "", duracion: "L" },
  NA2e: { jornada: "N", funcion: "", duracion: "N" },
  MC05: { jornada: "M", funcion: "", duracion: "C" },
  MA5: { jornada: "M", funcion: "", duracion: "" },
  TC05: { jornada: "T", funcion: "", duracion: "C" },
  TA5: { jornada: "T", funcion: "", duracion: "" },
  McC06: { jornada: "N", funcion: "", duracion: "C" },
  TcC06: { jornada: "M", funcion: "", duracion: "C" },
  McC07: { jornada: "M", funcion: "", duracion: "C" },
  TcC07: { jornada: "T", funcion: "", duracion: "C" },
  MFS: { jornada: "T", funcion: "", duracion: "" },
  TFS: { jornada: "N", funcion: "", duracion: "" },
  ME: { jornada: "M", funcion: "", duracion: "" },
  TE: { jornada: "M", funcion: "", duracion: "" },
  MSM: { jornada: "T", funcion: "", duracion: "" },
  TSM: { jornada: "T", funcion: "", duracion: "" },
  MFCO1: { jornada: "N", funcion: "", duracion: "" },
  MFCO2: { jornada: "M", funcion: "", duracion: "" },
  FOL: { jornada: "M", funcion: "", duracion: "" },
}