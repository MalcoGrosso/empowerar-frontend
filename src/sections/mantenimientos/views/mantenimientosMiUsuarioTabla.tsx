import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Button, TablePagination, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMantenimientos } from '../../../context/mantenimientoProvider';

interface FechaMantenimiento {
  id: number;
  fecha: Date;
}

export function MantenimientosMiUsuarioTabla() {
  const { fetchFechasMantenimientosUsuarios, loading } = useMantenimientos();
  const [fechas, setFechas] = useState<FechaMantenimiento[]>([]);
  const [filteredFechas, setFilteredFechas] = useState<FechaMantenimiento[]>([]);
  const [page, setPage] = useState(0);  // Página actual
  const [rowsPerPage] = useState(12);   // Elementos por página
  const [yearFilter, setYearFilter] = useState<string>(''); // Año seleccionado
  const navigate = useNavigate();

  // Fetch fechas de mantenimientos al cargar el componente
  useEffect(() => {
    const obtenerFechas = async () => {
      const fechasObtenidas: { id: number; fecha: Date }[] = await fetchFechasMantenimientosUsuarios();
      const fechasOrdenadas = fechasObtenidas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
      setFechas(fechasOrdenadas);
      setFilteredFechas(fechasOrdenadas);
    };

    obtenerFechas();
  }, [fetchFechasMantenimientosUsuarios]);

  // Filtrar fechas por año
  useEffect(() => {
    if (yearFilter) {
      const filtered = fechas.filter(fecha => new Date(fecha.fecha).getFullYear().toString() === yearFilter);
      setFilteredFechas(filtered);
    } else {
      setFilteredFechas(fechas);
    }
  }, [yearFilter, fechas]);

  // Función para manejar el cambio del año en el filtro
  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setYearFilter(event.target.value);
    setPage(0); // Reiniciar la paginación al cambiar el filtro
  };

  // Función para navegar a la vista de detalles de mantenimiento
  const irADetalle = (mantenimientoId: number) => {
    navigate(`/dashboard/mantenimientos/usuarioLogueado/vista/${mantenimientoId}`);
  };

  // Controlador para cambiar de página
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Datos de la página actual
  const fechasPaginated = filteredFechas.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Obtener los años únicos disponibles para el filtro
  const uniqueYears = Array.from(new Set(fechas.map(fecha => new Date(fecha.fecha).getFullYear())));

  return (
    <><Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mantenimientos del Usuario
      </Typography>

      {/* Selector de filtro por año */}
      <FormControl sx={{ minWidth: 200, mb: 3 }}>
        <Select value={yearFilter} onChange={handleYearChange} displayEmpty>
          <MenuItem value="">Todos los años</MenuItem>
          {uniqueYears.map(year => (
            <MenuItem key={year} value={year.toString()}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center' }}>Fecha de Mantenimiento</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fechasPaginated.map((fecha) => (
              <TableRow key={fecha.id}>
                <TableCell sx={{ textAlign: 'center' }}>{fecha.fecha.toLocaleDateString()}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    onClick={() => irADetalle(fecha.id)}
                    sx={{
                      padding: 0,
                      minWidth: 'unset',
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                      style={{ fontSize: '2rem' }}
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[12]}
        component="div"
        count={filteredFechas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage} />
        
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
