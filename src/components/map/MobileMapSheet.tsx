import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronDown, 
  Layers, 
  Eye, 
  EyeOff, 
  Shield, 
  Waves, 
  Building2, 
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  FileText,
  MapPin,
  ChevronRight,
  Sliders,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KecamatanListModal } from './KecamatanListModal';
import { Skeleton } from '../common/Skeleton';
import { registerBackButtonHandler } from '../../lib/native/back-button';
import type { HazardLevel, KecamatanIndicator } from '../../types';

interface MobileMapSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKecamatan?: (k: KecamatanIndicator) => void;
}

export const MobileMapSheet: React.FC<MobileMapSheetProps> = ({
  isOpen,
  onClose,
  onSelectKecamatan
}) => {
  const { 
    layers, 
    toggleLayer, 
    layerOpacity, 
    setLayerOpacity, 
    allKecamatan, 
    setSelectedKecamatan,
    isLoading
  } = useApp();

  const [activeTab, setActiveTab] = useState<'legend' | 'controls'>('legend');
  const [selectedHazardModal, setSelectedHazardModal] = useState<HazardLevel | null>(null);

  // Prevent background scroll when sheet is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Android back button
  useEffect(() => {
    if (!isOpen) return;
    return registerBackButtonHandler(() => {
      onClose();
      return true;
    }, 10);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPending = isLoading && allKecamatan.length === 0;
  const countTinggi = allKecamatan.filter(k => k.hazard_level === 'Tinggi').length;
  const countSedang = allKecamatan.filter(k => k.hazard_level === 'Sedang').length;
  const countRendah = allKecamatan.filter(k => k.hazard_level === 'Rendah').length;

  const layerItems = [
    { 
      key: 'hazard' as const, 
      label: 'Zonasi Bahaya Banjir (InaRISK)', 
      desc: 'Poligon tingkat risiko banjir 27 kecamatan',
      icon: Shield, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      key: 'rivers' as const, 
      label: 'Jaringan Sungai (DAS)', 
      desc: 'Garis aliran Krueng Keureuto, Pase, Sawang',
      icon: Waves, 
      color: 'text-sky-600',
      bgColor: 'bg-sky-50'
    },
    { 
      key: 'evacuation' as const, 
      label: 'Titik Posko Evakuasi', 
      desc: 'Shelter resmi terverifikasi BPBD Aceh Utara',
      icon: ShieldCheck, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      key: 'facilities' as const, 
      label: 'Fasilitas Umum & RS', 
      desc: 'Puskesmas 24 jam, RSUD, dan pos keamanan',
      icon: Building2, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      key: 'reports' as const, 
      label: 'Laporan Genangan Warga', 
      desc: 'Titik kejadian banjir kiriman masyarakat',
      icon: AlertCircle, 
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
  ];

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-45 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Panel Legenda dan Kontrol Layer Peta"
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-[#E3EAE5] shadow-2xl max-h-[85vh] flex flex-col overscroll-contain transition-transform duration-300 transform translate-y-0 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]"
      >
        {/* Drag Handle & Header */}
        <div className="pt-2 px-4 pb-2 border-b border-[#E3EAE5] shrink-0 bg-white rounded-t-3xl">
          <div 
            onClick={onClose}
            className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-1.5 cursor-pointer"
            aria-hidden="true"
          />

          <div className="flex items-center justify-between gap-2 mt-1">
            <div>
              <h3 className="font-extrabold text-base text-[#0D653A] leading-tight">
                Keterangan & Lapisan Peta
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                SIGAP Kabupaten Aceh Utara
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup panel legenda"
              className="min-h-[48px] min-w-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 active:scale-95 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Tab Bar: minimum 48dp touch area each */}
          <div className="grid grid-cols-2 gap-2 mt-3 p-1 bg-[#F4F7F5] rounded-2xl border border-[#E3EAE5]">
            <button
              type="button"
              onClick={() => setActiveTab('legend')}
              className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'legend'
                  ? 'bg-[#16834B] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0D653A] hover:bg-white/60'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Legenda Simbol</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('controls')}
              className={`min-h-[48px] px-3 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'controls'
                  ? 'bg-[#16834B] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0D653A] hover:bg-white/60'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Filter Lapisan</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 overscroll-contain">
          {/* TAB 1: LEGENDA SIMBOL (Penjelasan Simbol & Wilayah) */}
          {activeTab === 'legend' && (
            <div className="space-y-4">
              {/* Grup 1: Simbol Lokasi */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16834B]" />
                  <h4 className="text-xs font-extrabold text-[#0D653A] uppercase tracking-wider">
                    1. Simbol Lokasi
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {/* Fasilitas Umum */}
                  <div className="bg-[#F0F6FF] border border-[#BFDBFE] rounded-2xl p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border-2 border-white">
                          F
                        </div>
                        <h5 className="font-bold text-[15px] text-[#1E3A8A]">
                          Fasilitas Umum
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                        Publik
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Puskesmas 24 jam, RSUD rujukan, kantor BPBD, dan pos polisi pelayan masyarakat.
                    </p>
                  </div>

                  {/* Posko Evakuasi (Strictly NO 'Aman' label) */}
                  <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border-2 border-white">
                          E
                        </div>
                        <h5 className="font-bold text-[15px] text-[#065F46]">
                          Posko Evakuasi
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        Terverifikasi
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Titik kumpul pengungsian, meunasah dataran tinggi, dan shelter resmi terdaftar BPBD.
                    </p>
                  </div>

                  {/* Laporan Warga */}
                  <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#E11D48] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs border-2 border-white">
                          !
                        </div>
                        <h5 className="font-bold text-[15px] text-[#9F1239]">
                          Laporan Warga
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
                        Masyarakat
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Titik genangan air aktual kiriman warga yang diverifikasi oleh Pusdalops BPBD.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grup 2: Tingkat Bahaya Banjir */}
              <div className="space-y-2.5 pt-2 border-t border-[#E3EAE5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <h4 className="text-xs font-extrabold text-[#0D653A] uppercase tracking-wider">
                    2. Tingkat Bahaya Banjir
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {/* Bahaya Tinggi */}
                  <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs border border-red-700">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <h5 className="font-bold text-[15px] text-red-950">
                          Bahaya Tinggi
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-900 border border-red-300">
                        {isPending ? <Skeleton className="w-16 h-4 rounded-full" /> : `${countTinggi} Kecamatan`}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Wilayah bantaran sungai aktif dan cekungan dataran rendah dengan riwayat luapan banjir ekstrem.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedHazardModal('Tinggi')}
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 font-extrabold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 border border-red-300 active:scale-98 transition cursor-pointer"
                    >
                      <span>Lihat wilayah</span>
                      <ChevronRight className="w-4 h-4 text-red-800" />
                    </button>
                  </div>

                  {/* Bahaya Sedang */}
                  <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs border border-amber-700">
                          <ShieldAlert className="w-4 h-4 text-white" />
                        </div>
                        <h5 className="font-bold text-[15px] text-amber-950">
                          Bahaya Sedang
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                        {isPending ? <Skeleton className="w-16 h-4 rounded-full" /> : `${countSedang} Kecamatan`}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Wilayah dataran aluvial dan transisi pesisir dengan potensi genangan saat hujan lebat berkepanjangan.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedHazardModal('Sedang')}
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 border border-amber-300 active:scale-98 transition cursor-pointer"
                    >
                      <span>Lihat wilayah</span>
                      <ChevronRight className="w-4 h-4 text-amber-800" />
                    </button>
                  </div>

                  {/* Bahaya Rendah */}
                  <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#16834B] text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-700">
                          <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <h5 className="font-bold text-[15px] text-emerald-950">
                          Bahaya Rendah
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {isPending ? <Skeleton className="w-16 h-4 rounded-full" /> : `${countRendah} Kecamatan`}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Wilayah perbukitan dan hulu sungai dengan elevasi tinggi serta risiko genangan minim.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedHazardModal('Rendah')}
                      className="w-full min-h-[48px] px-3.5 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 border border-emerald-300 active:scale-98 transition cursor-pointer"
                    >
                      <span>Lihat wilayah</span>
                      <ChevronRight className="w-4 h-4 text-emerald-800" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grup 3: Layer Geografis */}
              <div className="space-y-2.5 pt-2 border-t border-[#E3EAE5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                  <h4 className="text-xs font-extrabold text-[#0D653A] uppercase tracking-wider">
                    3. Layer Geografis
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {/* Batas Wilayah */}
                  <div className="bg-[#F4F9F5] border border-[#C6E2D0] rounded-2xl p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl border-2 border-dashed border-[#0D653A] bg-[#E8F5E9] flex items-center justify-center shrink-0 text-[#0D653A]">
                          <MapPin className="w-4 h-4 text-[#0D653A]" />
                        </div>
                        <h5 className="font-bold text-[15px] text-[#0D653A]">
                          Batas Wilayah Administrasi
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E8F5E9] text-[#0D653A] border border-[#B9DFC5]">
                        Teritorial
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Garis batas teritorial Kabupaten Aceh Utara dan delineasi 27 batas kecamatan resmi.
                    </p>
                  </div>

                  {/* Aliran Sungai */}
                  <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-3.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-xs border border-sky-600">
                          <Waves className="w-4 h-4 text-white" />
                        </div>
                        <h5 className="font-bold text-[15px] text-sky-950">
                          Aliran Sungai (DAS)
                        </h5>
                      </div>
                      <span className="whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-900 border border-sky-300">
                        Hidrologi
                      </span>
                    </div>
                    <p className="text-[13px] text-[#334155] leading-relaxed break-words">
                      Jaringan sungai utama meliputi Krueng Keureuto, Krueng Pirak, Krueng Pase, dan Sawang.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FILTER & KONTROL LAYER (Kontrol Visibilitas Layer) */}
          {activeTab === 'controls' && (
            <div className="space-y-4">
              {/* Informative Guidance Banner */}
              <div className="p-3 bg-[#E8F5E9] rounded-2xl border border-[#B9DFC5] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#0D653A] shrink-0 mt-0.5" />
                <p className="text-xs text-[#0D653A] leading-relaxed">
                  <strong>Kontrol Lapisan:</strong> Aktifkan atau sembunyikan tampilan fitur spasial pada peta. Bagian ini berbeda dari panel legenda yang menjelaskan arti simbol.
                </p>
              </div>

              {/* Layer Switches List */}
              <div className="space-y-2">
                {layerItems.map((item) => {
                  const isActive = layers[item.key];
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleLayer(item.key)}
                      aria-pressed={isActive}
                      className={`w-full min-h-[52px] p-3 rounded-2xl border transition flex items-center justify-between gap-3 text-left active:scale-98 ${
                        isActive
                          ? 'bg-white border-[#16834B] shadow-xs'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs sm:text-[13px] text-slate-900 leading-snug">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight truncate">
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      {/* Visual Switch Indicator (minimum 48dp touchable zone) */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-[#16834B]' : 'text-slate-400'}`}>
                          {isActive ? 'Aktif' : 'Mati'}
                        </span>
                        <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          isActive ? 'bg-[#16834B]' : 'bg-slate-300'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                            isActive ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Opacity Control Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#0D653A]" />
                    <span className="font-extrabold text-xs sm:text-[13px] text-slate-900">
                      Transparansi Layer Bahaya
                    </span>
                  </div>
                  <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#0D653A] border border-[#B9DFC5]">
                    {Math.round(layerOpacity * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={layerOpacity}
                  onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                  aria-label="Pengatur Transparansi Layer Bahaya"
                  className="w-full accent-[#16834B] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Transparan (20%)</span>
                  <span>Standar (65%)</span>
                  <span>Pekat (100%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kecamatan List Modal Triggered by "Lihat wilayah" */}
      <KecamatanListModal
        hazardLevel={selectedHazardModal}
        allKecamatan={allKecamatan}
        onClose={() => setSelectedHazardModal(null)}
        onSelectKecamatan={(k) => {
          setSelectedKecamatan(k);
          if (onSelectKecamatan) onSelectKecamatan(k);
          onClose(); // Close mobile sheet so map can be viewed
        }}
      />
    </>,
    document.body
  );
};
