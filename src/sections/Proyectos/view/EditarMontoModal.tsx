import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box } from '@mui/material';

interface EditarMontoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (montoPago: number,montoCuota: string, montoAhorrado: number) => Promise<void>;
  montoPago: number;
  montoCuota: string;
  montoAhorrado: number;
  nombre: string;
  dni: string;
}

const EditarMontoModal: React.FC<EditarMontoModalProps> = ({ open, onClose, onSave, montoPago, nombre, dni, montoCuota, montoAhorrado }) => {
  const [monto, setMonto] = useState<string>(montoPago.toString());
  const [montoC, setMontoCuota] = useState<string>(montoCuota.toString());
  const [montoA, setMontoAhorrado] = useState<string>(montoAhorrado.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMonto(montoPago.toString());
      setMontoCuota(montoCuota.toString());
      setMontoAhorrado(montoAhorrado.toString());
      setError(null);
    }
  }, [open, montoPago, montoCuota, montoAhorrado]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonto(e.target.value);
  };

  const handleInputChangeMontoCuota = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMontoCuota(e.target.value);
  };

  const handleInputChangeMontoAhorrado = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMontoAhorrado(e.target.value);
  };

  const handleSave = async () => {
    setError(null);
    const parsedMonto = parseFloat(monto);
    const parsedMontoCuota = parseFloat(montoC);
    const parsedMontoAhorrado = parseFloat(montoA);

    if (
      Number.isNaN(parsedMonto) ||
      Number.isNaN(parsedMontoCuota) ||
      Number.isNaN(parsedMontoAhorrado)
    ) {
      setError('Todos los montos deben ser números válidos');
      return;
    }

    await onSave(parsedMonto, montoC, parsedMontoAhorrado);
      };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Monto de Pago</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1"><strong>Nombre:</strong> {nombre}</Typography>
          <Typography variant="body1"><strong>DNI:</strong> {dni}</Typography>
        </Box>
        <TextField
          label="Monto de Pago (Mercado Pago)"
          type="number"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={monto}
          onChange={handleInputChange}
          error={Boolean(error)} // Activa el estado de error
          helperText={error || ''} // Muestra el mensaje debajo del input
        />
        <TextField
          label="Cantidad de Cuotas"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={montoC}
          onChange={handleInputChangeMontoCuota}
          error={Boolean(error)} // Activa el estado de error
          helperText={error || ''} // Muestra el mensaje debajo del input
        />
        <TextField
          label="Monto Ahorrado"
          type="number"
          fullWidth
          variant="outlined"
          value={montoA}
          onChange={handleInputChangeMontoAhorrado}
          error={Boolean(error)} // Activa el estado de error
          helperText={error || ''} // Muestra el mensaje debajo del input
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary" variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarMontoModal;
