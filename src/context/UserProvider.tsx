import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import api from '../config/axiosClient';

export interface UserProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  direccion: string;
  estado: boolean;
  role: string;
}

interface UserContextType {
  users: UserProps[];
  fetchUsers: () => void;
  deleteUser: (userId: number) => Promise<void>; 
  createUser: (user: Omit<UserProps, 'id'>) => Promise<UserProps>; // Cambiado el tipo de retorno
  updateUser: (userId: number, user: Partial<Omit<UserProps, 'id'>>) => Promise<UserProps>; // Cambiado el tipo de retorno
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProps[]>([]);

  const fetchUsers = useCallback(async () => { 
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/allUsers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(Array.isArray(response.data) ? response.data : response.data.users || []);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }, []); 

  const deleteUser = useCallback(async (userId: number) => { 
    try {
      const token = localStorage.getItem('token');
      await api.put(`/users/delete/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); 
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  }, [fetchUsers]); 

  const createUser = useCallback(async (user: Omit<UserProps, 'id'>): Promise<UserProps> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/users/register', user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newUser = response.data;
      fetchUsers(); 
      return newUser; // Devuelve el usuario creado
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (userId: number, user: Partial<Omit<UserProps, 'id'>>): Promise<UserProps> => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/users/edit/${userId}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUser = response.data;
      fetchUsers(); 
      return updatedUser; // Devuelve el usuario actualizado
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); 

  const value = useMemo(() => ({ users, fetchUsers, deleteUser, createUser, updateUser }), [users, fetchUsers, deleteUser, createUser, updateUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
