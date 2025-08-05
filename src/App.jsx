//App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';

import AppRoutes from './routes/AppRoutes';
import './App.css';
import { TurnosProvider } from './context/TurnosProvider';
export default function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TurnosProvider>
          <AppRoutes />
        </TurnosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
