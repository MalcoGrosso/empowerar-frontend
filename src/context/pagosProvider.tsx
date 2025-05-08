import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import api from '../config/axiosClient';

export interface PagoProps {
  createdAt: Date;
  id: number;
  monto: number;
  comprobante: string;
  estado: string;
  interes: boolean;
  usuariosProyectosId: number;
  usuarioProyecto?: {
    montoCuota: string;
    montoAhorrado: number;
  }
}

interface PagosContextType {
  pagos: PagoProps[];
  loading: boolean; // Estado de carga añadido
  fetchPagos: () => void;
  fetchPagosAdmin: (userId: number) => Promise<void>;
  createPago: (pago: Omit<PagoProps, 'id'>) => Promise<PagoProps>;
  updatePago: (pagoId: number, pago: Partial<Omit<PagoProps, 'id'>>) => Promise<PagoProps>;
}

const PagosContext = createContext<PagosContextType | undefined>(undefined);

export const PagosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pagos, setPagos] = useState<PagoProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga

  const fetchPagos = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/pagos/usuario', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pagosConFecha = response.data.map((pago: PagoProps) => {
        let fecha = new Date(pago.createdAt);
        if (Number.isNaN(fecha.getTime())) {
          fecha = new Date('1970-01-01');
        }
        return {
          ...pago,
          createdAt: fecha,
        };
      });
      setPagos(Array.isArray(pagosConFecha) ? pagosConFecha : []);
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPagosAdmin = useCallback(async (usuarioId?: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/pagos/admin/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: usuarioId ? { usuarioId } : {}, // Agregar el usuarioId si está disponible
      });
      setPagos(response.data);
    } catch (error) {
      console.error("Error al obtener los pagos para admin:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPago = useCallback(async (pago: Omit<PagoProps, 'id'>): Promise<PagoProps> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/api/pagos', pago, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newPago = response.data;
      fetchPagos(); // Actualiza la lista de pagos
      return newPago;
    } catch (error) {
      console.error("Error al crear el pago:", error);
      throw error;
    }
  }, [fetchPagos]);

  const updatePago = useCallback(async (pagoId: number, pago: Partial<Omit<PagoProps, 'id'>>): Promise<PagoProps> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/pagos/actualizarPagos/${pagoId}`, pago, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedPago = response.data;
      fetchPagos(); // Actualiza la lista de pagos
      return updatedPago;
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
      throw error;
    }
  }, [fetchPagos]);

  

  const value = useMemo(() => ({
    pagos,
    loading, // Incluir el estado de carga en el contexto
    fetchPagos,
    fetchPagosAdmin,
    createPago,
    updatePago,
  }), [pagos, loading, fetchPagos, fetchPagosAdmin, createPago, updatePago]);

  return (
    <PagosContext.Provider value={value}>
      {children}
    </PagosContext.Provider>
  );
};

export const usePagos = () => {
  const context = useContext(PagosContext);
  if (context === undefined) {
    throw new Error('usePagos must be used within a PagosProvider');
  }
  return context;
};
