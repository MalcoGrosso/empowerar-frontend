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

import { useProyectos } from '../../../../context/ProyectosProvider';

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

export function MantenimientosUsuariosAdmin() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: ProyectoState }; // Solución aquí
  const navigate = useNavigate(); // Agregamos useNavigate
  const { fetchUsuariosPorProyecto } = useProyectos();
  const [usuariosAsignados, setUsuariosAsignados] = useState<UsuarioAsignado[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<UsuarioAsignado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsuarios = async () => {
      setLoading(true);
      const fetchedUsuarios = await fetchUsuariosPorProyecto(Number(id));
      setUsuariosAsignados(fetchedUsuarios);
      setFilteredUsuarios(fetchedUsuarios);
      setLoading(false);
      console.log(state)
    };
    loadUsuarios();
  }, [id, fetchUsuariosPorProyecto, state]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = usuariosAsignados.filter((usuario) =>
      usuario.usuario.firstName.toLowerCase().includes(value) ||
      usuario.usuario.dni.includes(value)
    );
    setFilteredUsuarios(filtered);
  };

  const handleCardClick = (usuario: UsuarioAsignado) => {
    // Redirige a la vista de la tabla, pasando el ID del usuario como parámetro
    navigate(`tabla/${usuario.id}`, { 
      state: { 
        usuario,
      }});
  };

  return (
    <><Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detalles del Proyecto
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

      <TextField
        label="Buscar por nombre o DNI"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={handleSearch} />

      <Typography variant="h4" gutterBottom>
        Usuarios Asignados
      </Typography>

      {loading ? (
        <CircularProgress sx={{ mt: 3 }} />
      ) : filteredUsuarios.length > 0 ? (
        <Grid container spacing={2}>
          {filteredUsuarios.map((usuario) => (
            <Grid item xs={12} sm={6} md={4} key={usuario.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 3,
                  p: 2,
                }}
                onClick={() => handleCardClick(usuario)} // Al hacer clic, redirige y pasa el usuario
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ mt: 3 }}>
          No hay usuarios asignados o no coinciden con la búsqueda.
        </Typography>
      )}
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
