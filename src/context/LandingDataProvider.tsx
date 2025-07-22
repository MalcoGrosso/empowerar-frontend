import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import api from '../config/axiosClient';

interface LandingDataContextType {
  familiasGestionadas: number;
  reclamosResueltos: number;
  pagosAlDia: number;
  fetchLandingData: () => void;
}

const LandingDataContext = createContext<LandingDataContextType | undefined>(undefined);

export const LandingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [familiasGestionadas, setFamiliasGestionadas] = useState(0);
  const [reclamosResueltos, setReclamosResueltos] = useState(0);
  const [pagosAlDia, setPagosAlDia] = useState(0);

  const fetchLandingData = useCallback(async () => {
    try {
      const [
        familiasResponse,
        reclamosResponse,
        pagosResponse,
      ] = await Promise.all([
        api.get('/users/contar'),
        api.get('/reclamos/resueltos'),
        api.get('/pagos/pagosAlDia'),
      ]);
      setFamiliasGestionadas(familiasResponse.data.totalUsuarios ?? 0);
      setReclamosResueltos(reclamosResponse.data.porcentajeResuelto ?? 0);
      setPagosAlDia(pagosResponse.data.porcentajePagos ?? 0);

    } catch (error) {
      console.error('Error fetching landing data', error);
    }
  }, []);

  useEffect(() => {
    fetchLandingData();
  }, [fetchLandingData]);

  // Usar useMemo para evitar crear un objeto nuevo cada render
  const value = useMemo(() => ({
    familiasGestionadas,
    reclamosResueltos,
    pagosAlDia,
    fetchLandingData,
  }), [familiasGestionadas, reclamosResueltos, pagosAlDia, fetchLandingData]);

  return <LandingDataContext.Provider value={value}>{children}</LandingDataContext.Provider>;
};

export const useLandingData = () => {
  const context = useContext(LandingDataContext);
  if (context === undefined) {
    throw new Error('useLandingData must be used within a LandingDataProvider');
  }
  return context;
};