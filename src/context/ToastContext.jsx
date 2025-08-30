// ToastContext.js
import { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material"; // Asegúrate de tener @mui/material instalado

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [autoHideDuration, setAutoHideDuration] = useState(null);
 

  const triggerToast = useCallback((msg, { severity, autoHideDuration = 3000 } = {}) => {    
    setMessage(msg);
    setSeverity(severity); 
    setAutoHideDuration(autoHideDuration);
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}

      {/* --- Notificación tipo Toast con MUI --- */}
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}         
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);