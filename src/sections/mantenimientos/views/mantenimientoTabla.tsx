import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAlert } from 'src/context/AlertProvider';
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
  Card,
} from '@mui/material';
import { useMantenimientos } from '../../../context/mantenimientoProvider';


interface FechaMantenimiento {
  id: number;
  fecha: Date;
}

export function MantenimientosTabla() {
  const { state } = useLocation();
  const electricistasProyectosId = state?.electricistasProyectosId;
  const usuario = state?.usuario;
  const navigate = useNavigate();

  const { fetchFechasMantenimientos, loading } = useMantenimientos();
  const [fechas, setFechas] = useState<FechaMantenimiento[]>([]);
  const [filtradoFechas, setFiltradoFechas] = useState<FechaMantenimiento[]>([]);
  const [añosDisponibles, setAñosDisponibles] = useState<number[]>([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState<number | 'Todos'>('Todos');
  const [page, setPage] = useState(0);

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
      navigate(`ver/${usuario.id}/${mantenimientoId}`, { state: { usuarioId: usuario.id, electricistaId: electricistasProyectosId } });
    }
  };

  const irAEditarMantenimiento = (mantenimientoId: number) => {
    if (usuario?.id) {
      navigate(`editarMantenimiento/${mantenimientoId}`, { state: { usuarioId: usuario.id, electricistaId: electricistasProyectosId } });
    }
  };

  const irACrearMantenimiento = () => {
    if (usuario?.id) {
      navigate(`crearMantenimiento`, { state: { usuarioId: usuario.id, electricistaId: electricistasProyectosId } });
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

  const { showAlert } = useAlert();
  const rowsPerPage = 12;
  const fechasPaginadas = filtradoFechas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
    <Card sx={{ maxWidth: '100%', margin: '0 20px', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
    <Box sx={{ p: 3 }}>
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
        <Typography variant="body1">No se encontró información del usuario.</Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'left', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={irACrearMantenimiento}
          sx={{ padding: '10px 20px', fontWeight: 'bold' }}
        >
          Crear Mantenimiento
        </Button>
      </Box>



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
                            ml: 2, // Margen izquierdo
                          }}
                        >
                          <img
                            alt="icon"
                            src="/assets/icons/glass/ic-ver.svg"
                              />
                        </Button>
                        <Button
                          onClick={() => irAEditarMantenimiento(fecha.id)}
                          sx={{
                            padding: 0,
                            minWidth: 'unset',
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            ml: 2, // Margen izquierdo
                          }}
                        >
                          <img
                            alt="icon"
                            src="/assets/icons/glass/ic-editar.svg"
                              />
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
              count={filtradoFechas.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
               />

          </>
        ) : (
          <Typography variant="body1">No se encontraron mantenimientos para este usuario.</Typography>
        )}
      </Box>

    </Box>
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
