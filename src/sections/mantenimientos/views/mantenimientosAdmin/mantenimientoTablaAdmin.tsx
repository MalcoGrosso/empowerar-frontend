import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { useMantenimientos } from '../../../../context/mantenimientoProvider';

interface FechaMantenimiento {
  id: number;
  fecha: Date;
}

export function MantenimientosTablaAdmin() {
  const { state } = useLocation();
  const usuario = state?.usuario;
  const navigate = useNavigate();
  
  const { fetchFechasMantenimientos, eliminarMantenimiento, loading } = useMantenimientos();
  const [fechas, setFechas] = useState<FechaMantenimiento[]>([]);
  const [filtradoFechas, setFiltradoFechas] = useState<FechaMantenimiento[]>([]);
  const [añosDisponibles, setAñosDisponibles] = useState<number[]>([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | 'Todos'>('Todos');
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [mantenimientoAEliminar, setMantenimientoAEliminar] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);  // Estado para el mensaje de alerta
  const [openAlert, setOpenAlert] = useState<boolean>(false); // Estado para controlar la visibilidad de la alerta

  useEffect(() => {
    const obtenerFechas = async () => {
      if (usuario?.id) {
        const fechasObtenidas: FechaMantenimiento[] = await fetchFechasMantenimientos(usuario.id);
        const fechasOrdenadas = fechasObtenidas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setFechas(fechasOrdenadas);

        // Extraer los años disponibles para el filtro
        const años = [...new Set(fechasObtenidas.map((fecha) => new Date(fecha.fecha).getFullYear()))];
        setAñosDisponibles(años.sort((a, b) => b - a));
        setFiltradoFechas(fechasOrdenadas); // Inicialmente todas las fechas
      }
    };
    obtenerFechas();
  }, [fetchFechasMantenimientos, usuario]);

  const irADetalle = (mantenimientoId: number) => {
    if (usuario?.id) {
      navigate(`verAdmin/${usuario.id}/${mantenimientoId}`, { state: { usuarioId: usuario.id } });
    }
  };

  const irAEditarMantenimiento = (mantenimientoId: number) => {
    if (usuario?.id) {
      navigate(`editarMantenimientoAdmin/${mantenimientoId}`, { state: { usuarioId: usuario.id } });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleFiltrarPorAño = (año: number | 'Todos') => {
    setAñoSeleccionado(año);
    if (año === 'Todos') {
      setFiltradoFechas(fechas);
    } else {
      const fechasFiltradas = fechas.filter((fecha) => new Date(fecha.fecha).getFullYear() === año);
      setFiltradoFechas(fechasFiltradas);
    }
    setPage(0); // Reiniciar la paginación al filtrar
  };

  const handleEliminarMantenimiento = (mantenimientoId: number) => {
    setMantenimientoAEliminar(mantenimientoId);
    setOpenModal(true);
  };

  const confirmarEliminacion = async () => {
    if (mantenimientoAEliminar !== null) {
      await eliminarMantenimiento(mantenimientoAEliminar);  // No need to check for truthiness
      setFiltradoFechas(fechas.filter((fecha) => fecha.id !== mantenimientoAEliminar));
      setAlertMessage('El mantenimiento se eliminó correctamente.');
      setOpenAlert(true); // Mostrar la alerta
      setOpenModal(false);
      setMantenimientoAEliminar(null);

      // Cerrar la alerta después de 2 segundos
      setTimeout(() => {
        setOpenAlert(false);
      }, 2000);
    }
  };

  const cancelarEliminacion = () => {
    setOpenModal(false);  // Cerrar el modal sin hacer nada
    setMantenimientoAEliminar(null);  // Resetear el estado
  };

  const rowsPerPage = 12;
  const fechasPaginadas = filtradoFechas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  

  return (
    <>
      <Box sx={{ p: 3 }}>
          <Card sx={{ maxWidth: 500, margin: 'left', mt: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Datos del Usuario
            </Typography>
            {usuario ? (
              <>
                <Typography variant="body1">
                  Nombre: {usuario.usuario.firstName} {usuario.usuario.lastName}
                </Typography>
                <Typography variant="body1">DNI: {usuario.usuario.dni}</Typography>
                <Typography variant="body1">Email: {usuario.usuario.email}</Typography>
              </>
            ) : (
              <Typography variant="body1">
                No se encontró información del usuario.
              </Typography>
            )}
          </CardContent>

          {openAlert && alertMessage && (
            <Alert
              severity="success"
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 9999,
                width: 'auto',
              }}
            >
              {alertMessage}
            </Alert>
          )}
        </Card>

        <Box sx={{ mt: 4 }}>
          <Box>
            <Select
              value={añoSeleccionado}
              onChange={(e) => handleFiltrarPorAño(e.target.value as number | 'Todos')}
              displayEmpty
              sx={{ mb: 2, minWidth: 200, justifyContent: 'right' }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {añosDisponibles.map((año) => (
                <MenuItem key={año} value={año}>
                  {año}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {loading ? (
            <CircularProgress />
          ) : filtradoFechas.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Fecha de Mantenimiento</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fechasPaginadas.map((fecha) => (
                      <TableRow key={fecha.id}>
                        <TableCell align="center">{new Date(fecha.fecha).toLocaleString()}</TableCell>
                        <TableCell align="center">
                        <Box
                            sx={{
                              display: 'inline-flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 1,
                              whiteSpace: 'nowrap', // fuerza que todo se mantenga en una línea
                            }}
                          >
                          <Button
                            onClick={() => irADetalle(fecha.id)}
                            sx={{
                              padding: 0,
                              minWidth: 'unset',
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: 'transparent',
                              ml: 2,
                              
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              style={{ fontSize: '2rem' }}
                            >
                              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                            </svg>
                          </Button>
                          <Button
                            onClick={() => irAEditarMantenimiento(fecha.id)}
                            sx={{
                              padding: 0,
                              minWidth: 'unset',
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: 'transparent',
                              ml: 2,
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              style={{ fontSize: '2rem' }}
                            >
                              <path d="M12.146 1.854a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-.713.293L3 10.5V9a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 1.414l-6.293 6.293.586.586 6.293-6.293a1 1 0 0 1 1.414 1.414l-7 7a1 1 0 0 1-.293.713l-7 7a1 1 0 0 1-1.414-1.414l7-7a1 1 0 0 1 .293-.713L9.854 8.146a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 1.414z" />
                            </svg>
                          </Button>
                          <Button
                            onClick={() => handleEliminarMantenimiento(fecha.id)}
                            sx={{
                              padding: 0,
                              minWidth: 'unset',
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: 'transparent',
                              color: 'red',
                              ml: 2,
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                              style={{ fontSize: '2rem' }}
                            >
                              <path d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1h-1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3H1V2z" />
                            </svg>
                          </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                count={filtradoFechas.length}
              />
            </>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No se encontraron mantenimientos.
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog open={openModal} onClose={cancelarEliminacion}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Estás seguro de que quieres eliminar este mantenimiento?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarEliminacion}>Cancelar</Button>
          <Button onClick={confirmarEliminacion} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
