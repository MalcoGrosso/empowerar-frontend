import React, { createContext, useState, useMemo, useCallback, ReactNode } from 'react';
import api from '../config/axiosClient';

interface Proyecto {
  nombre: string;
}

interface Usuario {
  firstName: string;
  lastName: string;
}

interface UsuariosProyectos {
  id: number;
  montoPago: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  proyectoId: number;
  usuario: Usuario;
  proyecto: Proyecto;
}

interface Reclamo {
  id: number;
  titulo: string;
  problema: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  usuariosProyectosId: number;
  usuariosProyectos: UsuariosProyectos;
}

interface ReclamosContextType {
  misReclamos: Reclamo[];
  obtenerMisReclamos: () => void;
  crearReclamo: (titulo: string, problema: string) => void;
  actualizarEstadoReclamo: (id: number, estado: string) => void; // Nueva función
}

const ReclamosContext = createContext<ReclamosContextType | undefined>(undefined);

interface ReclamosProviderProps {
  children: ReactNode;
}

const ReclamosProvider: React.FC<ReclamosProviderProps> = ({ children }) => {
  const [misReclamos, setMisReclamos] = useState<Reclamo[]>([]);

  // Obtener mis reclamos con información del usuario y proyecto
  const obtenerMisReclamos = useCallback(async () => {
    try {
      const response = await api.get('/reclamos/mis-reclamos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      setMisReclamos(response.data);
    } catch (error) {
      console.error('Error al obtener los reclamos del usuario:', error);
    }
  }, []);

  const crearReclamo = useCallback(async (titulo: string, problema: string) => {
    try {
      const response = await api.post(
        '/reclamos/crear',
        { titulo, problema, estado: 'pendiente' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const respuesta = response.data;
      obtenerMisReclamos(); // Actualiza los reclamos después de crear uno nuevo
      return respuesta; // Retorna el response si fue exitoso
    } catch (error) {
      let errorMessage = 'Error al crear el reclamo';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage); // Lanza una excepción si hay un error
    }
  }, [obtenerMisReclamos]);

  // Función para actualizar el estado del reclamo
  const actualizarEstadoReclamo = useCallback(async (id: number, estado: string) => {
    try {
      const response = await api.put(
        `/reclamos/${id}/estado`, // Asegúrate de que la ruta sea la correcta
        { estado },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const updatedReclamo = response.data.reclamo;
      
      // Actualiza el estado local con el reclamo actualizado
      setMisReclamos((prevReclamos) =>
        prevReclamos.map((reclamo) =>
          reclamo.id === id ? { ...reclamo, estado: updatedReclamo.estado } : reclamo
        )
      );

      return updatedReclamo; // Devuelve el reclamo actualizado
    } catch (error) {
      let errorMessage = 'Error al actualizar el estado del reclamo';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage); // Lanza una excepción si hay un error
    }
  }, []);

  // Usamos useMemo para pasar las funciones y valores del contexto sin causar renderizados innecesarios
  const value = useMemo(
    () => ({
      misReclamos,
      obtenerMisReclamos,
      crearReclamo,
      actualizarEstadoReclamo, // Pasamos la nueva función al contexto
    }),
    [misReclamos, obtenerMisReclamos, crearReclamo, actualizarEstadoReclamo]
  );

  return <ReclamosContext.Provider value={value}>{children}</ReclamosContext.Provider>;
};

const useReclamos = () => {
  const context = React.useContext(ReclamosContext);
  if (!context) {
    throw new Error('useReclamos debe ser usado dentro de un ReclamosProvider');
  }
  return context;
};

export { ReclamosProvider, useReclamos };
