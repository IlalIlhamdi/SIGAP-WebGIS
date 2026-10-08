import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Navigation,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';

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
  const [waterDepth, setWaterDepth] = useState<number>(50);
  const [eventTime, setEventTime] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [loadingGps, setLoadingGps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Update default coordinates when subdistrict changes
  const handleKecamatanChange = (kecName: string) => {
    setSelectedKecamatan(kecName);
    const kec = allKecamatan.find(k => k.name === kecName);
    // Provide approximate center for subdistrict
    if (kec) {
      if (kecName === 'Matangkuli') { setLat(5.0064); setLng(97.2621); }
      else if (kecName === 'Pirak Timur') { setLat(4.9652); setLng(97.2882); }
      else if (kecName === 'Tanah Luas') { setLat(5.0312); setLng(97.2285); }
      else if (kecName === 'Samudera') { setLat(5.1274); setLng(97.2181); }
      else if (kecName === 'Lhoksukon') { setLat(5.0441); setLng(97.3188); }
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung peramban ini.");
      return;
    }
    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLoadingGps(false);
      },
      (err) => {
        alert("Gagal membaca GPS: " + err.message);
        setLoadingGps(false);
      },
      { timeout: 8000 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      const created = dataService.addReport({
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

      setSuccessCode(created.report_code);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengirim laporan.");
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66766C] hover:text-[#0D653A] bg-white px-3 py-1.5 rounded-full border border-[#E3EAE5]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Laporan</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="card-farm p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#16834B]">
            <PlusCircle className="w-4 h-4" />
            <span>Formulir Pengaduan Banjir</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0D653A]">
            Laporkan Kejadian Banjir
          </h1>
          <p className="text-xs text-[#66766C]">
            Bantu petugas BPBD dan sesama warga memantau kondisi air di gampong Anda secara cepat dan akurat.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-[#0D653A] flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#16834B] shrink-0 mt-0.5" />
          <span>
            <strong>Jaminan Privasi:</strong> Nama dan kontak WhatsApp Anda tidak akan pernah dipublikasikan secara umum. Kontak hanya digunakan oleh verifikator Pusdalops BPBD untuk konfirmasi situasi darurat jika diperlukan.
          </span>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
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
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white transition"
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
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white transition"
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
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white font-semibold transition"
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
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white transition"
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
              className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white transition"
            />
          </div>

          {/* Coordinates & GPS Trigger */}
          <div className="space-y-2 bg-[#F4F7F5] p-3.5 rounded-2xl border border-[#E3EAE5]">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#25352D] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16834B]" />
                <span>Koordinat Geografis (Latitude, Longitude)</span>
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={loadingGps}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16834B] hover:underline"
              >
                {loadingGps ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                <span>Ambil GPS Saat Ini</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="bg-white border border-[#E3EAE5] rounded-xl px-3 py-2 text-xs font-mono"
              />
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="bg-white border border-[#E3EAE5] rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>
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
                  className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white font-bold"
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
                className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white font-medium"
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
              placeholder="Ceritakan kondisi air, apakah jalan terputus, rumah terendam, atau warga butuh evakuasi perahu karet..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#25352D] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#16834B]" />
              <span>Unggah Foto Bukti Kejadian</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#E8F5E9] file:text-[#16834B] hover:file:bg-[#B9DFC5] cursor-pointer"
            />

            {photoPreview && (
              <div className="relative rounded-2xl overflow-hidden h-40 border border-[#E3EAE5] mt-2">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full font-bold"
                >
                  Hapus Foto
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-3.5 text-sm font-bold shadow-md shadow-[#16834B]/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirim Laporan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#B9DFC5]" />
                  <span>Kirim Laporan Resmi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-[#E3EAE5] animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#16834B] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-[#0D653A]">
                Laporan Berhasil Terkirim!
              </h3>
              <p className="text-xs text-[#66766C]">
                Kode Laporan Anda: <strong className="font-mono text-[#25352D]">{successCode}</strong>
              </p>
            </div>

            <p className="text-xs text-[#25352D] bg-[#F4F7F5] p-3 rounded-2xl border border-[#E3EAE5] leading-relaxed">
              Laporan Anda telah tercatat dengan status <strong>"Menunggu Verifikasi"</strong> dan masuk ke antrean Pusat Pengendalian Operasi BPBD Aceh Utara.
            </p>

            <button
              onClick={() => navigate('/reports')}
              className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-3 text-xs font-bold"
            >
              Lihat Daftar Laporan Masyarakat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
