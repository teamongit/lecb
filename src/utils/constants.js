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

export const TURNOS = {
  // Turnos regulares
  Mc:      { jornada: "M", horas: 7.792 },
  Ml:      { jornada: "M", horas: 8.542 },
  Tc:      { jornada: "T", horas: 7.792 },
  Tl:      { jornada: "T", horas: 8.792 },
  N:       { jornada: "N", horas: 9.292 },

  // Incrementos mañana (imc, iml) e intermedios (IMC, IML)
  imc:     { jornada: "M", horas: 1.5 },
  iml:     { jornada: "M", horas: 1.65 },
  itc:     { jornada: "T", horas: 1.5 },
  itl:     { jornada: "T", horas: 1.7 },
  in:      { jornada: "N", horas: 1.8 },
  IMC:     { jornada: "M", horas: 8.792 },
  IML:     { jornada: "M", horas: 9.542 },
  ITC:     { jornada: "T", horas: 8.792 },
  ITL:     { jornada: "T", horas: 9.792 },
  IN:      { jornada: "N", horas: 10.292 },

  // B00
  McB00:   { jornada: "M", horas: 7.667 },
  MlB00:   { jornada: "M", horas: 8.417 },
  TcB00:   { jornada: "T", horas: 7.667 },
  TlB00:   { jornada: "T", horas: 8.667 },
  NB00:    { jornada: "N", horas: 9.167 },
  imcB00:  { jornada: "M", horas: 1.5 },
  imlB00:  { jornada: "M", horas: 1.65 },
  itcB00:  { jornada: "T", horas: 1.5 },
  itlB00:  { jornada: "T", horas: 1.7 },
  inB00:   { jornada: "N", horas: 1.8 },

  // B01
  McB01:   { jornada: "M", horas: 7.667 },
  MlB01:   { jornada: "M", horas: 8.417 },
  TcB01:   { jornada: "T", horas: 7.667 },
  TlB01:   { jornada: "T", horas: 8.667 },
  NB01:    { jornada: "N", horas: 9.167 },
  imcB01:  { jornada: "M", horas: 1.5 },
  imlB01:  { jornada: "M", horas: 1.65 },
  itcB01:  { jornada: "T", horas: 1.5 },
  itlB01:  { jornada: "T", horas: 1.7 },
  inB01:   { jornada: "N", horas: 1.8 },

  // B02
  McB02:   { jornada: "M", horas: 7.5 },
  MlB02:   { jornada: "M", horas: 8.25 },
  TcB02:   { jornada: "T", horas: 7.5 },
  TlB02:   { jornada: "T", horas: 8.5 },
  NB02:    { jornada: "N", horas: 9 },
  imcB02:  { jornada: "M", horas: 1.5 },
  imlB02:  { jornada: "M", horas: 1.65 },
  itcB02:  { jornada: "T", horas: 1.5 },
  itlB02:  { jornada: "T", horas: 1.7 },
  inB02:   { jornada: "N", horas: 1.8 },

  // B03
  McB03:   { jornada: "M", horas: 7.667 },
  MlB03:   { jornada: "M", horas: 8.417 },
  TcB03:   { jornada: "T", horas: 7.667 },
  TlB03:   { jornada: "T", horas: 8.667 },
  NB03:    { jornada: "N", horas: 9.167 },
  IMCB03:  { jornada: "M", horas: 8.667 },
  IMLB03:  { jornada: "M", horas: 9.417 },
  ITCB03:  { jornada: "T", horas: 8.667 },
  ITLB03:  { jornada: "T", horas: 9.667 },
  INB03:   { jornada: "N", horas: 10.167 },

  // B08
  McB08:   { jornada: "M", horas: 7.667 },
  MlB08:   { jornada: "M", horas: 8.417 },
  TcB08:   { jornada: "T", horas: 7.667 },
  TlB08:   { jornada: "T", horas: 8.667 },
  NB08:    { jornada: "N", horas: 9.167 },
  imcB08:  { jornada: "M", horas: 1.5 },
  imlB08:  { jornada: "M", horas: 1.65 },
  itcB08:  { jornada: "T", horas: 1.5 },
  itlB08:  { jornada: "T", horas: 1.7 },
  inB08:   { jornada: "N", horas: 1.8 },

  // B09(.x) → B09 y B09x
  McB09:   { jornada: "M", horas: 7.667 },
  MlB09:   { jornada: "M", horas: 8.417 },
  TcB09:   { jornada: "T", horas: 7.667 },
  TlB09:   { jornada: "T", horas: 8.667 },
  NB09:    { jornada: "N", horas: 9.167 },
  imcB09:  { jornada: "M", horas: 1.5 },
  imlB09:  { jornada: "M", horas: 1.65 },
  itcB09:  { jornada: "T", horas: 1.5 },
  itlB09:  { jornada: "T", horas: 1.7 },
  inB09:   { jornada: "N", horas: 1.8 },
  IMCB09:  { jornada: "M", horas: 8.667 },
  IMLB09:  { jornada: "M", horas: 9.417 },
  ITCB09:  { jornada: "T", horas: 8.667 },
  ITLB09:  { jornada: "T", horas: 9.667 },
  INB09:   { jornada: "N", horas: 10.167 },

  McB09x:  { jornada: "M", horas: 7.667 },
  MlB09x:  { jornada: "M", horas: 8.417 },
  TcB09x:  { jornada: "T", horas: 7.667 },
  TlB09x:  { jornada: "T", horas: 8.667 },
  NB09x:   { jornada: "N", horas: 9.167 },
  imcB09x: { jornada: "M", horas: 1.5 },
  imlB09x: { jornada: "M", horas: 1.65 },
  itcB09x: { jornada: "T", horas: 1.5 },
  itlB09x: { jornada: "T", horas: 1.7 },
  inB09x:  { jornada: "N", horas: 1.8 },
  IMCB09x: { jornada: "M", horas: 8.667 },
  IMLB09x: { jornada: "M", horas: 9.417 },
  ITCB09x: { jornada: "T", horas: 8.667 },
  ITLB09x: { jornada: "T", horas: 9.667 },
  INB09x:  { jornada: "N", horas: 10.167 },

  // B10
  McB10:   { jornada: "M", horas: 7.667 },
  MlB10:   { jornada: "M", horas: 8.417 },
  TcB10:   { jornada: "T", horas: 7.667 },
  TlB10:   { jornada: "T", horas: 8.667 },
  NB10:    { jornada: "N", horas: 9.167 },
  imcB10:  { jornada: "M", horas: 1.5 },
  imlB10:  { jornada: "M", horas: 1.65 },
  itcB10:  { jornada: "T", horas: 1.5 },
  itlB10:  { jornada: "T", horas: 1.7 },
  inB10:   { jornada: "N", horas: 1.8 },

  // B11
  McB11:   { jornada: "M", horas: 0 },
  MlB11:   { jornada: "M", horas: 0 },
  TcB11:   { jornada: "T", horas: 0 },
  TlB11:   { jornada: "T", horas: 0 },
  NB11:    { jornada: "N", horas: 0 },
  imcB11:  { jornada: "M", horas: 0 },
  imlB11:  { jornada: "M", horas: 0 },
  itcB11:  { jornada: "T", horas: 0 },
  itlB11:  { jornada: "T", horas: 0 },
  inB11:   { jornada: "N", horas: 0 },

  // B14
  McB14:   { jornada: "M", horas: 7.667 },
  MlB14:   { jornada: "M", horas: 8.417 },
  TcB14:   { jornada: "T", horas: 7.667 },
  TlB14:   { jornada: "T", horas: 8.667 },
  NB14:    { jornada: "N", horas: 9.167 },
  imcB14:  { jornada: "M", horas: 7.5 },
  imlB14:  { jornada: "M", horas: 8.25 },
  itcB14:  { jornada: "T", horas: 7.5 },
  itlB14:  { jornada: "T", horas: 8.5 },
  inB14:   { jornada: "N", horas: 9 },

  // B15
  McB15:   { jornada: "M", horas: 0 },
  MlB15:   { jornada: "M", horas: 0 },
  TcB15:   { jornada: "T", horas: 0 },
  TlB15:   { jornada: "T", horas: 0 },
  NB15:    { jornada: "N", horas: 0 },
  imcB15:  { jornada: "M", horas: 0 },
  imlB15:  { jornada: "M", horas: 0 },
  itcB15:  { jornada: "T", horas: 0 },
  itlB15:  { jornada: "T", horas: 0 },
  inB15:   { jornada: "N", horas: 0 },

  // A2
  McA2:    { jornada: "M", horas: 8.042 },
  MlA2:    { jornada: "M", horas: 8.792 },
  TcA2:    { jornada: "T", horas: 8.042 },
  TlA2:    { jornada: "T", horas: 9.042 },
  NA2:     { jornada: "N", horas: 9.542 },

  // A2e
  McA2e:   { jornada: "M", horas: 8.042 },
  MlA2e:   { jornada: "M", horas: 8.792 },
  TcA2e:   { jornada: "T", horas: 8.042 },
  TlA2e:   { jornada: "T", horas: 9.042 },
  NA2e:    { jornada: "N", horas: 9.542 },

  // A3
  McA3:    { jornada: "M", horas: 8.042 },
  MlA3:    { jornada: "M", horas: 8.792 },
  TcA3:    { jornada: "T", horas: 8.042 },
  TlA3:    { jornada: "T", horas: 9.042 },
  NA3:     { jornada: "N", horas: 9.542 },

  // iny
  Mciny:   { jornada: "M", horas: 8.042 },
  Tciny:   { jornada: "T", horas: 8.042 },

  // Otros
  MC03:    { jornada: "M", horas: 7.5 },
  TC03:    { jornada: "T", horas: 7.5 },
  MC04:    { jornada: "M", horas: 7.5 },
  TC04:    { jornada: "T", horas: 7.5 },
  MA4:     { jornada: "M", horas: 7.792 },
  McA4:    { jornada: "M", horas: 7.792 },
  TA4:     { jornada: "T", horas: 7.792 },
  TcA4:    { jornada: "T", horas: 7.792 },
  MC05:    { jornada: "M", horas: 7.792 },
  MA5:     { jornada: "M", horas: 7.792 },
  TC05:    { jornada: "T", horas: 7.792 },
  TA5:     { jornada: "T", horas: 7.792 },
  MFS:     { jornada: "M", horas: 7.667 },
  TFS:     { jornada: "T", horas: 7.667 },

  // CS1
  McCS1:   { jornada: "M", horas: 7.5 },
  MlCS1:   { jornada: "M", horas: 8.25 },
  TcCS1:   { jornada: "T", horas: 7.5 },
  TlCS1:   { jornada: "T", horas: 8.5 },
  NCS1:    { jornada: "N", horas: 9 },
  imcCS1:  { jornada: "M", horas: 1.5 },
  imlCS1:  { jornada: "M", horas: 1.65 },
  itcCS1:  { jornada: "T", horas: 1.5 },
  itlCS1:  { jornada: "T", horas: 1.7 },
  inCS1:   { jornada: "N", horas: 1.8 },

  // CSi
  McCSi:   { jornada: "M", horas: 7.667 },
  MlCSi:   { jornada: "M", horas: 8.417 },
  TcCSi:   { jornada: "T", horas: 7.667 },
  TlCSi:   { jornada: "T", horas: 8.667 },
  NCSi:    { jornada: "N", horas: 9.167 },
  imcCSi:  { jornada: "M", horas: 1.5 },
  imlCSi:  { jornada: "M", horas: 1.65 },
  itcCSi:  { jornada: "T", horas: 1.5 },
  itlCSi:  { jornada: "T", horas: 1.7 },
  inCSi:   { jornada: "N", horas: 1.8 },

  // EX
  McEX:    { jornada: "M", horas: 7.5 },
  MlEX:    { jornada: "M", horas: 8.25 },
  TcEX:    { jornada: "T", horas: 7.5 },
  TlEX:    { jornada: "T", horas: 8.5 },
  NEX:     { jornada: "N", horas: 9 },

  // LP
  McLP:    { jornada: "M", horas: 0 },
  MlLP:    { jornada: "M", horas: 0 },
  TcLP:    { jornada: "T", horas: 0 },
  TlLP:    { jornada: "T", horas: 0 },
  NLP:     { jornada: "N", horas: 0 },

  // Turnos simples
  ME:      { jornada: "M", horas: 7.5 },
  TE:      { jornada: "T", horas: 7.5 },
  MSM:     { jornada: "M", horas: 7.5 },
  TSM:     { jornada: "T", horas: 7.5 },

  // B00 a B14 para varios grupos
  MEB00:   { jornada: "M", horas: 7.5 },
  MEB01:   { jornada: "M", horas: 7.5 },
  MEB09:   { jornada: "M", horas: 7.5 },
  MEB09x:  { jornada: "M", horas: 7.5 },
  MEB10:   { jornada: "M", horas: 7.5 },
  MEB11:   { jornada: "M", horas: 7.5 },
  MEB14:   { jornada: "M", horas: 7.5 },

  TEB00:   { jornada: "T", horas: 7.5 },
  TEB01:   { jornada: "T", horas: 7.5 },
  TEB09:   { jornada: "T", horas: 7.5 },
  TEB09x:  { jornada: "T", horas: 7.5 },
  TEB10:   { jornada: "T", horas: 7.5 },
  TEB11:   { jornada: "T", horas: 7.5 },
  TEB14:   { jornada: "T", horas: 7.5 },

  MSMB00:  { jornada: "M", horas: 7.5 },
  MSMB01:  { jornada: "M", horas: 7.5 },
  MSMB09:  { jornada: "M", horas: 7.5 },
  MSMB09x: { jornada: "M", horas: 7.5 },
  MSMB10:  { jornada: "M", horas: 7.5 },
  MSMB11:  { jornada: "M", horas: 7.5 },
  MSMB14:  { jornada: "M", horas: 7.5 },

  TSMB00:  { jornada: "T", horas: 7.5 },
  TSMB01:  { jornada: "T", horas: 7.5 },
  TSMB09:  { jornada: "T", horas: 7.5 },
  TSMB09x: { jornada: "T", horas: 7.5 },
  TSMB10:  { jornada: "T", horas: 7.5 },
  TSMB11:  { jornada: "T", horas: 7.5 },
  TSMB14:  { jornada: "T", horas: 7.5 },

  MFCO1B00: { jornada: "M", horas: 7.5 },
  MFCO1B01: { jornada: "M", horas: 7.5 },
  MFCO1B09: { jornada: "M", horas: 7.5 },
  MFCO1B09x:{ jornada: "M", horas: 7.5 },
  MFCO1B10: { jornada: "M", horas: 7.5 },
  MFCO1B11: { jornada: "M", horas: 7.5 },
  MFCO1B14: { jornada: "M", horas: 7.5 },

  MFCO2B00: { jornada: "M", horas: 7.5 },
  MFCO2B01: { jornada: "M", horas: 7.5 },
  MFCO2B09: { jornada: "M", horas: 7.5 },
  MFCO2B09x:{ jornada: "M", horas: 7.5 },
  MFCO2B10: { jornada: "M", horas: 7.5 },
  MFCO2B11: { jornada: "M", horas: 7.5 },
  MFCO2B14: { jornada: "M", horas: 7.5 },

  MRB00:   { jornada: "M", horas: 7.5 },
  MRB01:   { jornada: "M", horas: 7.5 },
  MRB09:   { jornada: "M", horas: 7.5 },
  MRB09x:  { jornada: "M", horas: 7.5 },
  MRB10:   { jornada: "M", horas: 7.5 },
  MRB11:   { jornada: "M", horas: 7.5 },
  MRB14:   { jornada: "M", horas: 7.5 },

  TRB00:   { jornada: "T", horas: 7.5 },
  TRB01:   { jornada: "T", horas: 7.5 },
  TRB09:   { jornada: "T", horas: 7.5 },
  TRB09x:  { jornada: "T", horas: 7.5 },
  TRB10:   { jornada: "T", horas: 7.5 },
  TRB11:   { jornada: "T", horas: 7.5 },
  TRB14:   { jornada: "T", horas: 7.5 },

  // Especiales
  CIMA:    { jornada: "M", horas: 0 },
  Inglés:  { jornada: "M", horas: 0 },
  V:       { jornada: "M", horas: 0 },
  Va:      { jornada: "M", horas: 0 },
  VAA:     { jornada: "M", horas: 0 },
  Vaa:     { jornada: "M", horas: 0 },
  P:       { jornada: "M", horas: 8 }
};

