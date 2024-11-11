import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Typography, Box } from '@mui/material';

interface EditarMontoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (montoPago: number) => Promise<void>;
  montoPago: number;
  nombre: string;
  dni: string;
}

const EditarMontoModal: React.FC<EditarMontoModalProps> = ({ open, onClose, onSave, montoPago, nombre, dni }) => {
  const [monto, setMonto] = useState<string>(montoPago.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMonto(montoPago.toString());
      setError(null);
    }
  }, [open, montoPago]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonto(e.target.value);
  };

  const handleSave = async () => {
    setError(null);
    const parsedMonto = parseFloat(monto);
    if (Number.isNaN(parsedMonto) || monto.trim() === '') {
      setError('El monto de pago debe ser un número válido');
      return;
    }
    await onSave(parsedMonto);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Monto de Pago</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1"><strong>Nombre:</strong> {nombre}</Typography>
          <Typography variant="body1"><strong>DNI:</strong> {dni}</Typography>
        </Box>
        <TextField
          label="Monto de Pago"
          type="number"
          fullWidth
          variant="outlined"
          value={monto}
          onChange={handleInputChange}
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
