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
  
  USUARIO_PERFIL: '/usuario/perfil',
  USUARIO_NOCTURNOS: '/usuario/nocturnos',
  USUARIO_PIDEVACAS: '/usuario/pidevacas',
  USUARIO_PUBLICAMBIOS: '/usuario/publicambios',
  USUARIO_TUTURNERO: '/usuario/tuturnero',

  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_HVOLUNTARIAS: '/admin/hvoluntarias',

  FURRI_NOCTURNOS: '/furri/nocturnos',
  FURRI_PIDEVACAS: '/furri/pidevacas',

  SUPER_ESCALONADA: '/super/escalonada',
  SUPER_SECTORES: '/super/sectores',
};

export const CATEGORIAS = {
  CON : "Controlador",
  INS : "Instructor",
  SUP : "Supervisor",
  IS  : "Inst-Super",
  TIN : "Técn-Inst",
  TS  : "Técn-Super",
  INY : "Instruyendo",
};

export const CATEGORIA_FUNCION = {
  CON : [{ value: "Img", label: "Imaginaria" }],
  INS : [{ value: "Ins", label: "Instructor" }, { value: "Img", label: "Imaginaria" }],
  SUP : [{ value: "Sup", label: "Supervisor" }, { value: "Img", label: "Imaginaria" }],
  IS  : [{ value: "Sup", label: "Supervisor" }, { value: "Ins", label: "Instructor" }, { value: "Img", label: "Imaginaria" }],
  TIN : [{ value: "Ins", label: "Instructor" }, { value: "Img", label: "Imaginaria" }],
  TS  : [{ value: "Sup", label: "Supervisor" }, { value: "Img", label: "Imaginaria" }],
  INY : [],
}

export const FUNCIONES = [
  { value: "Sup", label: "Supervisor" },
  { value: "Ins", label: "Instructor" },
  { value: "Img", label: "Imaginaria" },
];

// Duraciones de cambio
export const DURACIONES = [  
  { value: "", label: "Cualquiera" },
  { value: "C", label: "Corta" },
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
  
export const TURNOS = {
  // Turnos regulares
  Mc:      { servicio: "M", horas: 7.792, funcion: [], duracion: "C" },
  Ml:      { servicio: "M", horas: 8.542, funcion: [], duracion: "L" },
  Tc:      { servicio: "T", horas: 7.792, funcion: [], duracion: "C" },
  Tl:      { servicio: "T", horas: 8.792, funcion: [], duracion: "L" },
  N:       { servicio: "N", horas: 9.292, funcion: [], duracion: "" },

  // Incrementos mañana (imc, iml) e intermedios (IMC, IML)
  imc:     { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  iml:     { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itc:     { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itl:     { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  in:      { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },
  IMC:     { servicio: "M", horas: 8.792, funcion: [], duracion: "C" },
  IML:     { servicio: "M", horas: 9.542, funcion: [], duracion: "L" },
  ITC:     { servicio: "T", horas: 8.792, funcion: [], duracion: "C" },
  ITL:     { servicio: "T", horas: 9.792, funcion: [], duracion: "L" },
  IN:      { servicio: "N", horas: 10.292, funcion: [], duracion: "" },

  // B00
  McB00:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB00:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB00:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB00:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB00:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcB00:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlB00:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcB00:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlB00:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inB00:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },

  // B01
  McB01:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB01:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB01:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB01:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB01:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcB01:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlB01:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcB01:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlB01:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inB01:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },

  // B02
  McB02:   { servicio: "M", horas: 7.5, funcion: [], duracion: "C" },
  MlB02:   { servicio: "M", horas: 8.25, funcion: [], duracion: "L" },
  TcB02:   { servicio: "T", horas: 7.5, funcion: [], duracion: "C" },
  TlB02:   { servicio: "T", horas: 8.5, funcion: [], duracion: "L" },
  NB02:    { servicio: "N", horas: 9, funcion: [], duracion: "" },
  imcB02:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlB02:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcB02:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlB02:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inB02:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },

  // B03
  McB03:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB03:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB03:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB03:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB03:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  IMCB03:  { servicio: "M", horas: 8.667, funcion: [], duracion: "C" },
  IMLB03:  { servicio: "M", horas: 9.417, funcion: [], duracion: "L" },
  ITCB03:  { servicio: "T", horas: 8.667, funcion: [], duracion: "C" },
  ITLB03:  { servicio: "T", horas: 9.667, funcion: [], duracion: "L" },
  INB03:   { servicio: "N", horas: 10.167, funcion: [], duracion: "" },

  // B08
  McB08:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB08:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB08:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB08:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB08:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcB08:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlB08:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcB08:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlB08:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inB08:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },

  // B09(.x) → B09 y B09x
  McB09:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB09:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB09:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB09:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB09:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcB09:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlB09:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcB09:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlB09:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inB09:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },
  IMCB09:  { servicio: "M", horas: 8.667, funcion: [], duracion: "C" },
  IMLB09:  { servicio: "M", horas: 9.417, funcion: [], duracion: "L" },
  ITCB09:  { servicio: "T", horas: 8.667, funcion: [], duracion: "C" },
  ITLB09:  { servicio: "T", horas: 9.667, funcion: [], duracion: "L" },
  INB09:   { servicio: "N", horas: 10.167, funcion: [], duracion: "" },

  McB09x:  { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB09x:  { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB09x:  { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB09x:  { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB09x:   { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcB09x: { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlB09x: { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcB09x: { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlB09x: { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inB09x:  { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },
  IMCB09x: { servicio: "M", horas: 8.667, funcion: [], duracion: "C" },
  IMLB09x: { servicio: "M", horas: 9.417, funcion: [], duracion: "L" },
  ITCB09x: { servicio: "T", horas: 8.667, funcion: [], duracion: "C" },
  ITLB09x: { servicio: "T", horas: 9.667, funcion: [], duracion: "L" },
  INB09x:  { servicio: "N", horas: 10.167, funcion: [], duracion: "" },

  // B10
  McB10:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB10:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB10:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB10:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB10:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcB10:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlB10:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcB10:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlB10:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inB10:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },

  // B11
  McB11:   { servicio: "M", horas: 0, funcion: [], duracion: "C" },
  MlB11:   { servicio: "M", horas: 0, funcion: [], duracion: "L" },
  TcB11:   { servicio: "T", horas: 0, funcion: [], duracion: "C" },
  TlB11:   { servicio: "T", horas: 0, funcion: [], duracion: "L" },
  NB11:    { servicio: "N", horas: 0, funcion: [], duracion: "" },
  imcB11:  { servicio: "M", horas: 0, funcion: ["Img"], duracion: "C" },
  imlB11:  { servicio: "M", horas: 0, funcion: ["Img"], duracion: "L" },
  itcB11:  { servicio: "T", horas: 0, funcion: ["Img"], duracion: "C" },
  itlB11:  { servicio: "T", horas: 0, funcion: ["Img"], duracion: "L" },
  inB11:   { servicio: "N", horas: 0, funcion: ["Img"], duracion: "" },

  // B14
  McB14:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlB14:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcB14:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlB14:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NB14:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcB14:  { servicio: "M", horas: 7.5, funcion: ["Img"], duracion: "C" },
  imlB14:  { servicio: "M", horas: 8.25, funcion: ["Img"], duracion: "L" },
  itcB14:  { servicio: "T", horas: 7.5, funcion: ["Img"], duracion: "C" },
  itlB14:  { servicio: "T", horas: 8.5, funcion: ["Img"], duracion: "L" },
  inB14:   { servicio: "N", horas: 9, funcion: ["Img"], duracion: "" },

  // B15
  McB15:   { servicio: "M", horas: 0, funcion: [], duracion: "C" },
  MlB15:   { servicio: "M", horas: 0, funcion: [], duracion: "L" },
  TcB15:   { servicio: "T", horas: 0, funcion: [], duracion: "C" },
  TlB15:   { servicio: "T", horas: 0, funcion: [], duracion: "L" },
  NB15:    { servicio: "N", horas: 0, funcion: [], duracion: "" },
  imcB15:  { servicio: "M", horas: 0, funcion: ["Img"], duracion: "C" },
  imlB15:  { servicio: "M", horas: 0, funcion: ["Img"], duracion: "L" },
  itcB15:  { servicio: "T", horas: 0, funcion: ["Img"], duracion: "C" },
  itlB15:  { servicio: "T", horas: 0, funcion: ["Img"], duracion: "L" },
  inB15:   { servicio: "N", horas: 0, funcion: ["Img"], duracion: "" },

  // A2
  McA2:    { servicio: "M", horas: 8.042, funcion: ["Ins"], duracion: "C" },
  MlA2:    { servicio: "M", horas: 8.792, funcion: ["Ins"], duracion: "L" },
  TcA2:    { servicio: "T", horas: 8.042, funcion: ["Ins"], duracion: "C" },
  TlA2:    { servicio: "T", horas: 9.042, funcion: ["Ins"], duracion: "L" },
  NA2:     { servicio: "N", horas: 9.542, funcion: ["Ins"], duracion: "" },

  // A2e
  McA2e:   { servicio: "M", horas: 8.042, funcion: ["Ins"], duracion: "C" },
  MlA2e:   { servicio: "M", horas: 8.792, funcion: ["Ins"], duracion: "L" },
  TcA2e:   { servicio: "T", horas: 8.042, funcion: ["Ins"], duracion: "C" },
  TlA2e:   { servicio: "T", horas: 9.042, funcion: ["Ins"], duracion: "L" },
  NA2e:    { servicio: "N", horas: 9.542, funcion: ["Ins"], duracion: "" },

  // A3
  McA3:    { servicio: "M", horas: 8.042, funcion: [], duracion: "C" },
  MlA3:    { servicio: "M", horas: 8.792, funcion: [], duracion: "L" },
  TcA3:    { servicio: "T", horas: 8.042, funcion: [], duracion: "C" },
  TlA3:    { servicio: "T", horas: 9.042, funcion: [], duracion: "L" },
  NA3:     { servicio: "N", horas: 9.542, funcion: [], duracion: "" },

  // iny
  Mciny:   { servicio: "M", horas: 8.042, funcion: [], duracion: "C" },
  Tciny:   { servicio: "T", horas: 8.042, funcion: [], duracion: "C" },

  // Otros
  MC03:    { servicio: "M", horas: 7.5, funcion: [], duracion: "C" },
  TC03:    { servicio: "T", horas: 7.5, funcion: [], duracion: "C" },
  MC04:    { servicio: "M", horas: 7.5, funcion: [], duracion: "C" },
  TC04:    { servicio: "T", horas: 7.5, funcion: [], duracion: "C" },
  MA4:     { servicio: "M", horas: 7.792, funcion: [], duracion: "" },
  McA4:    { servicio: "M", horas: 7.792, funcion: [], duracion: "C" },
  TA4:     { servicio: "T", horas: 7.792, funcion: [], duracion: "" },
  TcA4:    { servicio: "T", horas: 7.792, funcion: [], duracion: "C" },
  MC05:    { servicio: "M", horas: 7.792, funcion: [], duracion: "C" },
  MA5:     { servicio: "M", horas: 7.792, funcion: [], duracion: "" },
  TC05:    { servicio: "T", horas: 7.792, funcion: [], duracion: "C" },
  TA5:     { servicio: "T", horas: 7.792, funcion: [], duracion: "" },
  MFS:     { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  TFS:     { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },

  // CS1
  McCS1:   { servicio: "M", horas: 7.5, funcion: [], duracion: "C" },
  MlCS1:   { servicio: "M", horas: 8.25, funcion: [], duracion: "L" },
  TcCS1:   { servicio: "T", horas: 7.5, funcion: [], duracion: "C" },
  TlCS1:   { servicio: "T", horas: 8.5, funcion: [], duracion: "L" },
  NCS1:    { servicio: "N", horas: 9, funcion: [], duracion: "" },
  imcCS1:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlCS1:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcCS1:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlCS1:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inCS1:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },

  // CSi
  McCSi:   { servicio: "M", horas: 7.667, funcion: [], duracion: "C" },
  MlCSi:   { servicio: "M", horas: 8.417, funcion: [], duracion: "L" },
  TcCSi:   { servicio: "T", horas: 7.667, funcion: [], duracion: "C" },
  TlCSi:   { servicio: "T", horas: 8.667, funcion: [], duracion: "L" },
  NCSi:    { servicio: "N", horas: 9.167, funcion: [], duracion: "" },
  imcCSi:  { servicio: "M", horas: 1.5, funcion: ["Img"], duracion: "C" },
  imlCSi:  { servicio: "M", horas: 1.65, funcion: ["Img"], duracion: "L" },
  itcCSi:  { servicio: "T", horas: 1.5, funcion: ["Img"], duracion: "C" },
  itlCSi:  { servicio: "T", horas: 1.7, funcion: ["Img"], duracion: "L" },
  inCSi:   { servicio: "N", horas: 1.8, funcion: ["Img"], duracion: "" },

  // EX
  McEX:    { servicio: "M", horas: 7.5, funcion: [], duracion: "C" },
  MlEX:    { servicio: "M", horas: 8.25, funcion: [], duracion: "L" },
  TcEX:    { servicio: "T", horas: 7.5, funcion: [], duracion: "C" },
  TlEX:    { servicio: "T", horas: 8.5, funcion: [], duracion: "L" },
  NEX:     { servicio: "N", horas: 9, funcion: [], duracion: "" },

  // LP
  McLP:    { servicio: "M", horas: 0, funcion: [], duracion: "C" },
  MlLP:    { servicio: "M", horas: 0, funcion: [], duracion: "L" },
  TcLP:    { servicio: "T", horas: 0, funcion: [], duracion: "C" },
  TlLP:    { servicio: "T", horas: 0, funcion: [], duracion: "L" },
  NLP:     { servicio: "N", horas: 0, funcion: [], duracion: "" },

  // Turnos simples
  ME:      { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  TE:      { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  MSM:     { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  TSM:     { servicio: "T", horas: 7.5, funcion: [], duracion: "" },

  // B00 a B14 para varios grupos
  MEB00:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MEB01:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MEB09:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MEB09x:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MEB10:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MEB11:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MEB14:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },

  TEB00:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TEB01:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TEB09:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TEB09x:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TEB10:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TEB11:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TEB14:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },

  MSMB00:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MSMB01:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MSMB09:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MSMB09x: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MSMB10:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MSMB11:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MSMB14:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },

  TSMB00:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TSMB01:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TSMB09:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TSMB09x: { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TSMB10:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TSMB11:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TSMB14:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },

  MFCO1B00: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO1B01: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO1B09: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO1B09x:{ servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO1B10: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO1B11: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO1B14: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },

  MFCO2B00: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO2B01: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO2B09: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO2B09x:{ servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO2B10: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO2B11: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MFCO2B14: { servicio: "M", horas: 7.5, funcion: [], duracion: "" },

  MRB00:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MRB01:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MRB09:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MRB09x:  { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MRB10:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MRB11:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },
  MRB14:   { servicio: "M", horas: 7.5, funcion: [], duracion: "" },

  TRB00:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TRB01:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TRB09:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TRB09x:  { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TRB10:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TRB11:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },
  TRB14:   { servicio: "T", horas: 7.5, funcion: [], duracion: "" },

  // Especiales
  CIMA:    { servicio: "", horas: 0, funcion: [], duracion: "" },
  Inglés:  { servicio: "", horas: 0, funcion: [], duracion: "" },
  V:       { servicio: "", horas: 0, funcion: [], duracion: "" },
  Va:      { servicio: "", horas: 0, funcion: [], duracion: "" },
  VAA:     { servicio: "", horas: 0, funcion: [], duracion: "" },
  Vaa:     { servicio: "", horas: 0, funcion: [], duracion: "" },
  P:       { servicio: "", horas: 8, funcion: [], duracion: "" }
};

