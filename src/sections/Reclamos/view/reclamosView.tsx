import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Box, Button, FormControl, InputLabel, Select, MenuItem, TextField, Toolbar, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, TextareaAutosize, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReclamos } from '../../../context/reclamosProvider';
import { useAuth } from '../../../hooks/useAuth';

export function ReclamosUsuario() {
  const { misReclamos, obtenerMisReclamos, crearReclamo } = useReclamos();
  const { role } = useAuth();
  const [filterEstado, setFilterEstado] = useState('');
  const [filterType, setFilterType] = useState<'usuario' | 'proyecto'>('usuario');
  const [filterValue, setFilterValue] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  // Estado para controlar el modal
  const [openModal, setOpenModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [problema, setProblema] = useState('');

  // Hook para redirigir
  const navigate = useNavigate();

  useEffect(() => {
    obtenerMisReclamos();
  }, [obtenerMisReclamos]);

  // Filtrar los reclamos por estado, tipo (usuario o proyecto) y valor
  const filteredReclamos = misReclamos.filter((reclamo) => {
    const searchEstado = filterEstado.toLowerCase();
    const searchValue = filterValue.toLowerCase();

    return (
      (filterEstado ? reclamo.estado.toLowerCase().includes(searchEstado) : true) &&
      (filterType === 'usuario'
        ? reclamo.usuariosProyectos.usuario?.firstName.toLowerCase().includes(searchValue) || 
          reclamo.usuariosProyectos.usuario?.lastName.toLowerCase().includes(searchValue)
        : reclamo.usuariosProyectos.proyecto.nombre.toLowerCase().includes(searchValue))
    );
  });

  // Ordenar los reclamos por fecha (suponiendo que 'createdAt' es la fecha de creación)
  const sortedReclamos = filteredReclamos.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;  // Ordenar de más reciente a más antiguo
  });

  const handleSnackClose = () => setSnackOpen(false);

  const handleAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ severity, message });
    setSnackOpen(true);
  };

  // Función para crear un reclamo
  const handleCreateReclamo = async () => {
    try {
      await crearReclamo(titulo, problema);  // Intentar crear el reclamo
      handleAlert('Reclamo creado con éxito', 'success');  // Mostrar alerta de éxito
    } catch (error) {
      handleAlert(error.message, 'error');  // Mostrar alerta de error
    }

    setOpenModal(false);  // Cerrar el modal después de crear el reclamo
    setTitulo('');  // Limpiar el título
    setProblema('');  // Limpiar el problema
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setTitulo('');
    setProblema('');
  };

  // Función para manejar el clic en una tarjeta de reclamo
  const handleCardClick = (id: number) => {
    navigate(`detalle/${id}`); // Redirigir a la ruta dinámica con el id del reclamo
  };

  return (
    <><Card sx={{ maxWidth: '100%', margin: '0 20px', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
      <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
            flexDirection: { xs: 'column', sm: 'row' }, // Cambiar a columna en pantallas pequeñas
            justifyContent: 'flex-end',
          }}
        >
          <Typography variant="h4" flexGrow={1}>
            Reclamos
          </Typography>

          {role === 'usuario' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)} // Abrir el modal
              sx={{ '@media (max-width:600px)': { mb: 2 }, }}
            >
              Crear Reclamo
            </Button>
          )}

          {role === 'administrador' && (
            <>
              <FormControl sx={{ minWidth: 170 }}>
                <InputLabel>Filtrar por Estado</InputLabel>
                <Select
                  value={filterEstado}
                  onChange={(event) => setFilterEstado(event.target.value)}
                  label="Filtrar por Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en proceso">En proceso</MenuItem>
                  <MenuItem value="resuelto">Resuelto</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Filtrar por</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as "usuario" | "proyecto")}
                  label="Filtrar por"
                >
                  <MenuItem value="usuario">Usuario</MenuItem>
                  <MenuItem value="proyecto">Proyecto</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={`Filtrar por ${filterType === 'usuario' ? 'Usuario' : 'Proyecto'}`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                sx={{ minWidth: 200, '@media (max-width:600px)': { mb: 2 }, }} />
            </>
          )}
        </Box>
      </Toolbar>

      <Grid container spacing={3}>
        {sortedReclamos.length === 0 ? (
          <Typography variant="body1" align="center" color="textSecondary" sx={{ width: '100%' }}>
            No se encontraron reclamos.
          </Typography>
        ) : (
          sortedReclamos.map((reclamo) => (
            <Grid item xs={12} sm={6} md={4} key={reclamo.id}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'left',
                  justifyContent: 'center',
                  cursor: 'pointer', // Cambiar el cursor a puntero para indicar que es clickeable
                  '&:hover': {
                    backgroundColor: '#f5f5f5', // Cambiar el color de fondo al pasar el mouse
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Añadir sombra al pasar el mouse
                  },
                }}
                onClick={() => handleCardClick(reclamo.id)} // Llamar a la función al hacer clic, pasando el ID
              >
                <Typography variant="h6">{reclamo.titulo}</Typography>
                <Typography>{reclamo.usuariosProyectos.proyecto.nombre}</Typography>
                {role === 'administrador' && (
                  <Typography>
                    {reclamo.usuariosProyectos.usuario
                      ? `${reclamo.usuariosProyectos.usuario.firstName} ${reclamo.usuariosProyectos.usuario.lastName}`
                      : 'Usuario desconocido'}
                  </Typography>
                )}

                <Typography variant="body2" color="textSecondary">
                  Estado: {reclamo.estado}
                </Typography>

                <Box
                  sx={{
                    width: '18px',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    backgroundColor: reclamo.estado === 'pendiente' ? '#ff0000' :
                      reclamo.estado === 'en proceso' ? '#FFFF00' :
                        reclamo.estado === 'resuelto' ? '#00FF00' :
                          '#808080',
                  }} />
              </Card>

            </Grid>
          ))
        )}
      </Grid>

      {/* Snackbar para mostrar alertas */}
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={alert?.severity} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>

      {/* Modal de creación de reclamo */}
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Crear Reclamo</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }} />
          <TextField
            minRows={3}
            placeholder="Describe tu problema"
            value={problema}
            multiline
            rows={4}
            onChange={(e) => setProblema(e.target.value)}
            style={{ width: '100%', marginBottom: 16 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCreateReclamo} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Card><Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
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
