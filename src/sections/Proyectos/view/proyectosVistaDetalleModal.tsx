import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';

interface AgregarUsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onAgregar: (dni: string, montoPago: number) => Promise<void>;
}

interface AgregarElectricistaModalProps {
  open: boolean;
  onClose: () => void;
  onAgregar: (dni: string) => Promise<void>;
}


export const AgregarUsuarioModal: React.FC<AgregarUsuarioModalProps> = ({ open, onClose, onAgregar }) => {
  const [dni, setDni] = useState('');
  const [montoPago, setMontoPago] = useState(''); // Mantener como string
  const [error, setError] = useState<string | null>(null);

  const handleInputChangeDni = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value);
  };

  const handleInputChangeMonto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMontoPago(e.target.value); // Mantenerlo como string
  };

  const handleAgregarUsuario = async () => {
    setError(null); // Reiniciar el error antes de intentar agregar el usuario
    if (!dni) {
      setError('El DNI es obligatorio');
      return;
    }

    // Validar que el monto no esté vacío y sea un número
    const monto = parseFloat(montoPago); // Convertir a número
    if (montoPago.trim() === '' || Number.isNaN(monto)) {
      setError('El monto de pago debe ser un número válido y no puede estar vacío');
      return;
    }

    try {
      await onAgregar(dni, monto); // Llamar a la función onAgregar que devuelve una promesa
      handleCloseModal();
    } catch (err) {
      console.error(err);
      // Comprobar si el error tiene una respuesta y capturar el mensaje de error
      if (err.response && err.response.data) {
        setError(err.response.data.error); // Captura el error devuelto por la API
      } else {
        setError('Error desconocido al agregar el usuario'); // Mensaje de error general
      }
    }
  };

  const handleCloseModal = () => {
    onClose();
    setDni('');
    setMontoPago(''); // Reiniciar a cadena vacía
    setError(null); // Reiniciar el mensaje de error al cerrar el modal
  };

  return (
    <Dialog open={open} onClose={handleCloseModal}>
      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="DNI"
          type="text"
          fullWidth
          variant="outlined"
          value={dni}
          onChange={handleInputChangeDni}
        />
        <TextField
          margin="dense"
          label="Monto de Pago"
          type="text" // Mantener el tipo como texto
          fullWidth
          variant="outlined"
          value={montoPago}
          onChange={handleInputChangeMonto}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAgregarUsuario} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export const AgregarElectricistaModal: React.FC<AgregarElectricistaModalProps> = ({ open, onClose, onAgregar }) => {
  const [dni, setDni] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChangeDni = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value);
  };


  const handleAgregarUsuario = async () => {
    setError(null); // Reiniciar el error antes de intentar agregar el usuario
    if (!dni) {
      setError('El DNI es obligatorio');
      return;
    }


    try {
      await onAgregar(dni); // Llamar a la función onAgregar que devuelve una promesa
      handleCloseModal();
    } catch (err) {
      console.error(err);
      // Comprobar si el error tiene una respuesta y capturar el mensaje de error
      if (err.response && err.response.data) {
        setError(err.response.data.error); // Captura el error devuelto por la API
      } else {
        setError('Error desconocido al agregar el usuario'); // Mensaje de error general
      }
    }
  };

  const handleCloseModal = () => {
    onClose();
    setDni('');
    setError(null); // Reiniciar el mensaje de error al cerrar el modal
  };

  return (
    <Dialog open={open} onClose={handleCloseModal}>
      <DialogTitle>Agregar Nuevo Electricista</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="DNI"
          type="text"
          fullWidth
          variant="outlined"
          value={dni}
          onChange={handleInputChangeDni}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAgregarUsuario} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};




