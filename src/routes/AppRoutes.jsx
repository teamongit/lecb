// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES, ROUTES } from '../utils/constants';


import Privado from './Privado';
import AuthGuard from './AuthGuard';

import Login from '../pages/auth/Login';
import NoAutorizado from '../pages/auth/NoAutorizado';

import Perfil from '../pages/Perfil/Perfil';
// import UserNocturnos from '../pages/user/UserNocturnos';
import Publicambios from '../pages/Publicambios/Publicambios';
import Tuturnero from '../pages/Tuturnero/Tuturnero';
// import UserPidevacas from '../pages/user/UserPidevacas';
import { Pidevacas } from '../pages/Pidevacas/Pidevacas';

// import AdminUsuarios from '../pages/admin/AdminUsuarios';
// import AdminHvoluntarias from '../pages/admin/AdminHvoluntarias';
// import FurriNocturnos from '../pages/furri/FurriNocturnos';
import FurriPidevacas from '../pages/Pidevacas/FurriPidevacas';
// import SuperEscalonada from '../pages/super/SuperEscalonada';
// import SuperSectores from '../pages/super/SuperSectores';


import { useAuth } from '../hooks/useAuth';
import { TurnosProvider } from '../context/TurnosProvider';
import { VacacionesProvider } from '../context/VacacionesContext';

const AppRoutes = () => {
  const { autenticado, usuario } = useAuth();
  return (
    <Routes>
      {/* ------------- Public Routes ------------- */}
      <Route path={ROUTES.LOGIN} element={
        autenticado && usuario
          ? <Navigate to={ROUTES.USUARIO_PERFIL} replace />
          : <Login />
        } 
      />
      <Route path={ROUTES.NOAUTORIZADO} element={<NoAutorizado />} />

      {/* ------------- Protected Routes ------------- */}
      <Route element={<Privado />}>
        {/* Rutas comunes para todos los roles */}
        <Route element={<AuthGuard rolesPermitidos={Object.values(ROLES)} />}>
          <Route path={ROUTES.USUARIO_PERFIL} element={<Perfil />} />
          {/* <Route path={ROUTES.USUARIO_NOCTURNOS} element={<UserNocturnos />} /> */}
          <Route path={ROUTES.USUARIO_PIDEVACAS} element={<Pidevacas />} />
          <Route path={ROUTES.USUARIO_PUBLICAMBIOS} element={<Publicambios />}/>
          <Route path={ROUTES.USUARIO_TUTURNERO} element={<Tuturnero />}/>
          

          {/* ---- Admin Routes ---- */}
          {/* <Route element={<AuthGuard rolesPermitidos={[ROLES.ADMIN]} />}>
            <Route path={ROUTES.ADMIN_USUARIOS} element={<AdminUsuarios />} />
            <Route path={ROUTES.ADMIN_HVOLUNTARIAS} element={<AdminHvoluntarias />} />
          </Route> */}

          {/* ---- Furri Routes ---- */}
          <Route element={<AuthGuard rolesPermitidos={[ROLES.FURRI]} />}>
            {/* <Route path={ROUTES.FURRI_NOCTURNOS} element={<FurriNocturnos />} /> */}
            <Route path={ROUTES.FURRI_PIDEVACAS} element={<VacacionesProvider><FurriPidevacas/></VacacionesProvider> } />
          </Route>

          {/* ---- Super Routes ---- */}
          {/* <Route element={<AuthGuard rolesPermitidos={[ROLES.SUPER]} />}>
            <Route path={ROUTES.SUPER_ESCALONADA} element={<SuperEscalonada />} />
            <Route path={ROUTES.SUPER_SECTORES} element={<SuperSectores />} />
          </Route> */}
        </Route>
      </Route>

      {/* ------------- Catch-all Redirect ------------- */}
      <Route path="*" element={
        autenticado && usuario 
          ? <Navigate to={ROUTES.USUARIO_PUBLICAMBIOS} replace />
          : <Navigate to={ROUTES.LOGIN} replace />
      } />
    </Routes>
  );
};

export default AppRoutes;