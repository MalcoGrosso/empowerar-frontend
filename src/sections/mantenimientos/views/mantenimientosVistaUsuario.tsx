import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Grid, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useMantenimientos } from '../../../context/mantenimientoProvider';

interface FormData {
  id?: number;
  usuariosProyectosId: number;
  electricistasProyectosId: number;
  observaciones: string;
  campo1: string;
  campo2: string;
  campo3: string;
  campo4: string;
  campo5: string;
  campo6: string;
  campo7: string;
  campo8: string;
  campo9: string;
  valorNumerico1: number | string;
  valorNumerico2: number | string;
}

export function MantenimientoVista() {
  const { id } = useParams<{ id: string }>();
  const { fetchMantenimientoPorId } = useMantenimientos();
  const [formData, setFormData] = useState<FormData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchMantenimientoPorId(id) // Se pasa 'id' como string
        .then((data) => {
          if (data) {
            setFormData(data);
          } else {
            console.error('No se encontró el mantenimiento con el ID proporcionado');
          }
        })
        .catch((err) => console.error('Error al cargar el mantenimiento:', err));
    }
  }, [id, fetchMantenimientoPorId]);

  if (!formData) {
    return <Typography>Cargando datos...</Typography>;
  }

  return (
    <><Box
      sx={{
        p: 4,
        maxWidth: '80%',
        margin: '0 auto',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Instalación Eléctrica
            </Typography>
          </Grid>

          {/* Campos dinámicos */}
          {[
            { label: '¿La instalación está funcionando correctamente?', name: 'campo1' },
            { label: '¿Hay elementos sueltos no asegurados como tomas, cables o interruptores?', name: 'campo2' },
            { label: '¿Hay componentes rotos en funcionamiento como tomas o interruptores?', name: 'campo3' },
            { label: '¿La conexión de la puesta a tierra se encuentra en buenas condiciones?', name: 'campo4' },
            { label: '¿Los paneles fotovoltaicos se encuentran sucios o con alguna sombra?', name: 'campo5' },
            { label: '¿Hay cables sueltos o falsos contactos en las borneras?', name: 'campo6' },
            { label: '¿Los bornes de las baterías se encuentran aislados?', name: 'campo7' },
            { label: '¿Se encuentra tierra en los coolers de ventilación del inversor?', name: 'campo8' },
            { label: 'Advertencias (warnings) y/o Alarmas', name: 'campo9' },
          ].map((item, index) => (
            <Grid item xs={12} key={index}>
              <Typography variant="body1" gutterBottom>
                {item.label}
              </Typography>
              <TextField
                select
                name={item.name}
                fullWidth
                variant="outlined"
                margin="normal"
                value={formData[item.name as keyof FormData] || ''}
                onChange={(e) => setFormData({ ...formData, [item.name]: e.target.value })}
                disabled // Hacer el campo deshabilitado
              >
                {['Si', 'No', 'NC'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

          {/* Campos numéricos */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Voltaje de Baterías (INPUT BATT)
            </Typography>
            <TextField
              type="number"
              name="valorNumerico1"
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.valorNumerico1}
              onChange={(e) => setFormData({ ...formData, valorNumerico1: e.target.value })}
              disabled // Hacer el campo deshabilitado
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Carga en vatios (LOAD W)
            </Typography>
            <TextField
              type="number"
              name="valorNumerico2"
              fullWidth
              variant="outlined"
              margin="normal"
              value={formData.valorNumerico2}
              onChange={(e) => setFormData({ ...formData, valorNumerico2: e.target.value })}
              disabled // Hacer el campo deshabilitado
            />
          </Grid>

          {/* Observaciones */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Observaciones
            </Typography>
            <TextField
              name="observaciones"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              disabled // Hacer el campo deshabilitado
            />
          </Grid>
        </Grid>
      </form>
    </Box><Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </Box></>

    

    
  );
}
