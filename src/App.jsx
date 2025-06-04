import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { DatosAppsProvider } from "./context/DatosAppsContext";
import AppRoutes from './routes/AppRoutes';
import './App.css';
export default function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DatosAppsProvider>
          <AppRoutes />
        </DatosAppsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
