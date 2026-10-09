import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, WifiOff, Clock } from 'lucide-react';

export const StatusBanner: React.FC = () => {
  const { isSimulationMode, setIsSimulationMode, isOnline, lastSyncTime } = useApp();

  if (!isOnline) {
    return (
      <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />
          <span className="flex-1">
            <strong>MODE OFFLINE AKTIF</strong> — Menampilkan arsip data lokal (Edukasi, Posko & Batas Wilayah tetap berfungsi).
          </span>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-100 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Cache: {lastSyncTime}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isSimulationMode) {
    return (
      <div className="bg-amber-500 text-white px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-100" />
          <span>
            <strong>MODE DEMONSTRASI</strong> — Sebagian informasi menggunakan data simulasi dan bukan kondisi banjir aktual di lapangan.
          </span>
          <button
            onClick={() => setIsSimulationMode(false)}
            className="ml-auto bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-xs font-bold transition"
          >
            Kembali ke Data Asli
          </button>
        </div>
      </div>
    );
  }

  return null;
};
