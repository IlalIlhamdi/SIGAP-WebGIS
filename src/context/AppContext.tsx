import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, KecamatanIndicator } from '../types';
import { dataService } from '../services/dataService';
import { initStatusBar } from '../lib/native/status-bar';
import { getNetworkStatus, subscribeNetworkStatus } from '../lib/native/network';

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
  isRefreshing: boolean;
  indicatorsError: string | null;
  isSimulationMode: boolean;
  setIsSimulationMode: (sim: boolean) => void;
  isOnline: boolean;
  lastSyncTime: string;
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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [indicatorsError, setIndicatorsError] = useState<string | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('sigap_last_sync') || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  });

  const toggleLayer = (layer: keyof MapLayersState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('sigap_user_role', newRole);
  };

  const loadData = async (isBackground = false) => {
    if (isBackground || allKecamatan.length > 0) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setIndicatorsError(null);

    try {
      const data = await dataService.getKecamatanIndicators();
      setAllKecamatan(data);
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(timeStr);
      localStorage.setItem('sigap_last_sync', timeStr);
      setIndicatorsError(null);
    } catch (err: any) {
      console.error("Failed to load indicators:", err);
      setIndicatorsError(err?.message || "Gagal memuat indikator kecamatan dari server");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    initStatusBar();
    loadData();

    // Check initial network status
    getNetworkStatus().then(status => {
      setIsOnline(status.connected);
    });

    // Subscribe to ongoing network changes
    const unsubNetwork = subscribeNetworkStatus((status) => {
      setIsOnline(status.connected);
      if (status.connected) {
        // Silently refresh when coming back online
        dataService.syncReportsFromSupabase().catch(() => {});
        loadData(true).catch(() => {});
      }
    });

    return () => {
      unsubNetwork();
    };
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
        isRefreshing,
        indicatorsError,
        isSimulationMode,
        setIsSimulationMode,
        isOnline,
        lastSyncTime,
        refreshData: () => loadData(true),
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
