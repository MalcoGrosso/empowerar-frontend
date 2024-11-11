import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useProyectos, ProyectoProps } from '../../../context/ProyectosProvider'; // Importar el contexto de proyectos
import { useAlert } from '../../../context/AlertProvider'; // Importar el contexto de alertas

interface ProyectosModalProps {
  open: boolean;
  onClose: () => void;
  proyectoToEdit?: ProyectoProps | null;
}

export const ProyectosModal: React.FC<ProyectosModalProps> = ({ open, onClose, proyectoToEdit }) => {
  const { createProyecto, updateProyecto } = useProyectos();
  const { showAlert } = useAlert(); // Usar el contexto de alertas
  const [formValues, setFormValues] = useState<{
    nombre: string;
    descripcion: string; // Cambiado a 'descripcion'
    provincia: string;   // Nuevo campo
    localidad: string;   // Nuevo campo
    alias_pago: string;  // Nuevo campo
  }>({
    nombre: '',
    descripcion: '', // Cambiado a 'descripcion'
    provincia: '',   // Inicializado
    localidad: '',   // Inicializado
    alias_pago: '',  // Inicializado
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (proyectoToEdit) {
      // Si hay un proyecto para editar, establecer los valores en el formulario
      setFormValues({
        nombre: proyectoToEdit.nombre,
        descripcion: proyectoToEdit.descripcion, // Cambiado a 'descripcion'
        provincia: proyectoToEdit.provincia,   // Nuevo campo
        localidad: proyectoToEdit.localidad,   // Nuevo campo
        alias_pago: proyectoToEdit.alias_pago,  // Nuevo campo
      });
      setError(null); // Reiniciar el error al editar
    } else if (open) {
      // Solo reiniciar el formulario si el modal se abre y no hay proyecto para editar
      resetForm();
    }
  }, [proyectoToEdit, open]);

  const resetForm = () => {
    setFormValues({
      nombre: '',
      descripcion: '', // Cambiado a 'descripcion'
      provincia: '',   // Inicializado
      localidad: '',   // Inicializado
      alias_pago: '',  // Inicializado
    });
    setError(null); // Reiniciar el error
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      let proyectoResponse: ProyectoProps; // Variable para almacenar la respuesta
      if (proyectoToEdit) {
        proyectoResponse = await updateProyecto(proyectoToEdit.id, formValues);
        showAlert(`Proyecto "${formValues.nombre}" actualizado.`, 'success'); // Mensaje de éxito para actualización
      } else {
        proyectoResponse = await createProyecto(formValues); // Crear nuevo proyecto
        showAlert(`Proyecto "${formValues.nombre}" creado.`, 'success'); // Mensaje de éxito para creación
        resetForm(); // Reiniciar el formulario después de crear un nuevo proyecto
      }
      console.log('Proyecto guardado:', proyectoResponse); // Aquí puedes manejar la respuesta
      onClose(); // Cierra el modal
    } catch (er) {
      setError(er.response?.data?.error || 'Error al guardar el proyecto');
      showAlert('Error al guardar el proyecto', 'error');
    }
  };

  const areFieldsValid = () => 
    formValues.nombre.trim() !== '' && 
    formValues.descripcion.trim() !== '' && // Cambiado a 'descripcion'
    formValues.provincia.trim() !== '' && // Validación para nuevo campo
    formValues.localidad.trim() !== '' && // Validación para nuevo campo
    formValues.alias_pago.trim() !== '';   // Validación para nuevo campo

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, width: '400px', mx: 'auto', mt: '10%' }}>
        <Typography variant="h6" gutterBottom>{proyectoToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</Typography>
        <TextField label="Nombre" name="nombre" value={formValues.nombre} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Descripción" name="descripcion" value={formValues.descripcion} onChange={handleChange} fullWidth margin="normal" /> {/* Cambiado a 'descripcion' */}
        <TextField label="Provincia" name="provincia" value={formValues.provincia} onChange={handleChange} fullWidth margin="normal" /> {/* Nuevo campo */}
        <TextField label="Localidad" name="localidad" value={formValues.localidad} onChange={handleChange} fullWidth margin="normal" /> {/* Nuevo campo */}
        <TextField label="Alias de Pago" name="alias_pago" value={formValues.alias_pago} onChange={handleChange} fullWidth margin="normal" /> {/* Nuevo campo */}

        {error && <Typography color="error">{error}</Typography>}
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit} 
          disabled={!areFieldsValid()} 
          sx={{ mt: 2 }}
        >
          {proyectoToEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </Box>
    </Modal>
  );
};
