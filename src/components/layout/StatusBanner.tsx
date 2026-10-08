import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const StatusBanner: React.FC = () => {
  const { isSimulationMode, setIsSimulationMode } = useApp();

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

  return (
    <div className="bg-[#0D653A] text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-[#16834B]">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="w-4 h-4 text-[#B9DFC5] shrink-0" />
          <span className="truncate">
            <span className="font-bold text-[#B9DFC5]">DATA RESMI TERVERIFIKASI</span> — InaRISK BNPB • BIG • BPS • BMKG • BPBD Aceh Utara
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-emerald-100 shrink-0">
          <span>KDPKAB: 11.08</span>
          <span>•</span>
          <span>Wilayah: Kab. Aceh Utara, Aceh</span>
        </div>
      </div>
    </div>
  );
};
