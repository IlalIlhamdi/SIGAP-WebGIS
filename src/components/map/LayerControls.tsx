import React from 'react';
import { Layers, Eye, EyeOff, Shield, Waves, Building2, ShieldCheck, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LayerControls: React.FC = () => {
  const { layers, toggleLayer } = useApp();

  const layerList = [
    { key: 'hazard' as const, label: 'Bahaya Banjir InaRISK', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
    { key: 'rivers' as const, label: 'Sungai & Jaringan Air', icon: Waves, color: 'text-sky-600', bg: 'bg-sky-50' },
    { key: 'evacuation' as const, label: 'Titik Posko Evakuasi', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'facilities' as const, label: 'Fasilitas Umum & RS', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'reports' as const, label: 'Laporan Genangan Warga', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div 
      aria-label="Kontrol Visibilitas Layer Peta"
      className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E3EAE5] shadow-lg text-xs space-y-2.5 select-none w-64"
    >
      <div className="pb-2 border-b border-[#E3EAE5]">
        <div className="flex items-center gap-1.5 font-extrabold text-[#0D653A] text-[13px]">
          <Layers className="w-4 h-4 text-[#16834B]" />
          <span>Kontrol Lapisan (Filter)</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Saklar aktif / nonaktif tampilan layer
        </p>
      </div>

      <div className="space-y-1.5">
        {layerList.map((item) => {
          const isActive = layers[item.key];
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleLayer(item.key)}
              aria-pressed={isActive}
              className={`w-full min-h-[48px] px-3 py-2 rounded-xl transition flex items-center justify-between text-left active:scale-98 ${
                isActive 
                  ? 'bg-[#E8F5E9] text-[#0D653A] font-extrabold border border-[#B9DFC5]' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <span className="text-xs truncate">{item.label}</span>
              </div>
              <div className="shrink-0 flex items-center gap-1">
                {isActive ? (
                  <span className="text-[10px] font-bold text-[#16834B] bg-white/80 px-1.5 py-0.5 rounded-md border border-[#B9DFC5]">
                    ON
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-white/80 px-1.5 py-0.5 rounded-md border border-slate-200">
                    OFF
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
