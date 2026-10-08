import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldAlert, 
  Users, 
  Waves, 
  CloudRain, 
  Mountain, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Building2,
  Calendar
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { FloodMap } from '../components/map/FloodMap';
import type { KecamatanIndicator, PublicFacility, EvacuationPoint } from '../types';

export const AreaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<KecamatanIndicator | null>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [evacuations, setEvacuations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await dataService.getKecamatanById(id);
        if (found) {
          setItem(found);
          const [facGeo, evacGeo] = await Promise.all([
            dataService.getFacilitiesGeoJSON(),
            dataService.getEvacuationPointsGeoJSON()
          ]);
          // Filter facilities in this kecamatan
          const matchedFac = (facGeo.features || []).filter(
            (f: any) => f.properties?.kecamatan?.toLowerCase() === found.name.toLowerCase()
          );
          const matchedEvac = (evacGeo.features || []).filter(
            (f: any) => f.properties?.kecamatan?.toLowerCase() === found.name.toLowerCase()
          );
          setFacilities(matchedFac);
          setEvacuations(matchedEvac);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-3">
        <div className="w-8 h-8 border-4 border-[#16834B] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#66766C]">Memuat data spasial kecamatan...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-3">
        <p className="font-bold text-red-600">Kecamatan tidak ditemukan.</p>
        <button
          onClick={() => navigate('/areas')}
          className="pill-btn bg-[#16834B] text-white px-4 py-2 text-xs"
        >
          Kembali ke Daftar Wilayah
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/areas')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66766C] hover:text-[#0D653A] bg-white px-3 py-1.5 rounded-full border border-[#E3EAE5]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Wilayah</span>
        </button>

        <span className="text-xs text-[#66766C]">ID Wilayah: {item.id}</span>
      </div>

      {/* Main Title Card */}
      <div className="card-farm p-6 bg-white border border-[#E3EAE5] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3EAE5] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A]">
                Kecamatan {item.name}
              </h1>
              {item.is_capital && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#16834B] border border-[#B9DFC5]">
                  Ibukota Kabupaten
                </span>
              )}
            </div>
            <p className="text-xs text-[#66766C]">
              Kabupaten Aceh Utara, Provinsi Aceh • Kode Administrasi BPS: 1111{item.id.slice(-3)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${
              item.hazard_level === 'Tinggi' ? 'bg-red-100 text-red-700 border border-red-200' :
              item.hazard_level === 'Sedang' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
              'bg-green-100 text-green-700 border border-green-200'
            }`}>
              Bahaya {item.hazard_level} (InaRISK: {(item.hazard_score * 100).toFixed(0)}/100)
            </span>
          </div>
        </div>

        {/* 4 Key Physical Parameters (Fitur 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#F4F7F5] p-3 rounded-2xl border border-[#E3EAE5]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#66766C]">
              <Mountain className="w-3.5 h-3.5 text-[#16834B]" />
              <span>Elevasi</span>
            </div>
            <p className="text-base font-extrabold text-[#25352D]">{item.elevation_range}</p>
            <p className="text-[10px] text-[#66766C]">Sumber: DEMNAS BIG</p>
          </div>

          <div className="bg-[#F4F7F5] p-3 rounded-2xl border border-[#E3EAE5]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#66766C]">
              <TrendingUp className="w-3.5 h-3.5 text-[#16834B]" />
              <span>Kemiringan Lereng</span>
            </div>
            <p className="text-base font-extrabold text-[#25352D]">{item.slope_class}</p>
            <p className="text-[10px] text-[#66766C]">Klasifikasi Topografi</p>
          </div>

          <div className="bg-[#F4F7F5] p-3 rounded-2xl border border-[#E3EAE5]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#66766C]">
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
              <span>Curah Hujan</span>
            </div>
            <p className="text-base font-extrabold text-[#25352D]">{item.rainfall_annual_mm} mm</p>
            <p className="text-[10px] text-[#66766C]">Rata-rata per Tahun (BMKG)</p>
          </div>

          <div className="bg-[#F4F7F5] p-3 rounded-2xl border border-[#E3EAE5]/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#66766C]">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Penduduk (BPS)</span>
            </div>
            <p className="text-base font-extrabold text-[#25352D]">{item.population_total.toLocaleString()}</p>
            <p className="text-[10px] text-[#66766C]">Kepadatan: {item.density_per_km2}/km²</p>
          </div>
        </div>
      </div>

      {/* River Basin & Flood History Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* River & Vulnerability */}
        <div className="card-farm p-5 space-y-3">
          <h3 className="font-extrabold text-sm text-[#25352D] flex items-center gap-2">
            <Waves className="w-4 h-4 text-sky-600" />
            <span>Daerah Aliran Sungai & Sektor Rentan</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#F4F7F5] rounded-xl border border-[#E3EAE5]">
              <span className="font-bold text-[#66766C] block mb-1">Sungai Melintasi Wilayah:</span>
              <p className="font-extrabold text-[#0D653A] text-sm">
                {item.primary_rivers.join(' • ')}
              </p>
            </div>

            <div className="p-3 bg-[#F4F7F5] rounded-xl border border-[#E3EAE5]">
              <span className="font-bold text-[#66766C] block mb-1.5">Sektor Paling Terpapar / Rentan:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.vulnerable_sectors.map((s: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-white border border-[#E3EAE5] rounded-full font-semibold text-[#25352D] text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flood History */}
        <div className="card-farm p-5 space-y-3">
          <h3 className="font-extrabold text-sm text-[#25352D] flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <span>Riwayat Kejadian Banjir Tercatat</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-red-800 uppercase block">Banjir Besar Terakhir</span>
              <p className="font-extrabold text-red-900 text-sm">{item.last_major_flood}</p>
              <p className="text-[11px] text-red-700">Sumber: Pusdalops BPBD Kab. Aceh Utara</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F4F7F5] rounded-xl border border-[#E3EAE5]">
              <span className="text-[#66766C] font-semibold">Frekuensi Banjir Tercatat (2015-2023):</span>
              <span className="font-extrabold text-[#25352D] text-sm">{item.historical_flood_events} Kali</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities & Evacuation Shelters in This Subdistrict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Facilities */}
        <div className="card-farm p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2">
            <h4 className="font-extrabold text-sm text-[#25352D] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Fasilitas Pelayanan Publik Terdata ({facilities.length})</span>
            </h4>
          </div>

          {facilities.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {facilities.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#F4F7F5] border border-[#E3EAE5] text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#25352D]">{f.properties.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {f.properties.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66766C]">{f.properties.address}</p>
                  {f.properties.phone && (
                    <p className="text-[10px] text-blue-600 font-medium">Telp: {f.properties.phone}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#66766C] italic py-2">
              Tidak ada data fasilitas kesehatan/pemerintah khusus pada rincian data tersimpan saat ini. Rujukan terdekat dapat diakses di ibukota Lhoksukon atau Dewantara.
            </p>
          )}
        </div>

        {/* Evacuation Shelters */}
        <div className="card-farm p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2">
            <h4 className="font-extrabold text-sm text-[#25352D] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>Titik Evakuasi Terverifikasi ({evacuations.length})</span>
            </h4>
          </div>

          {evacuations.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {evacuations.map((e, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#E8F5E9]/50 border border-[#B9DFC5] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0D653A]">{e.properties.name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {e.properties.capacity_persons} Jiwa
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66766C]">{e.properties.address}</p>
                  <p className="text-[10px] text-[#0D653A] font-semibold">
                    Fasilitas: {(e.properties.facilities_available || []).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#66766C] italic py-2">
              Titik pengungsian mandiri di gampong menggunakan Meunasah dan balai desa dataran tinggi setempat sesuai arahan Keuchik & BPBD.
            </p>
          )}
        </div>
      </div>

      {/* Map Action Banner */}
      <div className="card-farm p-4 bg-[#E8F5E9] border-[#B9DFC5] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#0D653A]">
          <span className="font-extrabold">Lihat Geometri Wilayah di Peta Web GIS</span>
          <p className="text-[11px] text-[#66766C]">Periksa batas kecamatan, poligon bahaya, dan jaringan sungai secara spasial.</p>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="pill-btn bg-[#16834B] hover:bg-[#0D653A] text-white px-4 py-2 text-xs font-bold shrink-0"
        >
          <span>Buka Peta Interaktif</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
