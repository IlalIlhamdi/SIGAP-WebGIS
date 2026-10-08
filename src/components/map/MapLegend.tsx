import React from 'react';
import { Shield, Waves, Building2, MapPin, AlertCircle } from 'lucide-react';

interface MapLegendProps {
  opacity: number;
  onOpacityChange: (val: number) => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({ opacity, onOpacityChange }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E3EAE5] shadow-lg text-xs space-y-3 max-w-xs">
      <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2">
        <span className="font-extrabold text-[#0D653A] flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#16834B]" /> Legenda Indeks Bahaya
        </span>
        <span className="text-[10px] text-[#66766C] font-semibold">InaRISK BNPB</span>
      </div>

      {/* Hazard Classes */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#DC2626] border border-red-700 shadow-xs shrink-0"></span>
            <span className="font-bold text-[#25352D]">Bahaya Tinggi</span>
          </div>
          <span className="text-[10px] text-[#66766C]">Dataran Rendah & Bantaran</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#F59E0B] border border-amber-600 shadow-xs shrink-0"></span>
            <span className="font-bold text-[#25352D]">Bahaya Sedang</span>
          </div>
          <span className="text-[10px] text-[#66766C]">Dataran Transisi & Pesisir</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#16834B] border border-emerald-700 shadow-xs shrink-0"></span>
            <span className="font-bold text-[#25352D]">Bahaya Rendah</span>
          </div>
          <span className="text-[10px] text-[#66766C]">Perbukitan & Hulu</span>
        </div>
      </div>

      {/* Feature Icons */}
      <div className="pt-2 border-t border-[#E3EAE5] space-y-1.5 text-[11px] text-[#25352D]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-[#0284C7] rounded-full shrink-0"></div>
          <span>Jaringan Sungai (Krueng Keureuto, Pase, dll)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">E</span>
          <span>Titik Evakuasi Terverifikasi BPBD</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0">F</span>
          <span>Fasilitas Pelayanan Publik / Puskesmas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">!</span>
          <span>Laporan Banjir Masyarakat</span>
        </div>
      </div>

      {/* Opacity Control */}
      <div className="pt-2 border-t border-[#E3EAE5]">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-[#66766C] font-semibold">Transparansi Layer</span>
          <span className="font-bold text-[#16834B]">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="1.0"
          step="0.05"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full accent-[#16834B] h-1.5 bg-[#E3EAE5] rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};
