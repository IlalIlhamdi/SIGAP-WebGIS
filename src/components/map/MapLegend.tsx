import React, { useState } from 'react';
import { 
  Shield, 
  Waves, 
  MapPin, 
  Sliders, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck,
  Building2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Skeleton } from '../common/Skeleton';

interface MapLegendProps {
  opacity: number;
  onOpacityChange: (val: number) => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({ opacity, onOpacityChange }) => {
  const { allKecamatan, isLoading } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isPending = isLoading && allKecamatan.length === 0;
  const countTinggi = allKecamatan.filter(k => k.hazard_level === 'Tinggi').length;
  const countSedang = allKecamatan.filter(k => k.hazard_level === 'Sedang').length;
  const countRendah = allKecamatan.filter(k => k.hazard_level === 'Rendah').length;

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#E3EAE5] shadow-lg text-xs space-y-3 max-w-xs select-none">
      {/* Title with collapse toggle */}
      <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2 gap-2">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="font-extrabold text-[#0D653A] flex items-center gap-1.5 text-xs sm:text-sm hover:opacity-80 transition cursor-pointer text-left"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Buka legenda peta' : 'Ciutkan legenda peta'}
        >
          <Shield className="w-4 h-4 text-[#16834B] shrink-0" />
          <span>Legenda Peta SIGAP</span>
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-500" /> : <ChevronUp className="w-3.5 h-3.5 ml-1 text-slate-500" />}
        </button>
        <span className="text-[10px] text-[#64748B] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 shrink-0">
          InaRISK
        </span>
      </div>

      {!isCollapsed && (
        <>
          {/* 1. Simbol Lokasi */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-extrabold text-[#0D653A] uppercase tracking-wider">
              1. Simbol Lokasi
            </p>
            <div className="space-y-1 text-xs text-[#334155]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[9px] font-black shrink-0 border border-white shadow-xs">
                  F
                </span>
                <span className="font-medium truncate">Fasilitas Umum & RS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center text-[9px] font-black shrink-0 border border-white shadow-xs">
                  E
                </span>
                <span className="font-medium truncate">Posko Evakuasi BPBD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-[9px] font-black shrink-0 border border-white shadow-xs">
                  !
                </span>
                <span className="font-medium truncate">Laporan Genangan Warga</span>
              </div>
            </div>
          </div>

          {/* 2. Tingkat Bahaya Banjir */}
          <div className="space-y-1.5 pt-2 border-t border-[#E3EAE5]">
            <p className="text-[10px] font-extrabold text-[#0D653A] uppercase tracking-wider">
              2. Tingkat Bahaya Banjir
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#DC2626] border border-red-700 shadow-xs shrink-0 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                  <span className="font-bold text-red-950">Bahaya Tinggi</span>
                </div>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                  {isPending ? <Skeleton className="w-8 h-3 rounded" /> : `${countTinggi} Kec`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#F59E0B] border border-amber-600 shadow-xs shrink-0 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                  <span className="font-bold text-amber-950">Bahaya Sedang</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {isPending ? <Skeleton className="w-8 h-3 rounded" /> : `${countSedang} Kec`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#16834B] border border-emerald-700 shadow-xs shrink-0 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  </span>
                  <span className="font-bold text-emerald-950">Bahaya Rendah</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {isPending ? <Skeleton className="w-8 h-3 rounded" /> : `${countRendah} Kec`}
                </span>
              </div>
            </div>
          </div>

      {/* 3. Layer Geografis */}
      <div className="space-y-1.5 pt-2 border-t border-[#E3EAE5]">
        <p className="text-[10px] font-extrabold text-[#0D653A] uppercase tracking-wider">
          3. Layer Geografis
        </p>
        <div className="space-y-1 text-[11px] text-[#334155]">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-2 rounded border border-dashed border-[#0D653A] bg-[#E8F5E9] shrink-0" />
            <span className="font-medium">Batas Wilayah Aceh Utara</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-1.5 bg-[#0284C7] rounded-full shrink-0" />
            <span className="font-medium">Aliran Sungai (DAS Krueng)</span>
          </div>
        </div>
      </div>

      {/* Kontrol Terpisah: Transparansi Poligon */}
      <div className="pt-2.5 border-t border-[#E3EAE5] bg-slate-50/70 -mx-4 -mb-4 p-3 rounded-b-2xl">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-[#64748B] font-bold flex items-center gap-1">
            <Sliders className="w-3 h-3 text-[#16834B]" /> Transparansi Layer
          </span>
          <span className="font-extrabold text-[#16834B]">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="1.0"
          step="0.05"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          aria-label="Pengatur Transparansi Layer Peta"
          className="w-full accent-[#16834B] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
      </div>
        </>
      )}
    </div>
  );
};
