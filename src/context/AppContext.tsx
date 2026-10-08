import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, KecamatanIndicator } from '../types';
import { dataService } from '../services/dataService';

interface MapLayersState {
  boundary: boolean;
  hazard: boolean;
  rivers: boolean;
  facilities: boolean;
  evacuation: boolean;
  reports: boolean;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  layers: MapLayersState;
  toggleLayer: (layer: keyof MapLayersState) => void;
  layerOpacity: number;
  setLayerOpacity: (opacity: number) => void;
  selectedKecamatan: KecamatanIndicator | null;
  setSelectedKecamatan: (k: KecamatanIndicator | null) => void;
  allKecamatan: KecamatanIndicator[];
  isLoading: boolean;
  isSimulationMode: boolean;
  setIsSimulationMode: (sim: boolean) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('sigap_user_role') as UserRole) || 'public';
  });

  const [layers, setLayers] = useState<MapLayersState>({
    boundary: true,
    hazard: true,
    rivers: true,
    facilities: true,
    evacuation: true,
    reports: true,
  });

  const [layerOpacity, setLayerOpacity] = useState<number>(0.65);
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanIndicator | null>(null);
  const [allKecamatan, setAllKecamatan] = useState<KecamatanIndicator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);

  const toggleLayer = (layer: keyof MapLayersState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('sigap_user_role', newRole);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getKecamatanIndicators();
      setAllKecamatan(data);
    } catch (err) {
      console.error("Failed to load indicators:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        layers,
        toggleLayer,
        layerOpacity,
        setLayerOpacity,
        selectedKecamatan,
        setSelectedKecamatan,
        allKecamatan,
        isLoading,
        isSimulationMode,
        setIsSimulationMode,
        refreshData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
