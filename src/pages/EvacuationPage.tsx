import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  Users, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Compass,
  Filter
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { FloodMap } from '../components/map/FloodMap';
import type { EvacuationPoint } from '../types';

export const EvacuationPage: React.FC = () => {
  const [points, setPoints] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvac() {
      try {
        const geo = await dataService.getEvacuationPointsGeoJSON();
        if (geo?.features) {
          setPoints(geo.features);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadEvac();
  }, []);

  const filteredPoints = points.filter((p) => {
    const props = p.properties;
    const matchSearch = 
      props.name.toLowerCase().includes(search.toLowerCase()) ||
      props.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
      props.address.toLowerCase().includes(search.toLowerCase());

    const matchFacility = 
      selectedFacilityFilter === 'all' ||
      (props.facilities_available || []).some((f: string) => 
        f.toLowerCase().includes(selectedFacilityFilter.toLowerCase())
      );

    return matchSearch && matchFacility;
  });

  const totalCapacity = points.reduce((acc, curr) => acc + (curr.properties.capacity_persons || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
          <ShieldAlert className="w-4 h-4 text-[#16834B]" />
          <span>Kesiapsiagaan Darurat & Pengungsian</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
          Titik & Jalur Evakuasi Terverifikasi
        </h1>
        <p className="text-xs sm:text-sm text-[#66766C]">
          Lokasi posko pengungsian darurat resmi Kabupaten Aceh Utara menurut Dokumen Rencana Kontinjensi BPBD.
        </p>
      </div>

      {/* Safety Warning Alert (Mandatory LKTI requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-extrabold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Peringatan Keamanan Jalur Navigasi Saat Banjir:</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          Rute perjalanan menuju titik evakuasi harus selalu dikonfirmasi dengan arahan petugas BPBD atau Posko Siaga Gampong setempat. Layanan GPS atau peta navigasi umum tidak memperhitungkan kedalaman arus air dan titik genangan yang menenggelamkan ruas jalan utama. <strong>Jangan memaksakan melintasi genangan air deras.</strong>
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-farm p-4 space-y-1 border-l-4 border-l-[#16834B]">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Titik Terverifikasi BPBD</p>
          <p className="text-2xl font-black text-[#0D653A]">{points.length} Posko</p>
          <p className="text-[10px] text-[#66766C]">Tersebar di Wilayah Rawan</p>
        </div>

        <div className="card-farm p-4 space-y-1 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Total Daya Tampung</p>
          <p className="text-2xl font-black text-emerald-700">{totalCapacity.toLocaleString()} Jiwa</p>
          <p className="text-[10px] text-[#66766C]">Fasilitas Aula, Gedung & Meunasah</p>
        </div>

        <div className="card-farm p-4 space-y-1 border-l-4 border-l-blue-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Posko Induk & Logistik</p>
          <p className="text-sm font-extrabold text-[#25352D]">Landing, Lhoksukon</p>
          <p className="text-[10px] text-[#66766C]">Kompleks Kantor Bupati Aceh Utara</p>
        </div>
      </div>

      {/* Map View */}
      <div className="card-farm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2">
          <h3 className="font-extrabold text-sm text-[#25352D]">Peta Sebaran Titik Evakuasi di Aceh Utara</h3>
          <span className="text-[10px] text-[#66766C]">Ikon hijau (E) menunjukkan titik evakuasi</span>
        </div>
        <div className="h-80 w-full rounded-2xl overflow-hidden border border-[#E3EAE5]">
          <FloodMap heightClass="h-80" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card-farm p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#66766C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari titik evakuasi, kecamatan, atau gampong..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-full pl-9 pr-4 py-2 text-xs md:text-sm outline-none focus:border-[#16834B] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-[#66766C] shrink-0">Fasilitas:</span>
          {['all', 'Dapur', 'Medis', 'MCK', 'Listrik'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFacilityFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition ${
                selectedFacilityFilter === f 
                  ? 'bg-[#16834B] text-white' 
                  : 'bg-[#F4F7F5] text-[#25352D] hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'Semua Fasilitas' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Evacuation Points Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPoints.map((item, idx) => {
          const p = item.properties;
          const [lon, lat] = item.geometry.coordinates;

          return (
            <div key={idx} className="card-farm card-farm-hover p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                      {p.verification_status} BPBD
                    </span>
                    <h3 className="text-base font-extrabold text-[#0D653A] mt-1">
                      {p.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-[#16834B] block">
                      {p.capacity_persons} Jiwa
                    </span>
                    <span className="text-[10px] text-[#66766C]">Kapasitas Maks</span>
                  </div>
                </div>

                <div className="text-xs text-[#25352D] space-y-1">
                  <p><strong>Alamat:</strong> {p.address}</p>
                  <p><strong>Kecamatan:</strong> {p.kecamatan}</p>
                  <p><strong>Tipe Gedung:</strong> {p.facility_type}</p>
                  <p><strong>Elevasi Lokasi:</strong> {p.elevation_m} mdpl</p>
                </div>

                {/* Available emergency equipment */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-[#66766C] block mb-1">Fasilitas Tersedia di Posko:</span>
                  <div className="flex flex-wrap gap-1">
                    {(p.facilities_available || []).map((f: string, fi: number) => (
                      <span key={fi} className="text-[10px] font-semibold bg-[#F4F7F5] border border-[#E3EAE5] px-2 py-0.5 rounded-full text-[#25352D]">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons with caution modal / external navigation */}
              <div className="pt-3 border-t border-[#E3EAE5] flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#66766C] truncate">
                  Koordinat: {lat.toFixed(4)}, {lon.toFixed(4)}
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn bg-[#16834B] hover:bg-[#0D653A] text-white px-3.5 py-1.5 text-xs font-bold shrink-0"
                >
                  <span>Petunjuk Arah</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
