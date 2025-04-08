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
    <><Box sx={{ p: 3 }}>
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
                      <TableCell align="center">{new Date(fecha.fecha).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
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
                            ml: 2, // Margen izquierdo
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
