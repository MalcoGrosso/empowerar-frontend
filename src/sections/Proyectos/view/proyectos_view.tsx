import React, { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
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
import { useUsers, UserProps } from '../../../context/UserProvider';
import { UserModal } from './UserModal';

export function ProyectosView() {
  const { users, fetchUsers, deleteUser } = useUsers();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProps | null>(null);
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPageAll = () => {
    setRowsPerPage(users.length);
    setPage(0);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, user: UserProps) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      setUserToEdit(selectedUser);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setAlert({ severity: 'success', message: `Usuario ${selectedUser.firstName} ${selectedUser.lastName} eliminado.` });
      setSnackOpen(true);
      handleMenuClose();
      fetchUsers();
    }
  };

  const handleOpenModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchValue = filter.toLowerCase();

    switch (filterType) {
      case 'name':
        return fullName.includes(searchValue);
      case 'email':
        return user.email.toLowerCase().includes(searchValue);
      case 'dni':
        return user.dni.toLowerCase().includes(searchValue);
      case 'direccion':
        return user.direccion.toLowerCase().includes(searchValue);
      case 'role':
        return user.role.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  return (
    <Card sx={{ maxWidth: '100%', margin: '0 20px', p: { xs: 2, sm: 3 }, overflowX: 'auto' }}>
      <Toolbar
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Typography variant="h4" flexGrow={1}>
          Usuarios
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            justifyContent: { xs: 'center', sm: 'flex-end' },
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filtrar por</InputLabel>
            <Select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              label="Filtrar por"
            >
              <MenuItem value="name">Nombre</MenuItem>
              <MenuItem value="email">Correo</MenuItem>
              <MenuItem value="dni">DNI</MenuItem>
              <MenuItem value="direccion">Dirección</MenuItem>
              <MenuItem value="role">Rol</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            placeholder="Buscar..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            sx={{ width: { xs: '100%', sm: '200px' } }}
          />
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Nuevo usuario
          </Button>
        </Box>
      </Toolbar>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.dni}</TableCell>
                <TableCell>{user.direccion}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="center">{user.estado ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell align="right">
                  <Button variant="text" onClick={(event) => handleMenuClick(event, user)}>
                    ...
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedUser?.id === user.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>Editar</MenuItem>
                    <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} 
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={
          <>
            Filas por Página:
            <Button onClick={handleChangeRowsPerPageAll}>Todos</Button>
          </>
        }
      />

      <UserModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        userToEdit={userToEdit} 
      />

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackClose} severity={alert?.severity} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
