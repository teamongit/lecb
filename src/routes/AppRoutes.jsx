// routes/router.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

import PrivateLayout from './PrivateLayout';
import AuthGuard from './AuthGuard';

import LoginPage from '../pages/auth/LoginPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';

import Dashboard from '../pages/user/Dashboard/Dashboard';
import UserNocturnos from '../pages/user/UserNocturnos';
import Publicambios from '../pages/user/Publicambios/Publicambios';
import UserTuturnero from '../pages/user/UserTuturnero';
import UserPidevacas from '../pages/user/UserPidevacas';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminHvoluntarias from '../pages/admin/AdminHvoluntarias';
import FurriNocturnos from '../pages/furri/FurriNocturnos';
import FurriPidevacas from '../pages/furri/FurriPidevacas';
import SuperEscalonada from '../pages/super/SuperEscalonada';
import SuperSectores from '../pages/super/SuperSectores';

import { PublicacionesProvider } from "../context/PublicacionesContext";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ------------- Public Routes ------------- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ------------- Protected Routes ------------- */}
      <Route element={<PrivateLayout />}>
        <Route element={<AuthGuard allowedRoles={Object.values(ROLES)} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/nocturnos" element={<UserNocturnos />} />
          <Route path="/user/pidevacas" element={<UserPidevacas />} />
          <Route
            path="/user/publicambios"
            element={
              <PublicacionesProvider>
                <Publicambios />
              </PublicacionesProvider>
            }
          />
          <Route path="/user/tuturnero" element={<UserTuturnero />} />

          {/* ---- Admin Routes ---- */}
          <Route element={<AuthGuard allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/hvoluntarias" element={<AdminHvoluntarias />} />
          </Route>

          {/* ---- Furri Routes ---- */}
          <Route element={<AuthGuard allowedRoles={[ROLES.FURRI]} />}>
            <Route path="/furri/nocturnos" element={<FurriNocturnos />} />
            <Route path="/furri/pidevacas" element={<FurriPidevacas />} />
          </Route>

          {/* ---- Super Routes ---- */}
          <Route element={<AuthGuard allowedRoles={[ROLES.SUPER]} />}>
            <Route path="/super/escalonada" element={<SuperEscalonada />} />
            <Route path="/super/sectores" element={<SuperSectores />} />
          </Route>
        </Route>
      </Route>

      {/* ------------- Catch-all Redirect ------------- */}
      <Route path="*" element={<Navigate to="/user/publicambios" replace />} />
    </Routes>
  );
};

export default AppRoutes;