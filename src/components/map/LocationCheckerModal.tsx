import React, { useState } from 'react';
import { 
  MapPin, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  ExternalLink, 
  Navigation2,
  CheckCircle2,
  Building2,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useNavigate } from 'react-router-dom';

interface LocationCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationCheckerModal: React.FC<LocationCheckerModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const runLocationCheck = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const checkResult = await dataService.checkUserLocation(lat, lng);
      setResult(checkResult);
    } catch (err: any) {
      setError(err.message || 'Gagal memeriksa posisi geospasial.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentGPS = () => {
    if (!navigator.geolocation) {
      setError('Peramban web Anda tidak mendukung Geolocation API.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        runLocationCheck(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Izin akses lokasi ditolak. Izinkan akses lokasi untuk menggunakan fitur ini, atau gunakan titik demonstrasi Aceh Utara di bawah ini.');
        } else {
          setError(`Gagal mendapatkan sinyal GPS: ${err.message}. Silakan gunakan titik demonstrasi wilayah Aceh Utara.`);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Demo locations inside Aceh Utara for LKTI presentation testing
  const demoLocations = [
    { name: "Lhoksukon (Pusat Ibukota)", lat: 5.0441, lng: 97.3188, note: "Bantaran Krueng Keureuto (Bahaya Tinggi)" },
    { name: "Matangkuli (Kawasan Rawan Banjir)", lat: 5.0064, lng: 97.2621, note: "Pertemuan 3 Sungai (Bahaya Tinggi)" },
    { name: "Samudera (Kawasan Pesisir & Sejarah)", lat: 5.1274, lng: 97.2181, note: "DAS Krueng Pase (Bahaya Sedang)" },
    { name: "Sawang (Kawasan Hulu Perbukitan)", lat: 5.0112, lng: 96.8852, note: "Elevasi Tinggi (Bahaya Rendah)" },
    { name: "Luar Wilayah (Banda Aceh)", lat: 5.5483, lng: 95.3238, note: "Uji Validasi Di Luar Aceh Utara" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E3EAE5] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E3EAE5] flex items-center justify-between bg-gradient-to-r from-[#16834B] to-[#0D653A] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Periksa Lokasi Saya</h3>
              <p className="text-xs text-[#B9DFC5]">Penapisan Geospasial Wilayah Ancaman Banjir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main GPS Trigger */}
          <div className="text-center space-y-3">
            <p className="text-xs text-[#66766C]">
              Sistem akan membaca titik koordinat perangkat Anda dan melakukan analisis penapisan spasial 
              (<em>point-in-polygon</em>) terhadap batas administrasi dan indeks bahaya banjir BNPB InaRISK Kabupaten Aceh Utara.
            </p>

            <button
              onClick={handleGetCurrentGPS}
              disabled={loading}
              className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-3.5 text-sm shadow-md shadow-[#16834B]/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Analisis Geospasial...</span>
                </>
              ) : (
                <>
                  <Navigation2 className="w-5 h-5" />
                  <span>Deteksi Posisi GPS Saya Sekarang</span>
                </>
              )}
            </button>
          </div>

          {/* LKTI Quick Tester Pills */}
          <div className="bg-[#F4F7F5] p-3.5 rounded-2xl border border-[#E3EAE5]">
            <p className="text-[11px] font-bold text-[#25352D] mb-2 flex items-center gap-1.5">
              <span>Uji Coba Titik Lokasi LKTI:</span>
              <span className="text-[10px] text-[#66766C] font-normal">(Pilihan demonstrasi tanpa GPS fisik)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => runLocationCheck(loc.lat, loc.lng)}
                  className="text-left p-2 rounded-xl bg-white border border-[#E3EAE5] hover:border-[#16834B] hover:bg-[#E8F5E9]/50 transition text-xs"
                >
                  <p className="font-bold text-[#25352D] truncate">{loc.name}</p>
                  <p className="text-[10px] text-[#66766C] truncate">{loc.note}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {!result.isInside ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Luar Cakupan Wilayah</span>
                  </div>
                  <p className="text-xs text-amber-700">{result.message}</p>
                  <p className="text-[10px] text-amber-600">
                    Koordinat terdeteksi: {result.userCoord[0].toFixed(5)}, {result.userCoord[1].toFixed(5)}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-[#B9DFC5] shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2.5">
                    <div>
                      <p className="text-[11px] text-[#66766C] font-semibold uppercase">Hasil Identifikasi Wilayah</p>
                      <h4 className="text-base font-extrabold text-[#0D653A]">
                        Kecamatan {result.kecamatanName}
                      </h4>
                    </div>
                    {result.indicator && (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        result.indicator.hazard_level === 'Tinggi' ? 'bg-red-100 text-red-700 border border-red-200' :
                        result.indicator.hazard_level === 'Sedang' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        Bahaya {result.indicator.hazard_level}
                      </span>
                    )}
                  </div>

                  {/* Scientific Indicators */}
                  {result.indicator ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#F4F7F5] p-2.5 rounded-xl border border-[#E3EAE5]">
                        <p className="text-[10px] text-[#66766C]">Elevasi</p>
                        <p className="font-bold text-[#25352D]">{result.indicator.elevation_range}</p>
                      </div>
                      <div className="bg-[#F4F7F5] p-2.5 rounded-xl border border-[#E3EAE5]">
                        <p className="text-[10px] text-[#66766C]">Kemiringan Lereng</p>
                        <p className="font-bold text-[#25352D]">{result.indicator.slope_class}</p>
                      </div>
                      <div className="bg-[#F4F7F5] p-2.5 rounded-xl border border-[#E3EAE5]">
                        <p className="text-[10px] text-[#66766C]">Kepadatan Penduduk</p>
                        <p className="font-bold text-[#25352D]">{result.indicator.density_per_km2} jiwa/km²</p>
                      </div>
                      <div className="bg-[#F4F7F5] p-2.5 rounded-xl border border-[#E3EAE5]">
                        <p className="text-[10px] text-[#66766C]">Sungai Utama</p>
                        <p className="font-bold text-[#25352D] truncate">
                          {result.indicator.primary_rivers.join(', ')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Belum tersedia informasi bahaya banjir yang tervalidasi untuk lokasi ini.</p>
                  )}

                  {/* Nearest Evacuation Shelters */}
                  {result.nearestEvacuations && result.nearestEvacuations.length > 0 && (
                    <div className="pt-2 border-t border-[#E3EAE5]">
                      <p className="text-xs font-bold text-[#25352D] mb-1.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#16834B]" />
                        <span>Titik Evakuasi Terdekat:</span>
                      </p>
                      <div className="space-y-1.5">
                        {result.nearestEvacuations.map((evac: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#F4F7F5] border border-[#E3EAE5]">
                            <div className="min-w-0 pr-2">
                              <p className="font-bold text-[#25352D] truncate">{evac.name}</p>
                              <p className="text-[10px] text-[#66766C] truncate">{evac.facility_type}</p>
                            </div>
                            <span className="shrink-0 font-extrabold text-[#16834B] text-xs">
                              {evac.distanceKm} km
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer Note */}
                  <div className="text-[11px] text-[#66766C] bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{result.disclaimer}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex gap-2">
                    {result.indicator && (
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/areas/${result.indicator.id}`);
                        }}
                        className="pill-btn flex-1 bg-[#16834B] hover:bg-[#0D653A] text-white py-2 text-xs"
                      >
                        Lihat Analisis Detail Kecamatan
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onClose();
                        navigate(`/map`);
                      }}
                      className="pill-btn flex-1 bg-white border border-[#E3EAE5] text-[#25352D] hover:bg-[#F4F7F5] py-2 text-xs"
                    >
                      Buka Peta Interaktif
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
