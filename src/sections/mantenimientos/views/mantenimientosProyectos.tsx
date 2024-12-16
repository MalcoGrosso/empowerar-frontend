import React, { useState, useEffect } from 'react';
import { Box, Card, Grid, Typography, Button, Toolbar, TextField, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ProyectoProps, useMantenimientos } from '../../../context/mantenimientoProvider'; // Cambia la ruta si es necesario

export function MantenimientosProyectos() {
  const { fetchProyectosDelElectricista, proyectosDelElectricista, loading } = useMantenimientos();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('nombre');
  const [snackOpen, setSnackOpen] = useState(false);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProyectosDelElectricista();
    };

    fetchData(); // Llamar solo una vez cuando el componente se monte
  }, [fetchProyectosDelElectricista]);

  const filteredProyectos = loading
    ? [] // Si los proyectos aún están cargando, no mostramos nada
    : proyectosDelElectricista.filter((proyecto) => {
        const searchValue = filter.toLowerCase();
        switch (filterType) {
          case 'nombre':
            return proyecto.nombre?.toLowerCase().includes(searchValue);
          case 'descripcion':
            return proyecto.descripcion?.toLowerCase().includes(searchValue);
          case 'provincia':
            return proyecto.provincia?.toLowerCase().includes(searchValue);
          case 'localidad':
            return proyecto.localidad?.toLowerCase().includes(searchValue);
          case 'alias_pago':
            return proyecto.alias_pago?.toLowerCase().includes(searchValue);
          default:
            return true;
        }
      });

  const handleProjectClick = (proyecto: ProyectoProps) => {
  console.log('Navigando con el proyecto:', proyecto); // Verifica los datos
  navigate(`detalles/${proyecto.id}`, {
    state: {
      proyecto: {
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        provincia: proyecto.provincia,
        localidad: proyecto.localidad,
        alias_pago: proyecto.alias_pago,
        electricistasProyectosId: proyecto.electricistasProyectosId,
      },
    },
  });
};

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  return (
    <><Card sx={{ maxWidth: '100%', margin: '0 20px', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
      <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Typography variant="h4" flexGrow={1}>
          Proyectos
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            justifyContent: { xs: 'center', sm: 'flex-end' },
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filtrar por</InputLabel>
            <Select value={filterType} onChange={(event) => setFilterType(event.target.value)} label="Filtrar por">
              <MenuItem value="nombre">Nombre</MenuItem>
              <MenuItem value="descripcion">Descripción</MenuItem>
              <MenuItem value="provincia">Provincia</MenuItem>
              <MenuItem value="localidad">Localidad</MenuItem>
              <MenuItem value="alias_pago">Alias de Pago</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            placeholder="Buscar..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            sx={{ width: { xs: '100%', sm: '200px' } }} />
        </Box>
      </Toolbar>

      {/* Mostrar un cargando mientras los proyectos están siendo obtenidos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProyectos.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ width: '100%' }}>
              No se encontraron proyectos
            </Typography>
          ) : (
            filteredProyectos.map((proyecto) => (
              <Grid item xs={12} sm={6} md={4} key={proyecto.id}>
                <Card sx={{ padding: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                  <Box onClick={() => handleProjectClick(proyecto)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="h6">{proyecto.nombre}</Typography>
                    <Typography variant="body2">{proyecto.descripcion}</Typography>
                    <Typography variant="body2">Provincia: {proyecto.provincia}</Typography>
                    <Typography variant="body2">Localidad: {proyecto.localidad}</Typography>
                    <Typography variant="body2">Alias de Pago: {proyecto.alias_pago}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackClose} severity={alert?.severity} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Card>
    
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
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
