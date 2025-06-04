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
  DASHBOARD: '/dashboard',
  UNAUTHORIZED: '/unauthorized',
  
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_HVOLUNTARIAS: '/admin/hvoluntarias',

  FURRI_NOCTURNOS: '/furri/nocturnos',
  FURRI_PIDEVACAS: '/furri/pidevacas',

  SUPER_ESCALONADA: '/super/escalonada',
  SUPER_SECTORES: '/super/sectores'
};

// Otros valores globales (puedes agregar más si lo necesitas)
// export const APP_NAME = 'MiWebApp';
// export const DATE_FORMAT = 'DD/MM/YYYY';
