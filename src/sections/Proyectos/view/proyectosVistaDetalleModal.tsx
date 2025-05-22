import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface AgregarUsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onAgregar: (dni: string, montoPago: number, montoCuota: string, equipoAsingado: string , montoAhorrado: number) => Promise<void>;
}

interface AgregarElectricistaModalProps {
  open: boolean;
  onClose: () => void;
  onAgregar: (dni: string) => Promise<void>;
}

export const AgregarUsuarioModal: React.FC<AgregarUsuarioModalProps> = ({ open, onClose, onAgregar }) => {
  const [dni, setDni] = useState('');
  const [montoPago, setMontoPago] = useState('');
  const [montoCuota, setMontoCuota] = useState('');
  const [montoAhorrado, setMontoAhorrado] = useState(0);
  const [equipoAsignado, setEquipoAsignado] = useState('');
  const [dniError, setDniError] = useState<string | null>(null);
  const [montoError, setMontoError] = useState<string | null>(null);
  const [montoCuotaError, setMontoCuotaError] = useState<string | null>(null);
  const [montoAhorradoError, setMontoAhorradoError] = useState<string | null>(null);
  const [equipoAsignadoError, setEquipoAsignadoError] = useState<string | null>(null);

  const handleInputChangeDni = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value);
    setDniError(null);
  };

  const handleInputChangeMonto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMontoPago(e.target.value);
    setMontoError(null);
  };

   const handleInputChangeEquipoAsignado = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEquipoAsignado(e.target.value);
    setMontoError(null);
  };

  const handleInputChangeMontoCuota = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMontoCuota(value);  // Guarda siempre el string original
  
    const numericValue = parseFloat(value);
    if (value.trim() !== '' && Number.isNaN(numericValue)) {
      setMontoCuotaError('Ingrese un número válido');
    } else {
      setMontoCuotaError(null);
    }
  };

  const handleInputChangeMontoAhorrado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(e.target.value);
  
    if (Number.isNaN(numericValue)) {
      setMontoAhorradoError('Ingrese un número válido');
    } else {
      setMontoAhorrado(numericValue);
      setMontoAhorradoError(null);
    }
  };


  const handleAgregarUsuario = async () => {
    setDniError(null);
    setMontoError(null);
    setMontoCuotaError(null);
    setMontoAhorradoError(null);
    setEquipoAsignadoError(null);
    console.log('chaschaschas', montoAhorrado, montoCuota)
    if (!dni) {
      setDniError('El DNI es obligatorio');
      return;
    }

    const monto = parseFloat(montoPago);
    if (montoPago.trim() === '' || Number.isNaN(monto)) {
      setMontoError('El monto de pago debe ser un número válido y no puede estar vacío');
      return;
    }

    if (Number.isNaN(montoCuota)) {
      setMontoCuotaError('El monto de la cuota debe ser un número válido y no puede estar vacío');
      return;
    }

    if ( Number.isNaN(montoAhorrado)) {
      setMontoAhorradoError('El monto ahorrado debe ser un número válido y no puede estar vacío');
      return;
    }

    

    try {
      await onAgregar(dni, monto, montoCuota.toString(), equipoAsignado , montoAhorrado);
      
      handleCloseModal();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setDniError(err.response.data.error);
      } else {
        setDniError('Error desconocido al agregar el usuario');
      }
    }
  };

  const handleCloseModal = () => {
    onClose();
    setDni('');
    setMontoPago('');
    setMontoCuota('');
    setMontoAhorrado(0);
    setDniError(null);
    setMontoError(null);
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="DNI"
          type="text"
          fullWidth
          variant="outlined"
          value={dni}
          onChange={handleInputChangeDni}
          error={Boolean(dniError)}
          helperText={dniError || ''}
        />
        <TextField
          margin="dense"
          label="Monto de Pago"
          type="text"
          fullWidth
          variant="outlined"
          value={montoPago}
          onChange={handleInputChangeMonto}
          error={Boolean(montoError)}
          helperText={montoError || ''}
        />
        <TextField
          margin="dense"
          label="Cantidad de Cuotas"
          type="text"
          fullWidth
          variant="outlined"
          value={montoCuota}
          onChange={handleInputChangeMontoCuota}
          error={Boolean(montoCuotaError)}
          helperText={montoCuotaError}
        />
        <TextField
          margin="dense"
          label="Monto Ahorrado"
          type="text"
          fullWidth
          variant="outlined"
          value={montoAhorrado}
          onChange={handleInputChangeMontoAhorrado}
          error={Boolean(montoAhorradoError)}
          helperText={montoAhorradoError}
        />
        <TextField
          margin="dense"
          label="Sistema Instalado"
          type="text"
          fullWidth
          variant="outlined"
          value={equipoAsignado}
          onChange={handleInputChangeEquipoAsignado}
          error={Boolean(equipoAsignadoError)}
          helperText={equipoAsignadoError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleAgregarUsuario} color="primary" variant="contained">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AgregarElectricistaModal: React.FC<AgregarElectricistaModalProps> = ({ open, onClose, onAgregar }) => {
  const [dni, setDni] = useState('');
  const [dniError, setDniError] = useState<string | null>(null);

  const handleInputChangeDni = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value);
    setDniError(null);
  };

  const handleAgregarUsuario = async () => {
    setDniError(null);

    if (!dni) {
      setDniError('El DNI es obligatorio');
      return;
    }

    try {
      await onAgregar(dni);
      handleCloseModal();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setDniError(err.response.data.error);
      } else {
        setDniError('Error desconocido al agregar el usuario');
      }
    }
  };

  const handleCloseModal = () => {
    onClose();
    setDni('');
    setDniError(null);
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle>Agregar Nuevo Electricista</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="DNI"
          type="text"
          fullWidth
          variant="outlined"
          value={dni}
          onChange={handleInputChangeDni}
          error={Boolean(dniError)}
          helperText={dniError || ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleAgregarUsuario} color="primary" variant="contained">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
