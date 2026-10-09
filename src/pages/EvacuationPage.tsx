import React, { useEffect, useState, useCallback } from 'react';
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
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { FloodMap } from '../components/map/FloodMap';
import { ListCardSkeleton, Skeleton } from '../components/common/Skeleton';
import { InlineRefreshIndicator } from '../components/common/InlineRefreshIndicator';
import type { EvacuationPoint } from '../types';

export const EvacuationPage: React.FC = () => {
  const [points, setPoints] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvac = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const geo = await dataService.getEvacuationPointsGeoJSON();
      if (geo?.features) {
        setPoints(geo.features);
        setError(null);
      } else {
        setPoints([]);
      }
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Gagal memuat data titik evakuasi.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvac();
  }, [loadEvac]);

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

  const isPending = loading && points.length === 0;
  const totalCapacity = points.reduce((acc, curr) => acc + (curr.properties.capacity_persons || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
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

        <div className="flex items-center gap-2 shrink-0">
          <InlineRefreshIndicator isRefreshing={isRefreshing} />
          <button
            type="button"
            onClick={() => loadEvac(true)}
            disabled={isRefreshing || loading}
            aria-label="Segarkan data posko evakuasi"
            className="pill-btn bg-white hover:bg-slate-50 text-[#0D653A] border border-[#B9DFC5] px-3.5 py-2 text-xs font-bold shadow-xs touch-target-48 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Memperbarui…' : 'Segarkan'}</span>
          </button>
        </div>
      </div>

      {/* Safety Warning Alert (LKTI requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-extrabold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Peringatan Keamanan Jalur Navigasi Saat Banjir:</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          Rute perjalanan menuju titik evakuasi harus selalu dikonfirmasi dengan arahan petugas BPBD atau Posko Siaga Gampong setempat. Layanan GPS atau peta navigasi umum tidak memperhitungkan kedalaman arus air dan titik genangan yang menenggelamkan ruas jalan utama. <strong>Jangan memaksakan melintasi genangan air deras.</strong>
        </p>
      </div>

      {/* Overview Stats: With Skeleton to avoid flashing '0' */}
      <div 
        aria-busy={isPending}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="card-farm p-4 space-y-1 border-l-4 border-l-[#16834B]">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Titik Terverifikasi BPBD</p>
          {isPending ? (
            <Skeleton className="h-8 w-24 rounded-lg my-1" />
          ) : (
            <p className="text-2xl font-black text-[#0D653A]">{points.length} Posko</p>
          )}
          <p className="text-[10px] text-[#66766C]">Tersebar di Wilayah Rawan</p>
        </div>

        <div className="card-farm p-4 space-y-1 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Total Daya Tampung</p>
          {isPending ? (
            <Skeleton className="h-8 w-28 rounded-lg my-1" />
          ) : (
            <p className="text-2xl font-black text-emerald-700">{totalCapacity.toLocaleString('id-ID')} Jiwa</p>
          )}
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
        <FloodMap heightClass="h-80" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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
              type="button"
              onClick={() => setSelectedFacilityFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
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

      {/* Error state with retry */}
      {error && (
        <div 
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadEvac(false)}
            className="px-3 py-1.5 rounded-xl bg-white border border-red-300 font-bold text-red-700 hover:bg-red-50 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Evacuation Points Cards: Skeletons vs Real Content vs Empty State */}
      <div 
        aria-busy={loading}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {isPending ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <ListCardSkeleton key={idx} />
          ))
        ) : !loading && filteredPoints.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-[#E3EAE5] space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-extrabold text-sm text-[#25352D]">Tidak Ditemukan Titik Evakuasi</h4>
            <p className="text-xs text-[#66766C]">
              Tidak ada data titik evakuasi yang sesuai dengan kriteria pencarian "{search}".
            </p>
          </div>
        ) : (
          filteredPoints.map((item, idx) => {
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
                    <span className="text-xs font-bold text-emerald-800 bg-[#E8F5E9] px-2.5 py-1 rounded-full whitespace-nowrap">
                      Kapasitas: {p.capacity_persons} Jiwa
                    </span>
                  </div>

                  <div className="text-xs text-[#66766C] space-y-1">
                    <p><strong className="text-[#25352D]">Kecamatan:</strong> {p.kecamatan}</p>
                    <p><strong className="text-[#25352D]">Alamat:</strong> {p.address}</p>
                    <p><strong className="text-[#25352D]">Elevasi:</strong> {p.elevation_m} mdpl (Bebas Genangan)</p>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-[#66766C] block uppercase mb-1">
                      Fasilitas Darurat Tersedia:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(p.facilities_available || []).map((f: string, fi: number) => (
                        <span key={fi} className="text-[10px] font-semibold bg-[#F4F7F5] text-[#25352D] px-2 py-0.5 rounded-md border border-[#E3EAE5]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E3EAE5] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#66766C]">Sumber: {p.source}</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-btn bg-[#16834B] hover:bg-[#0D653A] text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1 shrink-0 touch-target-48"
                  >
                    <span>Petunjuk Rute</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
