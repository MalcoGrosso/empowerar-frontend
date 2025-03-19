import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Button, TablePagination, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePagos } from '../../context/pagosProvider';

interface PagoProps {
  id: number;
  createdAt: Date;
  monto: number;
  estado: string;
}

export function Pagos() {
  const { pagos, loading, updatePago, fetchPagos } = usePagos(); // Añadir `updatePago` al contexto
  const [filteredPagos, setFilteredPagos] = useState<PagoProps[]>([]);
  const [page, setPage] = useState(0);  // Página actual
  const [rowsPerPage] = useState(12);   // Elementos por página
  const [yearFilter, setYearFilter] = useState<string>(''); // Año seleccionado
  const navigate = useNavigate();

  useEffect(() => {
      
    fetchPagos(); // Llamar a fetchPagosAdmin con el usuarioId
      
    }, [fetchPagos]);

  // Filtrar pagos por año
  useEffect(() => {
    if (yearFilter) {
      const filtered = pagos.filter(pago => new Date(pago.createdAt).getFullYear().toString() === yearFilter);
      setFilteredPagos(filtered);
    } else {
      setFilteredPagos(pagos);
    }
  }, [yearFilter, pagos]);

  // Función para manejar el cambio del año en el filtro
  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setYearFilter(event.target.value);
    setPage(0); // Reiniciar la paginación al cambiar el filtro
  };

  // Función para navegar a la vista de pagos
  const irAPagar = async (pagoId: number) => {
    try {
      // Llamar a la función de actualizar el pago y cambiar el estado a "Pagado"
      await updatePago(pagoId, { estado: 'pagado' });

      // Después de actualizar, navegar al comprobante de pago
      navigate(`/dashboard/pagos`);
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
    }
  };

  // Función para navegar a la vista del comprobante de pago
  const irAComprobante = (pagoId: number) => {
    navigate(`/dashboard/pagos/comprobante/${pagoId}`);
  };

  // Controlador para cambiar de página
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Datos de la página actual
  const pagosPaginated = filteredPagos.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Obtener los años únicos disponibles para el filtro
  const uniqueYears = Array.from(new Set(pagos.map(pago => new Date(pago.createdAt).getFullYear())));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pagos del Usuario
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
              <TableCell sx={{ textAlign: 'center' }}>Fecha de Pago</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Monto</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Estado</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagosPaginated.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell sx={{ textAlign: 'center' }}>
                  {new Date(pago.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>${pago.monto}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{pago.estado}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {/* Mostrar el botón de "Pagar" si el estado no es "Pagado" */}
                  {pago.estado !== 'pagado' ? (
                    <Button
                      onClick={() => irAPagar(pago.id)} // Llamar a la función para actualizar el pago y navegar
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
                      Pagar
                    </Button>
                  ) : (
                    // Mostrar el botón de "Ver Comprobante" si el estado es "Pagado"
                    <Button
                      onClick={() => irAComprobante(pago.id)} // Navegar al comprobante
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
                      Ver Comprobante
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[12]}
        component="div"
        count={filteredPagos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage} />
        
    </Box>
  );
}
