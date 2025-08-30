//App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';

import AppRoutes from './routes/AppRoutes';
import './App.css';
import { TurnosProvider } from './context/TurnosProvider';
// import FirebaseMessagingTest from './components/FirebaseMessaging';
import { ToastProvider } from './context/ToastContext';

export default function App () {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <TurnosProvider>          
            <AppRoutes />
          </TurnosProvider>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}
