import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Button, TablePagination, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, TextField, 
  Card
} from '@mui/material';
import {useNavigate } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import api from '../../config/axiosClient';
import { usePagos, PagoProps } from '../../context/pagosProvider';


const mercadoPago1 = import.meta.env.VITE_MERCADO_PAGO_AT || '';

export function Pagos() {
  initMercadoPago(mercadoPago1);

  const { pagos, loading, fetchPagos } = usePagos();
  const [filteredPagos, setFilteredPagos] = useState<PagoProps[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(12);
  const [yearFilter, setYearFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda
  const [preferenceIds, setPreferenceIds] = useState<{ [key: number]: string }>({}); // Estado para cada preferenceId
  const navigate = useNavigate();

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  useEffect(() => {
    let filtered = pagos;

    if (yearFilter) {
      filtered = filtered.filter(pago => new Date(pago.createdAt).getFullYear().toString() === yearFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        pago => 
          new Date(pago.createdAt).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          pago.monto.toString().includes(searchTerm)
      );
    }

    setFilteredPagos(filtered);
  }, [yearFilter, pagos, searchTerm]);

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setYearFilter(event.target.value);
    setPage(0);
  };

  // Función para navegar a la vista del comprobante de pago
  const irAComprobante = (compro: string) => {
    if (compro) {
      window.open(compro, '_blank');
    }
  };

  const handleGenerarPago = async (id: number) => {
    try {
      console.log("Generando pago para ID:", id);
      const response = await api.post('/pagos/generarPago', { id });
  
      if (response.status === 200) {
        const { preferenceId } = response.data;
  
        // Mercado Pago usa esta estructura para la URL del pago
        const paymentUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
  
        setPreferenceIds(prev => ({ ...prev, [id]: paymentUrl })); // Guarda la URL completa
        console.log("Link de pago generado:", paymentUrl);
      } else {
        console.error('Error al generar el pago.');
      }
    } catch (error) {
      console.error('Error en la generación del pago:', error);
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const uniqueYears = Array.from(new Set(pagos.map(pago => new Date(pago.createdAt).getFullYear())));

  const customization = {
    texts: {
      action: 'buy',
      valueProp: 'security_details',
    },
  }
  
    

  return (
    <>
    <Card sx={{ maxWidth: '100%', margin: '0 20px', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
      <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Pagos de Usuario
      </Typography>
      {pagos.length > 0 && pagos[0].usuarioProyecto && (
  <>
    <Typography variant="h6" gutterBottom>
      Cantidad de Cuotas: {pagos[0].usuarioProyecto.montoCuota}
    </Typography>
    <Typography variant="h6" gutterBottom>
      Monto Ahorrado: ${pagos[0].usuarioProyecto.montoAhorrado}
    </Typography>
  </>
)}

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

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: 'auto', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>Fecha</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Monto</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Estado</TableCell>
                <TableCell sx={{ textAlign: 'center', width: { xs: '150px', sm: '250px' } }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPagos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell sx={{ textAlign: 'center' }}>{new Date(pago.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{pago.monto}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{pago.estado}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {pago.estado === 'pendiente' ? (
                      preferenceIds[pago.id] ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => window.open(preferenceIds[pago.id], '_blank')}
                        >
                          Ir a Mercado Pago
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleGenerarPago(pago.id)}
                        >
                          Generar Link de Pago
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => irAComprobante(pago.comprobante)}
                        sx={{
                          padding: 0,
                          minWidth: 'unset',
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'transparent',
                          '&:hover': { backgroundColor: 'transparent' },
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
      )}

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[12]}
        component="div"
        count={filteredPagos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage} />
    </Box></Card></>

    
  );
}
