import React, { useEffect, useState } from 'react';
import { Card, Typography, Box, CircularProgress, Divider, TextField, Button, Menu, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useReclamos } from '../../../context/reclamosProvider';
import { useMensajeReclamos } from '../../../context/mensajeReclamosProvider';
import { useAuth } from '../../../hooks/useAuth'; // Importamos useAuth

export function ReclamosVistaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { misReclamos, obtenerMisReclamos, actualizarEstadoReclamo } = useReclamos();
  const { mensajes, obtenerMensajes, crearMensaje } = useMensajeReclamos(); 
  const { id: userId, role } = useAuth(); 
  const [reclamo, setReclamo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nuevoMensaje, setNuevoMensaje] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>(reclamo?.estado || ''); 

  const open = Boolean(anchorEl);

  // Llamar a obtenerMisReclamos al cargar la página o hacer refresh
  useEffect(() => {
    obtenerMisReclamos(); 
  }, [obtenerMisReclamos]);

  // Establecer el reclamo seleccionado cuando misReclamos se actualiza
  useEffect(() => {
    const reclamoEncontrado = misReclamos.find((r) => r.id === Number(id));
    if (reclamoEncontrado) {
      setReclamo(reclamoEncontrado);
      setNuevoEstado(reclamoEncontrado.estado); 
      setLoading(false);
    } else {
      setReclamo(null);
      setLoading(false);
    }
  }, [id, misReclamos]);

  useEffect(() => {
    if (reclamo) {
      obtenerMensajes(Number(id));
    }
  }, [id, reclamo, obtenerMensajes]);

  const handleEnviarMensaje = async () => {
    if (nuevoMensaje.trim()) {
      await crearMensaje(Number(id), nuevoMensaje);
      setNuevoMensaje('');
      obtenerMensajes(Number(id));
    }
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleActualizarEstado = async (estado: string) => {
    try {
      await actualizarEstadoReclamo(Number(id), estado);
      setNuevoEstado(estado); 
      setAnchorEl(null); 
    } catch (error) {
      console.error('Error al actualizar el estado del reclamo:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reclamo) {
    return (
      <Card sx={{ maxWidth: '100%', margin: '20px', padding: 3 }}>
        <Typography variant="h6" color="error">
          Reclamo no encontrado.
        </Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ margin: '20px' }}>
      <Card sx={{ maxWidth: '100%', marginBottom: '20px', padding: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Detalles del Reclamo
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h6">{reclamo.titulo}</Typography>
          <Typography variant="body1" color="textSecondary">
            {reclamo.problema}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Estado: {reclamo.estado}
          </Typography>
          {reclamo.usuariosProyectos?.usuario && (
            <Typography variant="body1">
              Usuario: {reclamo.usuariosProyectos.usuario.firstName} {reclamo.usuariosProyectos.usuario.lastName}
            </Typography>
          )}
          {reclamo.usuariosProyectos?.proyecto && (
            <Typography variant="body1">
              Proyecto: {reclamo.usuariosProyectos.proyecto.nombre}
            </Typography>
          )}

          {role === 'administrador' && (
            <Box>
              {/* Menú de selección de estado */}
              <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClickMenu}
                      sx={{ marginTop: '20px' }}
                    >
                      Cambiar Estado
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleCloseMenu}
                    >
                      <MenuItem onClick={() => handleActualizarEstado('pendiente')}>Pendiente</MenuItem>
                      <MenuItem onClick={() => handleActualizarEstado('en proceso')}>En Proceso</MenuItem>
                      <MenuItem onClick={() => handleActualizarEstado('resuelto')}>Resuelto</MenuItem>
                    </Menu>
            </Box>
          )}
        </Box>
      </Card>

      <Divider sx={{ marginBottom: '20px' }} />

      <Card sx={{ maxWidth: '100%', marginBottom: '20px', padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mensajes del Reclamo
        </Typography>

        {mensajes.length > 0 ? (
          mensajes.map((mensaje) => (
            <Box
              key={mensaje.id}
              sx={{
                marginBottom: '10px',
                display: 'flex',
                justifyContent: mensaje.usuario?.id === Number(userId) ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                sx={{
                  maxWidth: '60%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: mensaje.usuario?.id === Number(userId) ? '#DCF8C6' : '#F1F0F0',
                }}
              >
                {mensaje.usuario ? (
                  <>
                    <Typography variant="body1">
                      <strong>
                        {mensaje.usuario.firstName} {mensaje.usuario.lastName}
                      </strong>{' '}
                      - {mensaje.mensaje}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(mensaje.createdAt).toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1" color="error">
                    Usuario no disponible
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No hay mensajes aún.
          </Typography>
        )}

        <Box sx={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            label="Escribe tu mensaje"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            multiline
            rows={4}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button variant="contained" color="primary" onClick={handleEnviarMensaje} disabled={reclamo.estado === 'resuelto'} >
              Enviar Mensaje
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
