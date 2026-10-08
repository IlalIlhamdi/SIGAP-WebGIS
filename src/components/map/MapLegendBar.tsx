import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Waves, 
  AlertCircle,
  Compass
} from 'lucide-react';

interface MapLegendBarProps {
  className?: string;
}

export const MapLegendBar: React.FC<MapLegendBarProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-[#E3EAE5] shadow-xs p-4 sm:p-5 space-y-3.5 select-none ${className}`}>
      {/* Header: Title & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3EAE5] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F5E9] text-[#16834B] flex items-center justify-center">
            <Compass className="w-4 h-4 text-[#0D653A]" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-[#0D653A]">
              Keterangan Peta (Map Legend)
            </h4>
            <p className="text-[11px] text-[#66766C]">
              Simbol & Lapisan Geospasial Kabupaten Aceh Utara
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#66766C]">
          <span className="px-2 py-0.5 rounded-full bg-[#F4F7F5] border border-[#E3EAE5]">
            InaRISK BNPB
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#F4F7F5] border border-[#E3EAE5]">
            BPBD Aceh Utara
          </span>
        </div>
      </div>

      {/* Main Legend Grid: Markers & Polygon Hazards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* SECTION 1: POINT MARKERS (Requested: F & E markers highlighted) */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-extrabold text-[#66766C] uppercase tracking-wider">
            Simbol Marker Peta
          </p>

          <div className="space-y-2">
            {/* Lingkaran Biru dengan Huruf F = Fasilitas Umum (Facility) */}
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F0F6FF] border border-[#BFDBFE]/60">
              <div 
                className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm border-2 border-white"
                style={{ minWidth: '28px', minHeight: '28px' }}
              >
                F
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-[#1E3A8A]">Fasilitas Umum (Facility)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-200/80 text-blue-900">
                    Publik
                  </span>
                </div>
                <p className="text-[11px] text-[#475569] leading-relaxed mt-0.5">
                  Puskesmas 24 Jam, RSUD Muchtar Hasbi, RS Cut Meutia, Kantor BPBD, & Polsek di wilayah rawan banjir.
                </p>
              </div>
            </div>

            {/* Lingkaran Hijau dengan Huruf E = Titik Evakuasi (Evacuation) */}
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]/60">
              <div 
                className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm border-2 border-white"
                style={{ minWidth: '28px', minHeight: '28px' }}
              >
                E
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-[#065F46]">Titik Evakuasi (Evacuation)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-emerald-900">
                    Aman
                  </span>
                </div>
                <p className="text-[11px] text-[#475569] leading-relaxed mt-0.5">
                  10 Titik kumpul, shelter pengungsian resmi, meunasah dataran tinggi, & posko aman banjir BPBD.
                </p>
              </div>
            </div>

            {/* Marker Laporan Banjir Warga */}
            <div className="flex items-start gap-3 p-2 rounded-xl bg-[#FFF1F2] border border-[#FECDD3]/50">
              <div 
                className="w-7 h-7 rounded-full bg-[#E11D48] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm border-2 border-white"
                style={{ minWidth: '28px', minHeight: '28px' }}
              >
                !
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-[#9F1239]">Laporan Genangan Warga</span>
                <p className="text-[11px] text-[#475569] leading-tight mt-0.5">
                  Titik banjir hasil verifikasi spasial petugas PUSDALOPS BPBD.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ZONASI BAHAYA BANJIR (InaRISK BNPB) & SUNGAI */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-extrabold text-[#66766C] uppercase tracking-wider">
            Zonasi Tingkat Bahaya & Aliran Sungai
          </p>

          <div className="space-y-2">
            {/* Bahaya Tinggi */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-red-50/70 border border-red-200">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-[#DC2626] border border-red-700 shadow-xs shrink-0" />
                <div>
                  <span className="font-extrabold text-xs text-red-900">Bahaya Tinggi (Tinggi)</span>
                  <p className="text-[10px] text-red-700">Kec. Matangkuli, Pirak Timu, Tanah Luas, dll (Bantaran DAS)</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-200 text-red-800">
                5 Kecamatan
              </span>
            </div>

            {/* Bahaya Sedang */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-[#F59E0B] border border-amber-600 shadow-xs shrink-0" />
                <div>
                  <span className="font-extrabold text-xs text-amber-900">Bahaya Sedang (Sedang)</span>
                  <p className="text-[10px] text-amber-700">Kec. Samudera, Syamtalira Bayu, Baktiya, dll (Dataran Rendah)</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                14 Kecamatan
              </span>
            </div>

            {/* Bahaya Rendah */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-[#16834B] border border-emerald-700 shadow-xs shrink-0" />
                <div>
                  <span className="font-extrabold text-xs text-emerald-900">Bahaya Rendah (Rendah)</span>
                  <p className="text-[10px] text-emerald-700">Kec. Sawang, Nisam Antara, Simpang Keuramat (Perbukitan Hulu)</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                8 Kecamatan
              </span>
            </div>

            {/* Jaringan Sungai */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-sky-50/70 border border-sky-200">
              <div className="w-6 h-1.5 bg-[#0284C7] rounded-full shrink-0 shadow-xs" />
              <div>
                <span className="font-extrabold text-xs text-sky-900">Jaringan Aliran Sungai (DAS)</span>
                <p className="text-[10px] text-sky-700">Krueng Keureuto, Krueng Pase, Krueng Pirak, & Krueng Sawang</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
