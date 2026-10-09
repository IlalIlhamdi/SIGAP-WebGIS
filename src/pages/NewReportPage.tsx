import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Navigation,
  Lock,
  Image,
  HardDrive,
  RefreshCw,
  X,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dataService, type AddReportResult } from '../services/dataService';
import { getCurrentCoordinates } from '../lib/native/geolocation';
import { pickOrCapturePhoto } from '../lib/native/camera';
import { registerBackButtonHandler } from '../lib/native/back-button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const NewReportPage: React.FC = () => {
  const { allKecamatan } = useApp();
  const navigate = useNavigate();

  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Lhoksukon');
  const [gampong, setGampong] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [lat, setLat] = useState<number>(5.0441);
  const [lng, setLng] = useState<number>(97.3188);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [waterDepth, setWaterDepth] = useState<number>(50);
  const [eventTime, setEventTime] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [loadingGps, setLoadingGps] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<AddReportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);
  const [gpsDenied, setGpsDenied] = useState(false);

  // Register Android back button listener
  useEffect(() => {
    if (submissionResult) {
      return registerBackButtonHandler(() => {
        setSubmissionResult(null);
        navigate('/reports');
        return true;
      }, 20);
    }
  }, [submissionResult, navigate]);

  // Update default coordinates when subdistrict changes
  const handleKecamatanChange = (kecName: string) => {
    setSelectedKecamatan(kecName);
    const coordsMap: Record<string, [number, number]> = {
      'Matangkuli': [5.0064, 97.2621],
      'Pirak Timur': [4.9652, 97.2882],
      'Tanah Luas': [5.0312, 97.2285],
      'Samudera': [5.1274, 97.2181],
      'Lhoksukon': [5.0441, 97.3188],
      'Baktiya': [5.0833, 97.4167],
      'Baktiya Barat': [5.1167, 97.3833],
      'Syamtalira Aron': [5.0833, 97.2167],
      'Syamtalira Bayu': [5.1167, 97.1833],
      'Meurah Mulia': [5.0500, 97.1667],
      'Kuta Makmur': [5.0833, 97.0500],
      'Simpang Keuramat': [5.0667, 97.0833],
      'Sawang': [5.0112, 96.8852],
      'Nisam': [5.1000, 96.9833],
      'Nisam Antara': [5.0167, 96.9500],
      'Banda Baro': [5.1333, 97.0167],
      'Dewantara': [5.2333, 97.0167],
      'Muara Batu': [5.2333, 96.9500],
      'Geuredong Pase': [4.9333, 97.1167],
      'Paya Bakong': [4.9500, 97.2000],
      'Nibong': [5.0500, 97.2500],
      'Cot Girek': [4.9833, 97.3833],
      'Langkahan': [4.9500, 97.5167],
      'Seunuddon': [5.1667, 97.4667],
      'Tanah Pasir': [5.1167, 97.2667],
      'Lapang': [5.1667, 97.2833],
      'Tanah Jambo Aye': [5.1333, 97.5000]
    };
    if (coordsMap[kecName]) {
      setLat(coordsMap[kecName][0]);
      setLng(coordsMap[kecName][1]);
      setGpsAccuracy(null);
      setGpsNotice(`Koordinat diset ke titik acuan Kecamatan ${kecName}.`);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLoadingGps(true);
    setGpsNotice(null);
    setGpsDenied(false);

    try {
      const { coords, error } = await getCurrentCoordinates();

      if (error || !coords) {
        setGpsDenied(true);
        setGpsNotice(error?.message || 'Izin GPS ditolak atau tidak tersedia. Silakan gunakan titik acuan kecamatan atau koordinat manual.');
        return;
      }

      setLat(parseFloat(coords.latitude.toFixed(6)));
      setLng(parseFloat(coords.longitude.toFixed(6)));
      if (coords.accuracy) {
        setGpsAccuracy(Math.round(coords.accuracy));
        setGpsNotice(`Akurasi sinyal GPS: ±${Math.round(coords.accuracy)} meter.`);
      } else {
        setGpsNotice('Koordinat GPS berhasil diperoleh.');
      }
    } finally {
      setLoadingGps(false);
    }
  };

  const handleCapturePhoto = async (source: 'camera' | 'photos' | 'prompt') => {
    setLoadingPhoto(true);
    setErrorMsg(null);

    try {
      const res = await pickOrCapturePhoto(source);

      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.dataUrl) {
        setPhotoPreview(res.dataUrl);
      }
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Prevent double submit

    setErrorMsg(null);

    // Validation
    if (!selectedKecamatan || !gampong.trim() || !locationDetail.trim() || !description.trim()) {
      setErrorMsg("Mohon lengkapi seluruh field formulir yang wajib diisi (*).");
      return;
    }

    if (waterDepth <= 0 || waterDepth > 500) {
      setErrorMsg("Ketinggian genangan harus bernilai antara 1 cm hingga 500 cm.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await dataService.addReport({
        reporter_name: reporterName.trim() || 'Warga Anonim',
        reporter_contact: reporterContact.trim() || undefined,
        kecamatan: selectedKecamatan,
        gampong: gampong.trim(),
        location_detail: locationDetail.trim(),
        coord: [lat, lng],
        event_time: eventTime,
        water_depth_cm: Number(waterDepth),
        description: description.trim(),
        photo_url: photoPreview || undefined,
      });

      setSubmissionResult(result);
    } catch (err: any) {
      // Retain form inputs, show error
      setErrorMsg(err.message || "Gagal mengirim laporan. Isian formulir Anda tetap tersimpan, silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66766C] hover:text-[#0D653A] bg-white px-3.5 py-2 rounded-full border border-[#E3EAE5] touch-target-48"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Laporan</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="card-farm p-5 sm:p-8 space-y-6">
        <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#16834B]">
            <PlusCircle className="w-4 h-4" />
            <span>Formulir Pengaduan Banjir</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0D653A]">
            Laporkan Kejadian Banjir
          </h1>
          <p className="text-xs text-[#66766C]">
            Bantu petugas BPBD dan sesama warga memantau kondisi air di gampong Anda secara cepat dan akurat.
          </p>
        </div>

        {/* Privacy Guarantee Note */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-[#0D653A] flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#16834B] shrink-0 mt-0.5" />
          <span>
            <strong>Jaminan Privasi:</strong> Identitas dan nomor telepon Anda terlindungi enkripsi dan tidak akan ditampilkan ke publik. Informasi hanya digunakan oleh Pusdalops BPBD untuk verifikasi lapangan darurat.
          </span>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reporter Identity (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">
                Nama Pelapor <span className="text-[#66766C] font-normal">(Boleh Anonim)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Tgk. Zakaria"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-3 outline-none focus:border-[#16834B] focus:bg-white transition text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">
                Kontak WhatsApp <span className="text-[#66766C] font-normal">(Privat / Khusus BPBD)</span>
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-3 outline-none focus:border-[#16834B] focus:bg-white transition text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Kecamatan & Gampong */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedKecamatan}
                onChange={(e) => handleKecamatanChange(e.target.value)}
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-3 outline-none focus:border-[#16834B] focus:bg-white font-semibold transition text-xs sm:text-sm"
              >
                {allKecamatan.map((k) => (
                  <option key={k.id} value={k.name}>
                    {k.name} ({k.hazard_level})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">
                Gampong / Desa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Ceumpeudak / Alue Bili"
                required
                value={gampong}
                onChange={(e) => setGampong(e.target.value)}
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-3 outline-none focus:border-[#16834B] focus:bg-white transition text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Location Detail */}
          <div className="space-y-1">
            <label className="font-bold text-[#25352D]">
              Patokan / Lokasi Detail <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Dekat Jembatan Gantung Krueng Peuto / Depan Meunasah"
              required
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-3 outline-none focus:border-[#16834B] focus:bg-white transition text-xs sm:text-sm"
            />
          </div>

          {/* Coordinates & GPS Trigger */}
          <div className="space-y-2 bg-[#F4F7F5] p-3.5 rounded-2xl border border-[#E3EAE5]">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label className="font-bold text-[#25352D] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16834B]" />
                <span>Koordinat Geografis (Latitude, Longitude)</span>
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={loadingGps}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#16834B] hover:text-[#0D653A] bg-white px-3.5 py-1.5 rounded-full border border-[#B9DFC5] touch-target-48 min-w-[170px]"
              >
                {loadingGps ? <LoadingSpinner size="xs" color="primary" /> : <Navigation className="w-3.5 h-3.5" />}
                <span>{loadingGps ? 'Mencari lokasi…' : 'Deteksi GPS Perangkat'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-[#66766C] block">Latitude</span>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E3EAE5] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#66766C] block">Longitude</span>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-[#E3EAE5] rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            {gpsNotice && (
              <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-[#E3EAE5]">
                <p className="text-[11px] text-[#0D653A] font-semibold">
                  ℹ️ {gpsNotice}
                </p>
                {gpsAccuracy !== null && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ±{gpsAccuracy}m {gpsAccuracy <= 15 ? '(Akurasi Sangat Baik)' : gpsAccuracy <= 50 ? '(Akurasi Baik)' : '(Akurasi Standar)'}
                  </span>
                )}
              </div>
            )}

            {gpsDenied && (
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-[11px] text-amber-800 font-medium">GPS tidak tersedia?</span>
                <button
                  type="button"
                  onClick={() => handleKecamatanChange(selectedKecamatan)}
                  className="text-[11px] font-bold text-[#16834B] hover:underline flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#B9DFC5]"
                >
                  <Compass className="w-3 h-3" />
                  Gunakan Titik Default {selectedKecamatan}
                </button>
              </div>
            )}
          </div>

          {/* Water Depth & Event Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">
                Estimasi Ketinggian Air (cm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  required
                  value={waterDepth}
                  onChange={(e) => setWaterDepth(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-3 outline-none focus:border-[#16834B] focus:bg-white font-bold text-xs sm:text-sm"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#66766C]">
                  cm
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">
                Waktu Kejadian <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-3 outline-none focus:border-[#16834B] focus:bg-white font-medium text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-[#25352D]">
              Deskripsi Situasi / Dampak <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Ceritakan kondisi air, apakah jalan terputus, rumah terendam, atau warga butuh evakuasi perahu darurat..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white resize-none text-xs sm:text-sm"
            />
          </div>

          {/* Photo Upload via Native Camera / Gallery / Web */}
          <div className="space-y-2 bg-[#F4F7F5] p-3.5 rounded-2xl border border-[#E3EAE5]">
            <label className="font-bold text-[#25352D] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#16834B]" />
                <span>Foto Bukti Kejadian Banjir</span>
              </span>
              <span className="text-[10px] text-[#66766C] font-normal">Kompresi otomatis max 1280px</span>
            </label>

            {!photoPreview ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCapturePhoto('camera')}
                  disabled={loadingPhoto}
                  className="pill-btn flex-1 min-w-[140px] bg-white hover:bg-emerald-50 border border-[#B9DFC5] text-[#0D653A] py-2.5 px-3 text-xs font-bold touch-target-48"
                >
                  {loadingPhoto ? <LoadingSpinner size="xs" color="primary" /> : <Camera className="w-4 h-4" />}
                  <span>{loadingPhoto ? 'Memproses foto…' : 'Buka Kamera'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCapturePhoto('photos')}
                  disabled={loadingPhoto}
                  className="pill-btn flex-1 min-w-[140px] bg-white hover:bg-emerald-50 border border-[#B9DFC5] text-[#0D653A] py-2.5 px-3 text-xs font-bold touch-target-48"
                >
                  {loadingPhoto ? <LoadingSpinner size="xs" color="primary" /> : <Image className="w-4 h-4" />}
                  <span>{loadingPhoto ? 'Memproses foto…' : 'Pilih dari Galeri'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden h-48 border border-[#E3EAE5] bg-black/5">
                  <img src={photoPreview} alt="Bukti Foto Banjir" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    aria-label="Hapus Foto"
                    className="absolute top-2 right-2 bg-red-600/90 text-white text-[11px] px-3 py-1.5 rounded-full font-bold shadow-md hover:bg-red-700 transition touch-target-48 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleCapturePhoto('prompt')}
                  className="text-xs text-[#16834B] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Ambil Ulang / Ganti Foto</span>
                </button>
              </div>
            )}
          </div>

          {/* Submit Button with Double-Submit Prevention */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-4 text-sm font-bold shadow-md shadow-[#16834B]/20 disabled:opacity-50 touch-target-48 min-w-[200px]"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Mengirim laporan…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#B9DFC5]" />
                  <span>Kirim Laporan Resmi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Submission Success Modal with Offline vs Online Distinction */}
      {submissionResult && createPortal(
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submission-success-title"
        >
          <div className="bg-white max-w-md w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-[#E3EAE5] animate-in zoom-in-95 duration-200">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
              submissionResult.syncedToCloud ? 'bg-[#E8F5E9] text-[#16834B]' : 'bg-amber-100 text-amber-700'
            }`}>
              {submissionResult.syncedToCloud ? <CheckCircle2 className="w-8 h-8" /> : <HardDrive className="w-8 h-8" />}
            </div>

            <div className="space-y-1">
              <h3 id="submission-success-title" className="text-xl font-extrabold text-[#0D653A]">
                {submissionResult.syncedToCloud ? 'Laporan Berhasil Terkirim ke Cloud BPBD!' : 'Laporan Tersimpan di Perangkat (Offline Draft)'}
              </h3>
              <p className="text-xs text-[#66766C]">
                Kode Laporan Anda: <strong className="font-mono text-[#25352D] bg-[#F4F7F5] px-2 py-0.5 rounded-lg border">{submissionResult.report.report_code}</strong>
              </p>
            </div>

            <div className="text-xs text-[#25352D] bg-[#F4F7F5] p-3.5 rounded-2xl border border-[#E3EAE5] leading-relaxed text-left space-y-1.5">
              <p>
                <strong>Status:</strong> <span className="text-amber-700 font-bold">Menunggu Verifikasi</span>
              </p>
              <p className="text-[11px] text-[#66766C]">
                {submissionResult.syncedToCloud 
                  ? 'Laporan telah diterima sistem cloud Pusdalops BPBD Kabupaten Aceh Utara untuk antrean verifikasi petugas lapangan.'
                  : 'Laporan tersimpan di memori perangkat lokal karena koneksi internet sedang terputus/terbatas. Laporan akan otomatis disinkronkan saat koneksi online pulih.'}
              </p>
            </div>

            <button
              onClick={() => {
                setSubmissionResult(null);
                navigate('/reports');
              }}
              className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-3.5 text-xs font-bold touch-target-48"
            >
              Lihat Daftar Riwayat Laporan
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
