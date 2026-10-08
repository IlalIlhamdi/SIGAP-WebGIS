import React from 'react';
import { Layers, Eye, EyeOff, Shield, Waves, Building2, ShieldAlert, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LayerControls: React.FC = () => {
  const { layers, toggleLayer } = useApp();

  const layerList = [
    { key: 'hazard' as const, label: 'Bahaya Banjir InaRISK', icon: Shield, color: 'text-amber-600' },
    { key: 'rivers' as const, label: 'Sungai & Jaringan Air', icon: Waves, color: 'text-sky-600' },
    { key: 'evacuation' as const, label: 'Titik Evakuasi BPBD', icon: ShieldAlert, color: 'text-emerald-600' },
    { key: 'facilities' as const, label: 'Fasilitas Umum & RS', icon: Building2, color: 'text-blue-600' },
    { key: 'reports' as const, label: 'Laporan Masyarakat', icon: FileText, color: 'text-rose-600' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#E3EAE5] shadow-lg text-xs space-y-2">
      <div className="flex items-center gap-1.5 pb-2 border-b border-[#E3EAE5] font-extrabold text-[#0D653A]">
        <Layers className="w-4 h-4 text-[#16834B]" />
        <span>Filter Lapisan GIS</span>
      </div>

      <div className="space-y-1">
        {layerList.map((item) => {
          const isActive = layers[item.key];
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition text-left ${
                isActive 
                  ? 'bg-[#E8F5E9] text-[#0D653A] font-bold' 
                  : 'text-[#66766C] hover:bg-[#F4F7F5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="text-[11px] truncate">{item.label}</span>
              </div>
              {isActive ? (
                <Eye className="w-3.5 h-3.5 text-[#16834B] shrink-0" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
