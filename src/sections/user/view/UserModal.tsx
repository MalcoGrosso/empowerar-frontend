import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { useUsers, UserProps } from '../../../context/UserProvider';
import { useAlert } from '../../../context/AlertProvider'; // Importar el contexto de alertas

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  userToEdit?: UserProps | null;
}

export const UserModal: React.FC<UserModalProps> = ({ open, onClose, userToEdit }) => {
  const { createUser, updateUser } = useUsers();
  const { showAlert } = useAlert(); // Usar el contexto de alertas
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dni: '',
    direccion: '',
    estado: true,
    role: 'usuario',
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      // Si hay un usuario para editar, establecer los valores en el formulario
      setFormValues({
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        password: '',
        dni: userToEdit.dni,
        direccion: userToEdit.direccion,
        estado: userToEdit.estado,
        role: userToEdit.role,
      });
      setError(null); // Reiniciar el error al editar
    } else if (open) {
      // Solo reiniciar el formulario si el modal se abre y no hay usuario para editar
      resetForm();
    }
  }, [userToEdit, open]);

  const resetForm = () => {
    setFormValues({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      dni: '',
      direccion: '',
      estado: true,
      role: 'usuario',
    });
    setError(null); // Reiniciar el error
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'dni' && !/^\d*$/.test(value)) return; // Solo permite números
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name as string]: value });
  };

  const handleSubmit = async () => {
    try {
      let userResponse: UserProps; // Variable para almacenar la respuesta
      if (userToEdit) {
        userResponse = await updateUser(userToEdit.id, { 
          ...formValues, 
          ...(formValues.password ? { password: formValues.password } : {}) // Solo incluye la contraseña si no está vacía
        });
        showAlert(`Usuario ${formValues.firstName} ${formValues.lastName} actualizado.`, 'success'); // Mensaje de éxito para actualización
      } else {
        userResponse = await createUser(formValues); // Crear nuevo usuario
        showAlert(`Usuario ${formValues.firstName} ${formValues.lastName} creado.`, 'success'); // Mensaje de éxito para creación
        resetForm(); // Reiniciar el formulario después de crear un nuevo usuario
      }
      console.log('Usuario guardado:', userResponse); // Aquí puedes manejar la respuesta
      onClose(); // Cierra el modal
    } catch (er) {
      setError(er.response?.data?.error || 'Error al guardar el usuario');
      showAlert('Error al guardar el usuario', 'error');
    }
  };

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const areFieldsValid = () =>
    formValues.firstName.trim() !== '' &&
    formValues.lastName.trim() !== '' &&
    isEmailValid(formValues.email) &&
    formValues.dni.trim() !== '' &&
    formValues.direccion.trim() !== '';

  return (
    <Modal 
        open={open} 
        onClose={onClose} // Esto habilita el cierre al hacer clic fuera del modal
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // Centra el modal
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 1,
            width: '90%', // Ancho relativo para dispositivos móviles
            maxWidth: '400px', // Límite máximo de ancho
            boxShadow: 24, // Sombra para destacar el modal
          }}
        >
          <Typography variant="h6" gutterBottom>
            {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Typography>
          <TextField label="Nombre" name="firstName" value={formValues.firstName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Apellido" name="lastName" value={formValues.lastName} onChange={handleChange} fullWidth margin="normal" />
          <TextField 
            label="Correo" 
            name="email" 
            value={formValues.email} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            error={!isEmailValid(formValues.email) && formValues.email.length > 0} 
            helperText={!isEmailValid(formValues.email) && formValues.email.length > 0 ? 'El correo debe contener un @' : ''} 
          />
          <TextField label="Contraseña" name="password" type="password" value={formValues.password} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="DNI" name="dni" value={formValues.dni} onChange={handleChange} fullWidth margin="normal" inputProps={{ inputMode: 'text' }} />
          <TextField label="Dirección" name="direccion" value={formValues.direccion} onChange={handleChange} fullWidth margin="normal" />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select name="role" value={formValues.role} onChange={handleSelectChange}>
              <MenuItem value="usuario">Usuario</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="electricista">Electricista</MenuItem>
            </Select>
          </FormControl>

          {error && <Typography color="error">{error}</Typography>}
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            disabled={!areFieldsValid()} 
            sx={{ mt: 2 }}
          >
            {userToEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </Box>
    </Modal>

  );
};
