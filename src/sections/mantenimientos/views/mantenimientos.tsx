import React, { useState, useEffect, FormEvent } from 'react';
import { Box, Typography, TextField, MenuItem, Button, Grid, Alert } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAlert } from 'src/context/AlertProvider';
import { useMantenimientos } from '../../../context/mantenimientoProvider';



interface FormData {
  id?: number;
  usuariosProyectosId: number;
  electricistasProyectosId: number;
  observaciones: string;
  campo1: string;
  campo2: string;
  campo3: string;
  campo4: string;
  campo5: string;
  campo6: string;
  campo7: string;
  campo8: string;
  campo9: string;
  valorNumerico1: number | string;
  valorNumerico2: number | string;
}

export function MantenimientoFormulario() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();
  const id = useParams().id
  const mantenimientoId = useParams().mantenimientoId
  console.log('asdasd',useParams());
  console.log('state', state);
  const electricistaId = state?.electricistaId ? state.electricistaId : mantenimientoId;
  const isCreateMode = location.pathname.includes('/crear');
  const isEditMode = location.pathname.includes('/editar');
  const isViewMode = location.pathname.includes('/ver');
  const { fetchMantenimientoPorUsuario, crearMantenimiento, editarMantenimiento  } = useMantenimientos();

  const [formData, setFormData] = useState<FormData>({
    usuariosProyectosId: id ? parseInt(id, 10) : 0, // Tomar el `id` de `useParams` si está disponible
    electricistasProyectosId: electricistaId ? parseInt(electricistaId, 10) : 0, // Similar para `mantenimientoId`
    observaciones: '',
    campo1: 'Si',
    campo2: 'Si',
    campo3: 'Si',
    campo4: 'Si',
    campo5: 'Si',
    campo6: 'Si',
    campo7: 'Si',
    campo8: 'Si',
    campo9: 'Si',
    valorNumerico1: '',
    valorNumerico2: '',
  });


  useEffect(() => {
    // Caso para Modo Edición
    if (isEditMode && id && electricistaId) {
      fetchMantenimientoPorUsuario(electricistaId, id).then((mantenimiento) => {
        console.log('asdasda22222',id, electricistaId, state.usuarioId, state.electricistaId)
        if (mantenimiento) {
          // Actualizamos los datos del formulario con la información obtenida
          setFormData((prev) => ({
            ...prev,
            usuariosProyectosId: parseInt(state.usuarioId, 10),
            electricistasProyectosId: parseInt(state.electricistaId, 10),
            observaciones: mantenimiento.observaciones,
            campo1: mantenimiento.campo1,
            campo2: mantenimiento.campo2,
            campo3: mantenimiento.campo3,
            campo4: mantenimiento.campo4,
            campo5: mantenimiento.campo5,
            campo6: mantenimiento.campo6,
            campo7: mantenimiento.campo7,
            campo8: mantenimiento.campo8,
            campo9: mantenimiento.campo9,
            valorNumerico1: mantenimiento.valorNumerico1,
            valorNumerico2: mantenimiento.valorNumerico2,
          }));
        }
      });
    }
  }, [isEditMode, id, electricistaId, state.electricistaId , state.usuarioId , fetchMantenimientoPorUsuario]);
  
  useEffect(() => {
    // Caso para Modo Visualización (Ver)
    if (isViewMode && id && mantenimientoId) {
      fetchMantenimientoPorUsuario(id, mantenimientoId).then((mantenimiento) => {
        console.log('asdasda22222',id, electricistaId, state.usuarioId, state.electricistaId, mantenimientoId)
        if (mantenimiento) {
          // Actualizamos los datos del formulario con la información obtenida
          setFormData((prev) => ({
            ...prev,
            usuariosProyectosId: parseInt(state.usuarioId, 10),
            electricistasProyectosId: parseInt(state.electricistaId, 10),
            observaciones: mantenimiento.observaciones,
            campo1: mantenimiento.campo1,
            campo2: mantenimiento.campo2,
            campo3: mantenimiento.campo3,
            campo4: mantenimiento.campo4,
            campo5: mantenimiento.campo5,
            campo6: mantenimiento.campo6,
            campo7: mantenimiento.campo7,
            campo8: mantenimiento.campo8,
            campo9: mantenimiento.campo9,
            valorNumerico1: mantenimiento.valorNumerico1,
            valorNumerico2: mantenimiento.valorNumerico2,
          }));
        }
      });
    }
  }, [isViewMode, id, electricistaId, state.electricistaId , state.usuarioId , mantenimientoId, fetchMantenimientoPorUsuario]);
  
  useEffect(() => {
    // Caso para Modo Creación
    if (isCreateMode) {
      // Inicializamos los datos del formulario vacíos o con valores predeterminados
      setFormData({
        usuariosProyectosId: id ? parseInt(id, 10) : 0,
        electricistasProyectosId: electricistaId ? parseInt(electricistaId, 10) : 0,
        observaciones: '',
        campo1: '',
        campo2: '',
        campo3: '',
        campo4: '',
        campo5: '',
        campo6: '',
        campo7: '',
        campo8: '',
        campo9: '',
        valorNumerico1: '',
        valorNumerico2: '',
      });
    }
  }, [isCreateMode, id, electricistaId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formattedData = {
      ...formData,
      valorNumerico1: formData.valorNumerico1 === '' ? 0 : Number(formData.valorNumerico1),
      valorNumerico2: formData.valorNumerico2 === '' ? 0 : Number(formData.valorNumerico2),
    };

    if (isCreateMode) {
      try {
        const nuevoMantenimiento = await crearMantenimiento(formattedData);
        if (nuevoMantenimiento) {
          console.log('Mantenimiento creado con éxito:', nuevoMantenimiento);
          showAlert('Mantenimiento creado con éxito', 'success'); 
          navigate(-1);
        } else {
          console.error('Error al crear el mantenimiento');
          showAlert('Error al crear el mantenimiento', 'error');
        }
      } catch (error) {
        console.error('Error al crear mantenimiento:', error);
        showAlert('Error al crear el mantenimiento', 'error');
      }
    } else if (isEditMode) {
      try {
        const mantenimientoActualizado = await editarMantenimiento(Number(id), formattedData);
        if (mantenimientoActualizado) {
          console.log('Mantenimiento editado con éxito:', mantenimientoActualizado);
          showAlert('Mantenimiento editado con éxito', 'success'); 
          navigate(-1);
        } else {
          console.error('Error al editar el mantenimiento');
          showAlert('Error al editar el mantenimiento', 'error');
        }
      } catch (error) {
        console.error('Error al editar mantenimiento:', error);
        showAlert('Error al editar el mantenimiento', 'error');
      }
    }
  };

  return (
    <><Box sx={{ p: 4, maxWidth: '80%', margin: '0 auto', backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>

      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {isCreateMode ? 'Crear Mantenimiento' : isEditMode ? 'Editar Mantenimiento' : 'Ver Mantenimiento'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Instalación Eléctrica
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿La instalación está funcionando correctamente?
            </Typography>
            <TextField
              select
              name="campo1"
              value={formData.campo1}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿Hay elementos sueltos no asegurados como tomas, cables o interruptores?
            </Typography>
            <TextField
              select
              name="campo2"
              value={formData.campo2}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿Hay componentes rotos en funcionamiento como tomas o interruptores?
            </Typography>
            <TextField
              select
              name="campo3"
              value={formData.campo3}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿La conexión de la puesta a tierra se encuentra en buenas condiciones?
            </Typography>
            <TextField
              select
              name="campo4"
              value={formData.campo4}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Instalación Eléctrica
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿Los paneles fotovoltaicos se encuentran sucios o con alguna sombra de árbol, poste, etc?
            </Typography>
            <TextField
              select
              name="campo5"
              value={formData.campo5}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿Hay cables sueltos o falsos contactos en las borneras?
            </Typography>
            <TextField
              select
              name="campo6"
              value={formData.campo6}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿Los bornes de las baterías se encuentran aislados sin posibilidad de acceso a contacto directo?
            </Typography>
            <TextField
              select
              name="campo7"
              value={formData.campo7}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              ¿Se encuentra tierra en los coolers de ventilación del inversor?
            </Typography>
            <TextField
              select
              name="campo8"
              value={formData.campo8}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Advertencias (warnings) y/o Alarmas
            </Typography>
            <TextField
              select
              name="campo9"
              value={formData.campo9}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            >
              {['Si', 'No', 'NC'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Mediciones
            </Typography>
          </Grid>

          {/* Campos numéricos */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Voltaje de Baterías (INPUT BATT)
            </Typography>
            <TextField
              type="number"
              name="valorNumerico1"
              value={formData.valorNumerico1}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Carga en vatios (LOAD W)
            </Typography>
            <TextField
              type="number"
              name="valorNumerico2"
              value={formData.valorNumerico2}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              disabled={isViewMode} // Deshabilitar si no está en modo edición
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Observaciones
            </Typography>
            <TextField
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
              disabled={isViewMode} />
          </Grid>


              
          <Grid item xs={12}>
            {!isViewMode && (
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isViewMode}
                  sx={{ width: 'fit-content' }}
                >
                  {isCreateMode ? 'Crear' : isEditMode ? 'Editar' : ''}
                </Button>
              </Box>
            )}
          </Grid>

        </Grid>
      </form>
      
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


