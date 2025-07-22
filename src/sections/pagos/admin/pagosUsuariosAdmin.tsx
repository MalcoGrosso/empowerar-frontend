import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Divider,
  Grid,
  Button,
} from '@mui/material';

import { useProyectos } from '../../../context/ProyectosProvider';
import { Pagos } from '../pagosVistaUsuario';

interface Pago {
  id: number;
  monto: string;
  estado: 'pendiente' | 'pagado' | 'rechazado';
  interes: boolean;
  comprobante: string | null;
  createdAt: string;
}

interface UsuarioAsignado {
  id: number;
  montoPago: string;
  usuario: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
  };
  pagos: Pago[];
}

interface ProyectoState {
  proyecto: {
    nombre: string;
    descripcion: string;
    provincia: string;
    localidad: string;
    alias_pago: string;
    electricistasProyectosId: number;
  };
}

export function PagosUsuariosAdmin() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: ProyectoState }; // Solución aquí
  const navigate = useNavigate(); // Agregamos useNavigate
  const { fetchUsuariosPorProyecto } = useProyectos();
  const [usuariosAsignados, setUsuariosAsignados] = useState<UsuarioAsignado[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UsuarioAsignado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadUsuarios = async () => {
    setLoading(true);
    const fetchedUsuarios = await fetchUsuariosPorProyecto(Number(id));
    setUsuariosAsignados(fetchedUsuarios);
    setFilteredUsuarios(fetchedUsuarios);
    setLoading(false);
  };
  loadUsuarios();
}, [id, fetchUsuariosPorProyecto, state]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value.toLowerCase();
  setSearchTerm(value);

  aplicarFiltros(value, estadoFiltro);
};

const aplicarFiltros = (texto: string, estado: string) => {
  const filtrados = usuariosAsignados.filter((usuario) => {
    const coincideTexto =
      usuario.usuario.firstName.toLowerCase().includes(texto) ||
      usuario.usuario.lastName.toLowerCase().includes(texto) ||
      usuario.usuario.dni.includes(texto);

    const estadoPago = obtenerEstadoDePago(usuario.pagos);
    const coincideEstado = estado === 'Todos' || estadoPago === estado;

    return coincideTexto && coincideEstado;
  });

  setFilteredUsuarios(filtrados);
};


const handleEstadoChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  const nuevoEstado = event.target.value as string;
  setEstadoFiltro(nuevoEstado);
  aplicarFiltros(searchTerm, nuevoEstado);
};

  const handleCardClick = (usuario: UsuarioAsignado) => {
    // Redirige a la vista de la tabla, pasando el ID del usuario como parámetro
    navigate(`tabla/${usuario.id}`, { 
      state: { 
        usuario,
      }});
  };

  const obtenerEstadoDePago = (pagos: Pago[]): string => {
  if (pagos.length === 0) return 'Sin historial de pagos';

  const hoy = new Date();
  const mesActual = hoy.getMonth(); // 0-11
  const añoActual = hoy.getFullYear();

  // Filtrar pagos del mes actual
  const pagosDelMes = pagos.filter((pago) => {
    const fecha = new Date(pago.createdAt);
    return (
      fecha.getMonth() === mesActual &&
      fecha.getFullYear() === añoActual
    );
  });

  // ⚠️ 1. Si hay pagos anteriores pendientes → "Deuda"
  const pagosAnterioresPendientes = pagos.some((pago) => {
    const fechaPago = new Date(pago.createdAt);
    return (
      (fechaPago.getFullYear() < añoActual ||
        (fechaPago.getFullYear() === añoActual && fechaPago.getMonth() < mesActual)) &&
      pago.estado === 'pendiente'
    );
  });
  if (pagosAnterioresPendientes) return 'Deuda';

  // ⚠️ 2. Si hay pago generado este mes pero ninguno pagado → "Sin pago este mes"
  if (pagosDelMes.length > 0) {
    const todosPendientes = pagosDelMes.every((pago) => pago.estado === 'pendiente');
    if (todosPendientes) return 'Sin pago este mes';

    // 3. Si el último pago del mes fue pagado con interés → "Al día con interés"
    const ultimoPago = pagosDelMes.reduce((másReciente, actual) =>
      new Date(actual.createdAt) > new Date(másReciente.createdAt) ? actual : másReciente
    );
    if (ultimoPago.estado === 'pagado' && ultimoPago.interes) return 'Al día con interés';

    // 4. Todos pagos del mes actual fueron pagados → "Al día"
    const todosPagados = pagosDelMes.every((pago) => pago.estado === 'pagado');
    if (todosPagados) return 'Al día';
  }

  // ⚠️ 5. Si no hay pago generado para el mes actual, pero no hay deuda → blanco
  return 'Al día';
};

  const obtenerColorPorEstado = (estado: string): string => {
  switch (estado) {
    case 'Al día':
      return '#4caf50'; // verde
    case 'Al día con interés':
      return '#ff9800'; // naranja
    case 'Deuda':
      return '#f44336'; // rojo
    case 'Sin historial de pagos':
      return '#ffffff'; // blanco puro
    case 'Sin pago este mes':
      return '#e0e0e0'; // gris claro
    default:
      return '#9e9e9e'; // gris oscuro
  }
};

    
  
  return (
    <>
    {/* <Card sx={{ maxWidth: '100%', margin: '0 20px', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}> */}
    <Box sx={{ p: 3 }}>
     <Card sx={{ mb: 4, p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 3, minWidth: 500, }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Detalles del Proyecto (Pagos)
          </Typography>
          <Typography variant="body1" gutterBottom>
            {state?.proyecto?.nombre}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {state?.proyecto?.descripcion}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Provincia: {state?.proyecto?.provincia}, Localidad: {state?.proyecto?.localidad}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Alias de Pago: {state?.proyecto?.alias_pago}
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ maxWidth: '100%', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Buscar por nombre, apellido o DNI"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ minWidth: 300 }}
        />
        <TextField
            select
            label="Filtrar por estado"
            value={estadoFiltro}
            onChange={handleEstadoChange}
            sx={{ minWidth: 200 }}
            SelectProps={{ native: true }}
          >
            <option value="Todos">Todos</option>
            <option value="Al día">Al día</option>
            <option value="Al día con interés">Al día con interés</option>
            <option value="Deuda">Deuda</option>
            <option value="Sin pago este mes">Sin pago este mes</option>
            <option value="Sin historial de pagos">Sin historial de pagos</option>
          </TextField>
      </Box>

      <Typography variant="h4" gutterBottom>
        Usuarios Asignados
      </Typography>

      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : filteredUsuarios.length > 0 ? (
        <Grid container spacing={2}>
          {filteredUsuarios.map((usuario) => {
  const estado = obtenerEstadoDePago(usuario.pagos);
  const colorEstado = obtenerColorPorEstado(estado);

  return (
    <Grid item xs={12} sm={6} md={4} key={usuario.id}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          justifyContent: 'left',
          padding: 2,
          height: 200,
          cursor: 'pointer',
          borderLeft: `8px solid ${colorEstado}`, // <<< línea lateral
          transition: 'transform 0.1s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '5px 5px 10px rgba(145 158 171 / 0.2)'
          },
        }}
        onClick={() => handleCardClick(usuario)}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {usuario.usuario.firstName} {usuario.usuario.lastName} 
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2">
            <strong>DNI:</strong> {usuario.usuario.dni} 
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {usuario.usuario.email}
          </Typography>
          <Typography variant="body2">
            <strong>Estado:</strong> {estado}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
})}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ py: 3 }}>
          No hay usuarios asignados o no coinciden con la búsqueda.
        </Typography>
      )}
      </Card>
    </Box>
    {/* </Card> */}
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
