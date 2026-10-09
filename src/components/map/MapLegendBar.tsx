import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Waves, 
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  Compass,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KecamatanListModal } from './KecamatanListModal';
import { Skeleton } from '../common/Skeleton';
import type { HazardLevel, KecamatanIndicator } from '../../types';

interface MapLegendBarProps {
  className?: string;
  onSelectKecamatan?: (k: KecamatanIndicator) => void;
}

export const MapLegendBar: React.FC<MapLegendBarProps> = ({ 
  className = '',
  onSelectKecamatan
}) => {
  const { allKecamatan, setSelectedKecamatan, isLoading } = useApp();
  const [selectedHazardModal, setSelectedHazardModal] = useState<HazardLevel | null>(null);

  const handleSelect = (k: KecamatanIndicator) => {
    setSelectedKecamatan(k);
    if (onSelectKecamatan) onSelectKecamatan(k);
  };

  const isPending = isLoading && allKecamatan.length === 0;
  const countTinggi = allKecamatan.filter(k => k.hazard_level === 'Tinggi').length;
  const countSedang = allKecamatan.filter(k => k.hazard_level === 'Sedang').length;
  const countRendah = allKecamatan.filter(k => k.hazard_level === 'Rendah').length;

  return (
    <>
      <section 
        aria-label="Panel Legenda dan Simbol Peta SIGAP"
        className={`bg-white rounded-2xl border border-[#E3EAE5] shadow-xs p-4 sm:p-6 space-y-6 select-none ${className}`}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3EAE5] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#16834B] flex items-center justify-center shrink-0 border border-[#B9DFC5]">
              <Compass className="w-5 h-5 text-[#0D653A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#0D653A] leading-tight">
                Legenda & Keterangan Peta SIGAP
              </h3>
              <p className="text-xs sm:text-[13px] text-[#475569] mt-0.5 leading-snug">
                Panduan simbol lokasi, tingkat bahaya banjir, dan layer geografis Aceh Utara
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#475569]">
            <span className="px-2.5 py-1 rounded-full bg-[#F4F7F5] border border-[#E3EAE5] whitespace-nowrap">
              InaRISK BNPB
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#F4F7F5] border border-[#E3EAE5] whitespace-nowrap">
              BPBD Aceh Utara
            </span>
          </div>
        </div>

        {/* 1. SIMBOL LOKASI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#16834B]" />
            <h4 className="text-xs sm:text-[13px] font-extrabold text-[#0D653A] uppercase tracking-wider">
              1. Simbol Lokasi
            </h4>
            <span className="text-xs text-[#64748B] hidden sm:inline">• Titik fasilitas, evakuasi, dan laporan warga</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Fasilitas Umum */}
            <div className="bg-[#F0F6FF] border border-[#BFDBFE] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border-2 border-white"
                      aria-hidden="true"
                    >
                      F
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-[#1E3A8A] leading-snug">
                      Fasilitas Umum
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                    Publik
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Puskesmas 24 jam, RSUD rujukan, kantor BPBD, dan pos polisi pelayan masyarakat.
                </p>
              </div>
            </div>

            {/* Posko Evakuasi (Strictly NO 'Aman' label, uses 'Terverifikasi' from verified BPBD data) */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border-2 border-white"
                      aria-hidden="true"
                    >
                      E
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-[#065F46] leading-snug">
                      Posko Evakuasi
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Terverifikasi
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Titik kumpul pengungsian, meunasah dataran tinggi, dan shelter resmi terdaftar BPBD.
                </p>
              </div>
            </div>

            {/* Laporan Warga */}
            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-full bg-[#E11D48] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border-2 border-white"
                      aria-hidden="true"
                    >
                      !
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-[#9F1239] leading-snug">
                      Laporan Warga
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
                    Masyarakat
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Titik genangan air aktual kiriman warga yang diverifikasi oleh Pusdalops BPBD.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TINGKAT BAHAYA BANJIR */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <h4 className="text-xs sm:text-[13px] font-extrabold text-[#0D653A] uppercase tracking-wider">
              2. Tingkat Bahaya Banjir
            </h4>
            <span className="text-xs text-[#64748B] hidden sm:inline">• Zonasi risiko InaRISK BNPB per wilayah</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Bahaya Tinggi */}
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs border border-red-700"
                      aria-label="Ikon Bahaya Tinggi"
                    >
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-red-950 leading-snug">
                      Bahaya Tinggi
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-900 border border-red-300">
                    {isPending ? <Skeleton className="h-4 w-16 rounded-full inline-block" /> : `${countTinggi} Kecamatan`}
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Wilayah bantaran sungai aktif dan cekungan dataran rendah dengan riwayat luapan banjir ekstrem.
                </p>
              </div>

              <div className="pt-2 border-t border-red-200/80">
                <button
                  type="button"
                  onClick={() => setSelectedHazardModal('Tinggi')}
                  aria-label={isPending ? 'Buka detail daftar kecamatan Bahaya Tinggi' : `Buka detail daftar ${countTinggi} kecamatan Bahaya Tinggi`}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 font-extrabold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 border border-red-300 active:scale-98 transition cursor-pointer"
                >
                  <span>Lihat wilayah</span>
                  <ChevronRight className="w-4 h-4 text-red-800" />
                </button>
              </div>
            </div>

            {/* Bahaya Sedang */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs border border-amber-700"
                      aria-label="Ikon Bahaya Sedang"
                    >
                      <ShieldAlert className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-amber-950 leading-snug">
                      Bahaya Sedang
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                    {isPending ? <Skeleton className="h-4 w-16 rounded-full inline-block" /> : `${countSedang} Kecamatan`}
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Wilayah dataran aluvial dan transisi pesisir dengan potensi genangan saat hujan lebat berkepanjangan.
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/80">
                <button
                  type="button"
                  onClick={() => setSelectedHazardModal('Sedang')}
                  aria-label={isPending ? 'Buka detail daftar kecamatan Bahaya Sedang' : `Buka detail daftar ${countSedang} kecamatan Bahaya Sedang`}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 border border-amber-300 active:scale-98 transition cursor-pointer"
                >
                  <span>Lihat wilayah</span>
                  <ChevronRight className="w-4 h-4 text-amber-800" />
                </button>
              </div>
            </div>

            {/* Bahaya Rendah */}
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl bg-[#16834B] text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-700"
                      aria-label="Ikon Bahaya Rendah"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-emerald-950 leading-snug">
                      Bahaya Rendah
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {isPending ? <Skeleton className="h-4 w-16 rounded-full inline-block" /> : `${countRendah} Kecamatan`}
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Wilayah perbukitan dan hulu sungai dengan elevasi tinggi serta risiko genangan minim.
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-200/80">
                <button
                  type="button"
                  onClick={() => setSelectedHazardModal('Rendah')}
                  aria-label={isPending ? 'Buka detail daftar kecamatan Bahaya Rendah' : `Buka detail daftar ${countRendah} kecamatan Bahaya Rendah`}
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 border border-emerald-300 active:scale-98 transition cursor-pointer"
                >
                  <span>Lihat wilayah</span>
                  <ChevronRight className="w-4 h-4 text-emerald-800" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LAYER GEOGRAFIS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <h4 className="text-xs sm:text-[13px] font-extrabold text-[#0D653A] uppercase tracking-wider">
              3. Layer Geografis
            </h4>
            <span className="text-xs text-[#64748B] hidden sm:inline">• Garis batas wilayah administrasi & aliran sungai</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Batas Wilayah Administrasi */}
            <div className="bg-[#F4F9F5] border border-[#C6E2D0] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl border-2 border-dashed border-[#0D653A] bg-[#E8F5E9] flex items-center justify-center shrink-0 text-[#0D653A]"
                      aria-label="Simbol Batas Wilayah"
                    >
                      <MapPin className="w-4 h-4 text-[#0D653A]" />
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-[#0D653A] leading-snug">
                      Batas Wilayah Administrasi
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E8F5E9] text-[#0D653A] border border-[#B9DFC5]">
                    Teritorial
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Garis batas teritorial Kabupaten Aceh Utara dan delineasi 27 batas kecamatan resmi.
                </p>
              </div>
            </div>

            {/* Aliran Sungai (DAS) */}
            <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 transition hover:shadow-xs">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-xs border border-sky-600"
                      aria-label="Simbol Aliran Sungai"
                    >
                      <Waves className="w-4 h-4 text-white" />
                    </div>
                    <h5 className="font-bold text-[15px] sm:text-base text-sky-950 leading-snug">
                      Aliran Sungai (DAS)
                    </h5>
                  </div>
                  <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-900 border border-sky-300">
                    Hidrologi
                  </span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#334155] leading-relaxed break-words">
                  Jaringan sungai utama meliputi Krueng Keureuto, Krueng Pirak, Krueng Pase, dan Sawang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal for "Lihat wilayah" */}
      <KecamatanListModal
        hazardLevel={selectedHazardModal}
        allKecamatan={allKecamatan}
        onClose={() => setSelectedHazardModal(null)}
        onSelectKecamatan={handleSelect}
      />
    </>
  );
};
