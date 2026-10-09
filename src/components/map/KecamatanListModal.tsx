import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Waves, 
  ExternalLink,
  Search
} from 'lucide-react';
import type { HazardLevel, KecamatanIndicator } from '../../types';
import { useNavigate } from 'react-router-dom';
import { registerBackButtonHandler } from '../../lib/native/back-button';

interface KecamatanListModalProps {
  hazardLevel: HazardLevel | null;
  allKecamatan: KecamatanIndicator[];
  onClose: () => void;
  onSelectKecamatan?: (k: KecamatanIndicator) => void;
}

export const KecamatanListModal: React.FC<KecamatanListModalProps> = ({
  hazardLevel,
  allKecamatan,
  onClose,
  onSelectKecamatan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Reset search term when hazardLevel changes or modal opens
  useEffect(() => {
    if (hazardLevel) {
      setSearchTerm('');
    }
  }, [hazardLevel]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!hazardLevel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hazardLevel]);

  // Handle Escape key
  useEffect(() => {
    if (!hazardLevel) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hazardLevel, onClose]);

  // Handle Android hardware back button
  useEffect(() => {
    if (!hazardLevel) return;
    return registerBackButtonHandler(() => {
      onClose();
      return true;
    }, 20);
  }, [hazardLevel, onClose]);

  if (!hazardLevel) return null;

  const filteredList = allKecamatan.filter(k => {
    const matchesLevel = k.hazard_level.toLowerCase() === hazardLevel.toLowerCase();
    if (!matchesLevel) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      k.name.toLowerCase().includes(term) ||
      k.primary_rivers.some(r => r.toLowerCase().includes(term))
    );
  });

  const getTheme = () => {
    switch (hazardLevel) {
      case 'Tinggi':
        return {
          title: 'Bahaya Tinggi',
          icon: AlertTriangle,
          headerBg: 'bg-red-50',
          headerBorder: 'border-red-200',
          iconBg: 'bg-[#DC2626]',
          iconColor: 'text-white',
          titleColor: 'text-red-950',
          badgeBg: 'bg-red-100 text-red-900 border-red-300',
          cardBg: 'bg-[#FEF2F2]',
          cardBorder: 'border-red-200',
          accentBtn: 'bg-red-600 hover:bg-red-700 text-white',
          description: 'Wilayah bantaran sungai aktif dan cekungan dataran rendah dengan riwayat luapan banjir ekstrem.',
        };
      case 'Sedang':
        return {
          title: 'Bahaya Sedang',
          icon: ShieldAlert,
          headerBg: 'bg-amber-50',
          headerBorder: 'border-amber-200',
          iconBg: 'bg-[#D97706]',
          iconColor: 'text-white',
          titleColor: 'text-amber-950',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          cardBg: 'bg-[#FFFBEB]',
          cardBorder: 'border-amber-200',
          accentBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
          description: 'Wilayah dataran aluvial dan transisi pesisir dengan potensi genangan saat hujan lebat berkepanjangan.',
        };
      case 'Rendah':
      default:
        return {
          title: 'Bahaya Rendah',
          icon: ShieldCheck,
          headerBg: 'bg-emerald-50',
          headerBorder: 'border-emerald-200',
          iconBg: 'bg-[#16834B]',
          iconColor: 'text-white',
          titleColor: 'text-emerald-950',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          cardBg: 'bg-[#F0FDF4]',
          cardBorder: 'border-emerald-200',
          accentBtn: 'bg-[#16834B] hover:bg-[#0D653A] text-white',
          description: 'Wilayah perbukitan dan hulu sungai dengan elevasi tinggi serta risiko genangan minim.',
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return createPortal(
    <div 
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="kecamatan-modal-title"
        className="w-full sm:max-w-xl max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl border border-[#E3EAE5] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 ${theme.headerBg} border-b ${theme.headerBorder} flex items-start justify-between gap-3`}>
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 id="kecamatan-modal-title" className={`text-base sm:text-lg font-extrabold ${theme.titleColor}`}>
                  Wilayah {theme.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border whitespace-nowrap ${theme.badgeBg}`}>
                  {filteredList.length} Kecamatan
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed mt-1">
                {theme.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup jendela daftar wilayah"
            className="min-h-[48px] min-w-[48px] rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-[#E3EAE5] bg-slate-50/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama kecamatan atau sungai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E3EAE5] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#16834B] focus:ring-1 focus:ring-[#16834B] transition"
            />
          </div>
        </div>

        {/* Scrollable Kecamatan List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5 overscroll-contain flex-1">
          {filteredList.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Tidak ditemukan kecamatan yang sesuai dengan pencarian "{searchTerm}".
            </div>
          ) : (
            filteredList.map((kec) => (
              <div
                key={kec.id}
                className={`p-3.5 rounded-xl border ${theme.cardBorder} ${theme.cardBg} transition flex flex-col gap-2.5`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0D653A] shrink-0" />
                    <span className="font-extrabold text-sm sm:text-base text-slate-900">
                      Kecamatan {kec.name}
                    </span>
                    {kec.is_capital && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#0D653A] border border-[#B9DFC5] whitespace-nowrap">
                        Ibukota
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 border border-slate-200 whitespace-nowrap">
                    Skor: {kec.hazard_score.toFixed(2)}
                  </span>
                </div>

                {/* Info Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{kec.population_total.toLocaleString('id-ID')} jiwa ({kec.area_km2} km²)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">DAS: {kec.primary_rivers.join(', ')}</span>
                  </div>
                </div>

                {/* Actions: Minimum 48dp touch target */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-end gap-2">
                  {onSelectKecamatan && (
                    <button
                      onClick={() => {
                        onSelectKecamatan(kec);
                        onClose();
                      }}
                      className="min-h-[48px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5 active:scale-95 transition"
                    >
                      Pusatkan di Peta
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/areas/${kec.id}`);
                    }}
                    className={`min-h-[48px] px-4 py-2 rounded-xl ${theme.accentBtn} font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition`}
                  >
                    Profil Wilayah
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-[#E3EAE5] text-center text-[11px] text-slate-500">
          Sumber Data: InaRISK BNPB • BPS Kabupaten Aceh Utara • BPBD
        </div>
      </div>
    </div>,
    document.body
  );
};
