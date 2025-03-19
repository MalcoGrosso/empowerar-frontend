import React, { useEffect, useState, ReactNode } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Button, TablePagination, MenuItem, FormControl, Select, SelectChangeEvent 
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePagos } from '../../../context/pagosProvider';

interface PagoProps {
  id: number;
  createdAt: Date;
  monto: number;
  estado: string;
}

export function PagosAdmin() {
  const { pagos, loading, updatePago, fetchPagosAdmin } = usePagos();
  const [filteredPagos, setFilteredPagos] = useState<PagoProps[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);
  const [yearFilter, setYearFilter] = useState<string>('');
  const { state } = useLocation();
  const usuario = state?.usuario;
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario?.userId) {
      fetchPagosAdmin(usuario.userId); // Llamar a fetchPagosAdmin con el usuarioId
    }
  }, [usuario, fetchPagosAdmin]);

  useEffect(() => {
    if (yearFilter) {
      const filtered = pagos.filter(pago => new Date(pago.createdAt).getFullYear().toString() === yearFilter);
      setFilteredPagos(filtered);
    } else {
      setFilteredPagos(pagos);
    }
  }, [yearFilter, pagos]);

  const handleYearChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setYearFilter(event.target.value);
    setPage(0);
  };

  const irAPagar = async (pagoId: number) => {
    try {
      await updatePago(pagoId, { estado: 'pagado' });
      navigate(`/dashboard/pagos`);
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
    }
  };

  const irAComprobante = (pagoId: number) => {
    navigate(`/dashboard/pagos/comprobante/${pagoId}`);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const pagosPaginated = filteredPagos.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const uniqueYears = Array.from(new Set(pagos.map(pago => new Date(pago.createdAt).getFullYear())));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pagos del Usuario
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <Select
          value={yearFilter}
          onChange={handleYearChange}
          displayEmpty
        >
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
                  {pago.estado === 'pagado' && (
                    <Button onClick={() => irAComprobante(pago.id)}>Ver Comprobante</Button>
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
        onPageChange={handleChangePage}
      />
    </Box>
  );
}
