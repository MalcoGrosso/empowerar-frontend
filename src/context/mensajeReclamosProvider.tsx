import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import api from '../config/axiosClient'; // Instancia de Axios

// Definición del tipo para los mensajes de reclamo
interface MensajeReclamo {
  usuario: {
    id: number;
    firstName: string;
    lastName: string;
  };
  id: number;
  reclamoId: number;
  userId: number;
  mensaje: string;
  createdAt: string;
}

// Tipo para el contexto de los mensajes de reclamo
interface MensajeReclamosContextType {
  mensajes: MensajeReclamo[];
  crearMensaje: (reclamoId: number, mensaje: string) => Promise<void>;
  obtenerMensajes: (reclamoId: number) => Promise<void>;
}

// Crear el contexto con valor inicial undefined
const MensajeReclamosContext = createContext<MensajeReclamosContextType | undefined>(undefined);

// Proveedor para los mensajes de reclamo
export const MensajeReclamosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mensajes, setMensajes] = useState<MensajeReclamo[]>([]);

  // Función para crear un mensaje
  const crearMensaje = useCallback(async (reclamoId: number, mensaje: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await api.post(
        '/reclamos/detalle/crear',  // Endpoint para crear el mensaje
        { reclamoId, mensaje },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Si la creación es exitosa, actualizamos el estado con el nuevo mensaje
      setMensajes((prevMensajes) => [...prevMensajes, response.data.mensaje]);
    } catch (error) {
      console.error('Error al crear mensaje:', error);
    }
  }, []);

  // Función para obtener los mensajes de un reclamo específico
  const obtenerMensajes = useCallback(async (reclamoId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado');
      }

      const response = await api.get(`/reclamos/detalle/${reclamoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizamos el estado con los mensajes obtenidos
      setMensajes(response.data.mensajes);
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
    }
  }, []);

  // Usamos useMemo para memorizar el objeto de contexto y evitar que cambie en cada renderizado
  const value = useMemo(() => ({
    mensajes,
    crearMensaje,
    obtenerMensajes,
  }), [mensajes, crearMensaje, obtenerMensajes]);

  return (
    <MensajeReclamosContext.Provider value={value}>
      {children}
    </MensajeReclamosContext.Provider>
  );
};

// Hook para usar el contexto de los mensajes de reclamo
export const useMensajeReclamos = (): MensajeReclamosContextType => {
  const context = useContext(MensajeReclamosContext);
  if (!context) {
    throw new Error('useMensajeReclamos debe ser usado dentro de un MensajeReclamosProvider');
  }
  return context;
};
