import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

interface AlertContextType {
  showAlert: (message: string, severity: AlertColor) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; severity: AlertColor } | null>(null);
  const [open, setOpen] = useState(false);

  const showAlert = (message: string, severity: AlertColor) => {
    setAlert({ message, severity });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useMemo para evitar que el valor de contexto cambie en cada render
  const value = useMemo(() => ({ showAlert }), []);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Cambiado a 'right'
      >
        {alert ? (
          <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        ) : (
          <></>
        )}
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
