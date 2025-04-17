import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Toolbar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Menu,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProyectos, ProyectoProps } from '../../../context/ProyectosProvider';
import { ProyectosModal } from './proyectosModal';

export function ProyectosView() {
  const { proyectos, fetchProyectos, deleteProyecto } = useProyectos();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('nombre');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proyectoToEdit, setProyectoToEdit] = useState<ProyectoProps | null>(null);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, proyecto: ProyectoProps) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProyecto(proyecto);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProyecto(null);
  };

  const handleEdit = () => {
    if (selectedProyecto) {
      setProyectoToEdit(selectedProyecto);
      setIsModalOpen(true);
      handleMenuClose();
    }
  };

  const handleDelete = async () => {
    if (selectedProyecto) {
      await deleteProyecto(selectedProyecto.id);
      setAlert({ severity: 'success', message: `Proyecto "${selectedProyecto.nombre}" eliminado.` });
      setSnackOpen(true);
      fetchProyectos();
      handleMenuClose();
    }
  };

  const handleOpenModal = () => {
    setProyectoToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProyectoToEdit(null);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const handleProjectClick = (proyecto: ProyectoProps) => {
    navigate(`detalles/${proyecto.id}`); // Navega a la vista de detalle del proyecto
  };

  const filteredProyectos = proyectos.filter(proyecto => {
    const searchValue = filter.toLowerCase();

    switch (filterType) {
      case 'nombre':
        return proyecto.nombre.toLowerCase().includes(searchValue);
      case 'descripcion':
        return proyecto.descripcion.toLowerCase().includes(searchValue);
      case 'provincia':
        return proyecto.provincia.toLowerCase().includes(searchValue);
      case 'localidad':
        return proyecto.localidad.toLowerCase().includes(searchValue);
      case 'alias_pago':
        return proyecto.alias_pago.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  return (
    <><Card sx={{ maxWidth: '100%', margin: '0 20px', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
      <Toolbar
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Typography variant="h4" flexGrow={1}>
          Proyectos
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            padding: 3,
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filtrar por</InputLabel>
            <Select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              label="Filtrar por"
            >
              <MenuItem value="nombre">Nombre</MenuItem>
              <MenuItem value="descripcion">Descripción</MenuItem>
              <MenuItem value="provincia">Provincia</MenuItem>
              <MenuItem value="localidad">Localidad</MenuItem>
              <MenuItem value="alias_pago">Alias de Pago</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            placeholder="Buscar..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            sx={{ width: { xs: '100%', sm: '200px' } }} />
          <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{
            '@media (max-width:600px)': {
              mb: 2,
            },
          }}>
            Nuevo Proyecto
          </Button>
        </Box>
      </Toolbar>

      <Grid container spacing={3}>
        {filteredProyectos.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ width: '100%' }}>
            No se encontraron proyectos
          </Typography>
        ) : (
          filteredProyectos.map((proyecto) => (
            <Grid item xs={12} sm={6} md={4}  key={proyecto.id}>
              <Card sx={{ display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        justifyContent: 'left',
                        padding: 2,
                        height: 200,
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '5px 5px 10px rgba(145 158 171 / 0.2)'
                        }, }}>
                <Box onClick={() => handleProjectClick(proyecto)} sx={{ cursor: 'pointer' }}>
                  <Typography variant="h6">{proyecto.nombre}</Typography>
                  <Typography variant="body2">{proyecto.descripcion}</Typography>
                  <Typography variant="body2">Provincia: {proyecto.provincia}</Typography>
                  <Typography variant="body2">Localidad: {proyecto.localidad}</Typography>
                  <Typography variant="body2">Alias de Pago: {proyecto.alias_pago}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                  <Button
                    variant="text"
                    onClick={(event) => handleMenuClick(event, proyecto)}
                  >
                    ...
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedProyecto?.id === proyecto.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>Editar</MenuItem>
                    <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
                  </Menu>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <ProyectosModal
        open={isModalOpen}
        onClose={handleCloseModal}
        proyectoToEdit={proyectoToEdit} />

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackClose} severity={alert?.severity} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Card><Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
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
