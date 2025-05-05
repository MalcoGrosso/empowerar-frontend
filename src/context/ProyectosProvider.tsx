import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import api from '../config/axiosClient';

export interface ProyectoProps {
  id: number;
  nombre: string;
  descripcion: string;
  provincia: string;
  localidad: string;
  alias_pago: string;
  montoInteres: number;
}

interface UsuarioAsignado {
  id: number;
  montoPago: string;
  montoCuota: number;
  montoAhorrado: number;
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

interface ProyectosContextType {
  proyectos: ProyectoProps[];
  proyectoDetalle: ProyectoProps | null;
  fetchProyectos: () => void;
  fetchProyectoById: (proyectoId: number) => Promise<ProyectoProps | null>;
  deleteProyecto: (proyectoId: number) => Promise<void>;
  createProyecto: (proyecto: Omit<ProyectoProps, 'id'>) => Promise<ProyectoProps>;
  updateProyecto: (proyectoId: number, proyecto: Partial<Omit<ProyectoProps, 'id'>>) => Promise<ProyectoProps>;
  fetchUsuariosPorProyecto: (proyectoId: number) => Promise<UsuarioAsignado[]>;
  agregarUsuarioAProyecto: (dni: string, proyectoId: number, montoPago: number, montoCuota: number, montoAhorrado: number) => Promise<void>;
  editarUsuarioAProyecto: (usuarioId: number, montoPago: number, montoCuota: number, montoAhorrado: number) => Promise<void>;
  eliminarUsuarioAProyecto: (usuarioId: number, proyectoId: number) => Promise<void>;
  fetchElectricistasPorProyecto: (proyectoId: number) => Promise<ElectricistaAsignado[]>;  // Nueva función
  agregarElectricistaAProyecto: (dni: string, proyectoId: number) => Promise<void>;
  eliminarElectricistaAProyecto: (usuarioId: number, proyectoId: number) => Promise<void>;
}

const ProyectosContext = createContext<ProyectosContextType | undefined>(undefined);

export const ProyectosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proyectos, setProyectos] = useState<ProyectoProps[]>([]);
  const [proyectoDetalle, setProyectoDetalle] = useState<ProyectoProps | null>(null);

  const fetchProyectos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/proyectos/allProyectos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProyectos(Array.isArray(response.data) ? response.data : response.data.proyectos || []);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }, []);

  const fetchProyectoById = useCallback(async (proyectoId: number): Promise<ProyectoProps | null> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/proyectos/${proyectoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const proyecto = response.data;
      setProyectoDetalle(proyecto);
      return proyecto;
    } catch (error) {
      console.error("Error al obtener el proyecto:", error);
      setProyectoDetalle(null);
      return null;
    }
  }, []);

  const fetchUsuariosPorProyecto = useCallback(async (proyectoId: number): Promise<UsuarioAsignado[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/proyectos/${proyectoId}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error al obtener los usuarios asignados al proyecto:", error);
      return [];
    }
  }, []);

  const fetchElectricistasPorProyecto = useCallback(async (proyectoId: number): Promise<ElectricistaAsignado[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/proyectos/${proyectoId}/electricistas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error al obtener los electricistas asignados al proyecto:", error);
      return [];
    }
  }, []);

  const agregarUsuarioAProyecto = useCallback(async (dni: string, proyectoId: number, montoCuota: number, montoAhorrado: number, montoPago: number = 0) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/usuariosProyectos/crear`, { dni, proyectoId, montoPago, montoCuota, montoAhorrado }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUsuariosPorProyecto(proyectoId);
    } catch (error) {
      console.error("Error al agregar usuario al proyecto:");
      throw error;
    }
  }, [fetchUsuariosPorProyecto]);

  const agregarElectricistaAProyecto = useCallback(async (dni: string, proyectoId: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/electricistasProyectos/crear`, { dni, proyectoId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchElectricistasPorProyecto(proyectoId);
    } catch (error) {
      console.error("Error al agregar usuario al proyecto:");
      throw error;
    }
  }, [fetchElectricistasPorProyecto]);

  const editarUsuarioAProyecto = useCallback(async (usuarioId: number, montoPago: number, montoCuota: number, montoAhorrado: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/usuariosProyectos/edit/${usuarioId}`, { montoPago, montoCuota, montoAhorrado }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUsuariosPorProyecto(proyectoDetalle?.id || 0);
    } catch (error) {
      console.error("Error al editar el usuario en el proyecto:", error);
      throw error;
    }
  }, [fetchUsuariosPorProyecto, proyectoDetalle?.id]);

  const eliminarUsuarioAProyecto = useCallback(async (usuarioId: number, proyectoId: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/usuariosProyectos/delete/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          proyectoId,
        },
      });
      await fetchUsuariosPorProyecto(proyectoId);
    } catch (error) {
      console.error("Error al eliminar el usuario del proyecto:", error);
      throw error;
    }
  }, [fetchUsuariosPorProyecto]);

  const eliminarElectricistaAProyecto = useCallback(async (usuarioId: number, proyectoId: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/electricistasProyectos/delete/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          proyectoId,
        },
      });
      await fetchElectricistasPorProyecto(proyectoId);
    } catch (error) {
      console.error("Error al eliminar el usuario del proyecto:", error);
      throw error;
    }
  }, [fetchElectricistasPorProyecto]);

  const deleteProyecto = useCallback(async (proyectoId: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/proyectos/${proyectoId}`,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProyectos();
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    }
  }, [fetchProyectos]);

  const createProyecto = useCallback(async (proyecto: Omit<ProyectoProps, 'id'>): Promise<ProyectoProps> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/proyectos/crearProyecto', proyecto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nuevoProyecto = response.data;
      fetchProyectos();
      return nuevoProyecto;
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      throw error;
    }
  }, [fetchProyectos]);

  const updateProyecto = useCallback(async (proyectoId: number, proyecto: Partial<Omit<ProyectoProps, 'id'>>): Promise<ProyectoProps> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/proyectos/edit/${proyectoId}`, proyecto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const proyectoActualizado = response.data;
      fetchProyectos();
      return proyectoActualizado;
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
      throw error;
    }
  }, [fetchProyectos]);

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  const value = useMemo(() => ({
    proyectos,
    proyectoDetalle,
    fetchProyectos,
    fetchProyectoById,
    deleteProyecto,
    createProyecto,
    updateProyecto,
    fetchUsuariosPorProyecto,
    agregarUsuarioAProyecto,
    editarUsuarioAProyecto,
    eliminarUsuarioAProyecto,
    fetchElectricistasPorProyecto,  // Agregar la nueva función aquí
    agregarElectricistaAProyecto,
    eliminarElectricistaAProyecto,

  }), [
    proyectos,
    proyectoDetalle,
    fetchProyectos,
    fetchProyectoById,
    deleteProyecto,
    createProyecto,
    updateProyecto,
    fetchUsuariosPorProyecto,
    agregarUsuarioAProyecto,
    editarUsuarioAProyecto,
    eliminarUsuarioAProyecto,
    fetchElectricistasPorProyecto,  // Asegúrate de agregarla en la lista de dependencias
    agregarElectricistaAProyecto,
    eliminarElectricistaAProyecto,
  
  ]);

  return (
    <ProyectosContext.Provider value={value}>
      {children}
    </ProyectosContext.Provider>
  );
};

export const useProyectos = () => {
  const context = useContext(ProyectosContext);
  if (context === undefined) {
    throw new Error('useProyectos must be used within a ProyectosProvider');
  }
  return context;
};
