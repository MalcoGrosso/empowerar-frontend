import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import api from '../config/axiosClient';

export interface ProyectoProps {
  id: number;
  nombre: string;
  descripcion: string;
  provincia: string;
  localidad: string;
  alias_pago: string;
  electricistasProyectosId: number; // Añadir este campo
}


interface Mantenimiento {
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
  valorNumerico1: number;
  valorNumerico2: number;
}

interface MantenimientosContextType {
  proyectosDelElectricista: ProyectoProps[];
  fetchProyectosDelElectricista: () => Promise<ProyectoProps[]>;
  fetchFechasMantenimientos: (usuarioId: string) => Promise<{ id: number; fecha: Date }[]>;
  mantenimientosDelUsuario: Mantenimiento[];
  fetchMantenimientosPorUsuario: (usuarioId: string) => Promise<Mantenimiento[]>;
  fetchMantenimientoPorUsuario: (usuarioId: string, mantenimientoId: string) => Promise<Mantenimiento | null>; // Nueva función
  crearMantenimiento: (mantenimientoData: Mantenimiento) => Promise<Mantenimiento | null>;
  fetchFechasMantenimientosUsuarios: () => Promise<{ id: number; fecha: Date }[]>;
  fetchMantenimientoPorId: (mantenimientoId: string) => Promise<Mantenimiento | null>;
  eliminarMantenimiento: (mantenimientoId: number) => Promise<void>;
  editarMantenimiento: (
    mantenimientoId: number,
    mantenimientoData: {
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
      valorNumerico1: number;
      valorNumerico2: number;
    }
  ) => Promise<Mantenimiento | null>;
  loading: boolean;
}

const MantenimientosContext = createContext<MantenimientosContextType | undefined>(undefined);

export const MantenimientosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proyectosDelElectricista, setProyectosDelElectricista] = useState<ProyectoProps[]>([]);
  const [mantenimientosDelUsuario, setMantenimientosDelUsuario] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProyectosDelElectricista = useCallback(async (): Promise<ProyectoProps[]> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        setLoading(false);
        return [];
      }
  
      // Realizamos la solicitud al backend para obtener los proyectos del electricista
      const response = await api.get('/proyectos/asd/electricista', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Asegurarnos de que la respuesta sea un array y luego mapear los datos correctamente
      const proyectos = Array.isArray(response.data) ? response.data.map((proyecto: any) => ({
        ...proyecto.proyecto,  // Incluimos los datos del proyecto
        electricistasProyectosId: proyecto.electricistasProyectosId,  // Añadimos el ID de la relación
      })) : [];
  
      setProyectosDelElectricista(proyectos);
      setLoading(false);
  
      return proyectos;
    } catch (error) {
      console.error("Error al obtener los proyectos del electricista logueado:", error);
      setLoading(false);
      return [];
    }
  }, []);

// Obtener fechas de mantenimientos
const fetchFechasMantenimientos = useCallback(async (usuarioId: string): Promise<{ id: number, fecha: Date }[]> => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      setLoading(false);
      return [];
    }

    const response = await api.get(`/mantenimientos/fechas/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Procesa las fechas y añade el id del mantenimiento
    const fechas = response.data.map((item: { id: number, createdAt: string }) => ({
      id: item.id, // Mantenemos el ID
      fecha: new Date(item.createdAt), // Convertimos la fecha a un objeto Date
    }));

    setLoading(false);
    return fechas;
  } catch (error) {
    console.error("Error al obtener las fechas de mantenimientos:", error);
    setLoading(false);
    return [];
  }
}, []);

  // Obtener mantenimientos por usuario
  const fetchMantenimientosPorUsuario = useCallback(async (usuarioId: string): Promise<Mantenimiento[]> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        setLoading(false);
        return [];
      }

      const response = await api.get(`/mantenimientos/usuario/${usuarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Mantenimientos del usuario:', response.data);

      const mantenimientos = response.data;
      setMantenimientosDelUsuario(mantenimientos);
      setLoading(false);

      return mantenimientos;
    } catch (error) {
      console.error("Error al obtener los mantenimientos del usuario:", error);
      setLoading(false);
      return [];
    }
  }, []);

  // Obtener un mantenimiento específico por usuario
  const fetchMantenimientoPorUsuario = useCallback(
    async (usuarioId: string, mantenimientoId: string): Promise<Mantenimiento | null> => {
      console.log('usuarioId, mantenimientoId')
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token no encontrado');
          setLoading(false);
          return null;
        }

        const response = await api.get(`/mantenimientos/manus/${usuarioId}/${mantenimientoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Mantenimiento obtenido:', response.data);

        setLoading(false);
        return response.data as Mantenimiento;
      } catch (error) {
        console.error('Error al obtener el mantenimiento específico:', error);
        setLoading(false);
        return null;
      }
    },
    []
  );

  // Agregar la función de creación de mantenimiento en tu MantenimientosProvider

const crearMantenimiento = useCallback(
  async (
    mantenimientoData: {
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
      valorNumerico1: number;
      valorNumerico2: number;
    }
  ): Promise<Mantenimiento | null> => {
    setLoading(true);
    try {
      console.log('asdasdsd')
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        setLoading(false);
        return null;
      }

      const response = await api.post('/mantenimientos/crearMantenimiento', mantenimientoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const nuevoMantenimiento = response.data;
      setLoading(false);
      console.log('Mantenimiento creado:', nuevoMantenimiento);
      return nuevoMantenimiento;
    } catch (error) {
      console.log(mantenimientoData)
      console.error('Error al crear el mantenimiento:', error);
      setLoading(false);
      return null;
    }
  },
  []
);

// Editar un mantenimiento existente
const editarMantenimiento = useCallback(
  async (mantenimientoId: number, mantenimientoData: Mantenimiento) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        setLoading(false);
        return null;
      }

      const response = await api.put(`/mantenimientos/editarMantenimiento/${mantenimientoId}`, mantenimientoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      console.log('provider', response.data)
      return response.data; // Retorna el mantenimiento actualizado
    } catch (error) {
      console.error('Error al editar el mantenimiento:', error);
      setLoading(false);
      return null;
    }
  },
  []
);

// Obtener fechas de mantenimientos del usuario logueado
const fetchFechasMantenimientosUsuarios = useCallback(async (): Promise<{ id: number, fecha: Date }[]> => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      setLoading(false);
      return [];
    }

    // Realizamos la solicitud GET para obtener las fechas de los mantenimientos
    const response = await api.get('/mantenimientos/fechasUsuario', {
      headers: {
        Authorization: `Bearer ${token}`, // Enviamos el token en la cabecera
      },
    });

    // Procesamos las fechas y añadimos el id del mantenimiento
    const fechas = response.data.map((item: { id: number, createdAt: string }) => ({
      id: item.id, // Mantenemos el ID
      fecha: new Date(item.createdAt), // Convertimos la fecha a un objeto Date
    }));

    setLoading(false);
    return fechas;
  } catch (error) {
    console.error('Error al obtener las fechas de mantenimientos:', error);
    setLoading(false);
    return [];
  }
}, []);
// Obtener mantenimiento por ID
const fetchMantenimientoPorId = useCallback(
  async (mantenimientoId: string): Promise<Mantenimiento | null> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        setLoading(false);
        return null;
      }

      // Solicitud al backend para obtener el mantenimiento por ID
      const response = await api.get(`/mantenimientos/vista/${mantenimientoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Mantenimiento obtenido:', response.data);

      setLoading(false);
      return response.data as Mantenimiento;
    } catch (error) {
      console.error('Error al obtener el mantenimiento por ID:', error);
      setLoading(false);
      return null;
    }
  },
  []
);

// Eliminar un mantenimiento
const eliminarMantenimiento = useCallback(
  async (mantenimientoId: number): Promise<void> => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        setLoading(false);
        
      }

      const response = await api.delete(`/mantenimientos/eliminar/${mantenimientoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Si la respuesta es exitosa, asumimos que el mantenimiento fue eliminado
      setLoading(false);
      console.log('Mantenimiento eliminado:', response.data);
      
    } catch (error) {
      console.error('Error al eliminar el mantenimiento:', error);
      setLoading(false);
      
    }
  },
  []
);


  const value = useMemo(() => ({
    proyectosDelElectricista,
    fetchProyectosDelElectricista,
    fetchFechasMantenimientos,
    mantenimientosDelUsuario,
    fetchMantenimientosPorUsuario,
    fetchMantenimientoPorUsuario, // Incluimos la nueva función
    crearMantenimiento,
    editarMantenimiento,
    fetchFechasMantenimientosUsuarios,
    fetchMantenimientoPorId,
    eliminarMantenimiento,
    loading,
  }), [
    proyectosDelElectricista,
    fetchProyectosDelElectricista,
    fetchFechasMantenimientos,
    mantenimientosDelUsuario,
    fetchMantenimientosPorUsuario,
    fetchMantenimientoPorUsuario,
    crearMantenimiento,
    editarMantenimiento,
    fetchFechasMantenimientosUsuarios,
    fetchMantenimientoPorId,
    eliminarMantenimiento,
    loading,
  ]);

  return (
    <MantenimientosContext.Provider value={value}>
      {children}
    </MantenimientosContext.Provider>
  );
};

export const useMantenimientos = (): MantenimientosContextType => {
  const context = useContext(MantenimientosContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};
