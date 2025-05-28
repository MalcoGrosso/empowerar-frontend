import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress,
  Divider, Box, Button, TextField, TablePagination, Menu, MenuItem, TableContainer,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Snackbar, Alert
} from '@mui/material';
import { useProyectos, ProyectoProps } from '../../../context/ProyectosProvider';
import { AgregarUsuarioModal, AgregarElectricistaModal } from './proyectosVistaDetalleModal';
import EditarMontoModal from './EditarMontoModal';

interface UsuarioAsignado {
  
  id: number;
  montoPago: string;
  montoCuota: string;
  montoAhorrado: number;
  equipoAsignado: string;
  createdAt: Date;
  usuario: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
  };
}

interface ElectricistaAsignado {
  id: number;
  electricista: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
  };
}

export const ProyectosVistaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    fetchProyectoById, 
    fetchUsuariosPorProyecto, 
    fetchElectricistasPorProyecto, 
    agregarUsuarioAProyecto, 
    eliminarUsuarioAProyecto, 
    editarUsuarioAProyecto, 
    agregarElectricistaAProyecto, 
    eliminarElectricistaAProyecto 
  } = useProyectos();
  
  const [proyecto, setProyecto] = useState<ProyectoProps | null>(null);
  const [usuariosAsignados, setUsuariosAsignados] = useState<UsuarioAsignado[]>([]);
  const [electricistasAsignados, setElectricistasAsignados] = useState<ElectricistaAsignado[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingElectricistas, setLoadingElectricistas] = useState(true);
  const [modalOpenUsuario, setModalOpenUsuario] = useState(false);
  const [modalOpenElectricista, setModalOpenElectricista] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchDniUsuarios, setSearchDniUsuarios] = useState('');
  const [searchDniElectricistas, setSearchDniElectricistas] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UsuarioAsignado | null>(null);
  const [selectedElec, setSelectedElec] = useState<ElectricistaAsignado | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); 
  const [confirmDeleteOpenElec, setConfirmDeleteOpenElec] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const loadProyecto = async () => {
      setLoading(true);
      const fetchedProyecto = await fetchProyectoById(Number(id));
      setProyecto(fetchedProyecto);
      setLoading(false);
    };
    loadProyecto();
  }, [id, fetchProyectoById]);

  const loadUsuariosAsignados = useCallback(async () => {
    setLoadingUsuarios(true);
    const fetchedUsuarios = await fetchUsuariosPorProyecto(Number(id));
    setUsuariosAsignados(fetchedUsuarios);
    setLoadingUsuarios(false);
  }, [id, fetchUsuariosPorProyecto]);

  const loadElectricistasAsignados = useCallback(async () => {
    setLoadingElectricistas(true);
    const fetchedElectricistas = await fetchElectricistasPorProyecto(Number(id));
    setElectricistasAsignados(fetchedElectricistas);
    setLoadingElectricistas(false);
  }, [id, fetchElectricistasPorProyecto]);

  useEffect(() => {
    loadUsuariosAsignados();
    loadElectricistasAsignados();
  }, [loadUsuariosAsignados, loadElectricistasAsignados]);

  const handleOpenModalUsuario = () => {
    setModalOpenUsuario(true);
  };

  const handleCloseModalUsuario = () => {
    setModalOpenUsuario(false);
  };

  const handleOpenModalElectricista = () => {
    setModalOpenElectricista(true);
  };

  const handleCloseModalElectricista = () => {
    setModalOpenElectricista(false);
  };

  const handleAgregarUsuario = async (dni: string, montoPago: number, montoCuota: string, equipoAsignado: string ,montoAhorrado: number) => {
    try {
      await agregarUsuarioAProyecto(dni, Number(id), montoCuota, montoAhorrado, equipoAsignado ,montoPago);
      setSuccess('Usuario agregado correctamente');
      loadUsuariosAsignados();
      handleCloseModalUsuario();
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    }
  };

  const handleAgregarElectricista = async (dni: string) => {
    try {
      await agregarElectricistaAProyecto(dni, Number(id));
      setSuccess('Electricista agregado correctamente');
      loadElectricistasAsignados();
      handleCloseModalElectricista();
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      console.error('Error al agregar electricista:', error);
      throw error;
    }
  };

  const confirmDeleteUsuario = (usuarioId: number) => {
    setSelectedUser(usuariosAsignados.find(user => user.id === usuarioId) || null);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteElectricista = (electricistaId: number) => {
    setSelectedElec(electricistasAsignados.find(el => el.id === electricistaId) || null);
    setConfirmDeleteOpenElec(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        await eliminarUsuarioAProyecto(selectedUser.id, Number(id));
        setSuccess('Usuario eliminado correctamente');
        loadUsuariosAsignados();
        setConfirmDeleteOpen(false);
        handleMenuClose();
        setTimeout(() => setSuccess(null), 5000);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
      }
    }
  };

  const handleDeleteConfirmElec = async () => {
    if (selectedElec) {
      try {
        await eliminarElectricistaAProyecto(selectedElec.id, Number(id));
        setSuccess('Electricista eliminado correctamente');
        loadElectricistasAsignados();
        setConfirmDeleteOpenElec(false);
        handleMenuClose();
        setTimeout(() => setSuccess(null), 5000);
      } catch (error) {
        console.error('Error al eliminar electricista:', error);
        throw error;
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  const handleCancelDeleteElec = () => {
    setConfirmDeleteOpenElec(false);
  };

  const handleSearchChangeUsuarios = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDniUsuarios(event.target.value);
    setPage(0);
  };

  const handleSearchChangeElectricistas = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDniElectricistas(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, usuario: UsuarioAsignado) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(usuario);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveEdit = async (montoPago: number, montoCuota: string, montoAhorrado: number, equipoAsignado: string, createdAt: Date) => {
    if (selectedUser) {
      try {
        await editarUsuarioAProyecto(selectedUser.id, montoPago, montoCuota, montoAhorrado, equipoAsignado, createdAt);
        setSuccess('Usuario editado correctamente');
        loadUsuariosAsignados();
        handleCloseEditModal();
        setTimeout(() => setSuccess(null), 5000);
      } catch (error) {
        console.error('Error al editar el Usuario:', error);
        setSuccess('Error al editar el Usuario');
        setTimeout(() => setSuccess(null), 5000);
      }
    }
  };

  const filteredUsuarios = usuariosAsignados.filter((usuario) =>
    usuario.usuario.dni.includes(searchDniUsuarios)
  );
  const filteredElectricistas = electricistasAsignados.filter((electricista) =>
    electricista.electricista.dni.includes(searchDniElectricistas)
  );

  const paginatedUsuarios = filteredUsuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const paginatedElectricistas = filteredElectricistas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return <Typography variant="h6" align="center" sx={{ mt: 4 }}>Cargando proyecto...</Typography>;
  }

  if (!proyecto) {
    return <Typography variant="h6" align="center" sx={{ mt: 4 }}>Proyecto no encontrado.</Typography>;
  }

  return (
    <><Box sx={{ width: '100%', padding: 2 }}>
      {/* Proyecto info card */}
      <Card sx={{ padding: 3, boxShadow: 3, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>{proyecto.nombre}</Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>{proyecto.descripcion}</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2"><strong>Provincia:</strong> {proyecto.provincia}</Typography>
          <Typography variant="body2"><strong>Localidad:</strong> {proyecto.localidad}</Typography>
          <Typography variant="body2"><strong>Alias de Pago:</strong> {proyecto.alias_pago}</Typography>
          <Typography variant="body2"><strong>Monto Interes:</strong> {proyecto.montoInteres}%</Typography>
        </Box>
      </Card>

      {/* Usuarios card */}
      <Card sx={{ marginTop: 4, padding: 3, boxShadow: 3, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Usuarios Asignados</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenModalUsuario}>Agregar Usuario</Button>
        </Box>

        <TextField
          label="Buscar por DNI"
          variant="outlined"
          size="small"
          fullWidth
          value={searchDniUsuarios}
          onChange={handleSearchChangeUsuarios}
          sx={{ marginBottom: 2 }} />

        {loadingUsuarios ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : usuariosAsignados.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
            No hay usuarios asignados.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nombre</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>DNI</strong></TableCell>
                    <TableCell><strong>Fecha de Asignacion</strong></TableCell>
                    <TableCell align="center"><strong>Equipo Asignado</strong></TableCell>
                    <TableCell><strong>Monto de Pago</strong></TableCell>
                    <TableCell><strong>Cantidad de Cuotas</strong></TableCell>
                    <TableCell><strong>Monto Ahorrado</strong></TableCell>
                    <TableCell><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.usuario.firstName} {usuario.usuario.lastName}</TableCell>
                      <TableCell>{usuario.usuario.email}</TableCell>
                      <TableCell>{usuario.usuario.dni}</TableCell>
                      <TableCell>
                        {usuario.createdAt
                          ? new Date(
                              new Date(usuario.createdAt).getTime() + 3 * 60 * 60 * 1000 // sumar 3 horas
                            ).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : ''}
                      </TableCell>
                      <TableCell>{usuario.equipoAsignado}</TableCell>
                      <TableCell>{usuario.montoPago}</TableCell>
                      <TableCell>{usuario.montoCuota}</TableCell>
                      <TableCell>{usuario.montoAhorrado}</TableCell>
                      <TableCell>
                        <Button onClick={(e) => handleMenuClick(e, usuario)}>...</Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedUser?.id === usuario.id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleOpenEditModal}>Editar</MenuItem>
                          <MenuItem onClick={() => confirmDeleteUsuario(usuario.id)}>Eliminar</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsuarios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage} />
          </>
        )}
      </Card>

      {/* Electricistas card */}
      <Card sx={{ marginTop: 4, padding: 3, boxShadow: 3, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>Electricistas Asignados</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenModalElectricista}>Agregar Electricista</Button>
        </Box>

        <TextField
          label="Buscar por DNI"
          variant="outlined"
          size="small"
          fullWidth
          value={searchDniElectricistas}
          onChange={handleSearchChangeElectricistas}
          sx={{ marginBottom: 2 }} />

        {loadingElectricistas ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : electricistasAsignados.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
            No hay electricistas asignados.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nombre</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>DNI</strong></TableCell>
                    <TableCell><strong>Acciones</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedElectricistas.map((electricista) => (
                    <TableRow key={electricista.id}>
                      <TableCell>{electricista.electricista.firstName} {electricista.electricista.lastName}</TableCell>
                      <TableCell>{electricista.electricista.email}</TableCell>
                      <TableCell>{electricista.electricista.dni}</TableCell>
                      <TableCell>
                        <Button onClick={() => confirmDeleteElectricista(electricista.id)}>Eliminar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredElectricistas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage} />
          </>
        )}
      </Card>

      {/* Modal para agregar usuario */}
      <AgregarUsuarioModal
        open={modalOpenUsuario}
        onClose={handleCloseModalUsuario}
        onAgregar={handleAgregarUsuario} />

      {/* Modal para agregar Electricista */}
      <AgregarElectricistaModal
        open={modalOpenElectricista}
        onClose={handleCloseModalElectricista}
        onAgregar={handleAgregarElectricista} />

      {/* Modal para editar monto */}
      <EditarMontoModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        montoPago={selectedUser?.montoPago ? parseFloat(selectedUser.montoPago) : 0}
        nombre={`${selectedUser?.usuario.firstName} ${selectedUser?.usuario.lastName}`}
        dni={selectedUser?.usuario.dni || ''} 
        equipoAsignado={selectedUser?.equipoAsignado || ''}
        montoCuota={String(selectedUser?.montoCuota ?? 0)}
        montoAhorrado={selectedUser?.montoAhorrado ?? 0}
        createdAt={new Date(selectedUser?.createdAt ?? new Date())}
         />

      {/* Dialogo de confirmación de eliminación para usuarios */}
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar a este usuario del proyecto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de confirmación de eliminación para electricistas */}
      <Dialog open={confirmDeleteOpenElec} onClose={handleCancelDeleteElec}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar a este electricista del proyecto?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeleteElec} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteConfirmElec} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de éxito */}
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={5000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
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
};

export default ProyectosVistaDetalle;
