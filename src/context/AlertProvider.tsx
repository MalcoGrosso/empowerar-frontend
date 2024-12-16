import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

interface AlertContextType {
  showAlert: (message: string, severity: AlertColor) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; severity: AlertColor } | null>(null);

  const showAlert = useCallback((message: string, severity: AlertColor) => {
    const alertData = { message, severity };
    setAlert(alertData);
    // Guardar en localStorage para persistencia temporal
    localStorage.setItem('alert', JSON.stringify(alertData));
  }, []);

  const handleClose = useCallback(() => {
    setAlert(null);
    // Eliminar el alert del localStorage al cerrarse
    localStorage.removeItem('alert');
  }, []);

  useEffect(() => {
    // Recuperar alerta desde localStorage al montar el componente
    const storedAlert = localStorage.getItem('alert');
    if (storedAlert) {
      setAlert(JSON.parse(storedAlert));
      // Eliminar la alerta del localStorage inmediatamente después de cargarla
      localStorage.removeItem('alert');
    }
  }, []);

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!alert} // Abierto si hay alerta
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {alert ? (
          <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
