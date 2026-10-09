import React, { useEffect, useState, useCallback } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Activity, 
  Hospital, 
  Shield, 
  Layers,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { FloodMap } from '../components/map/FloodMap';
import { ListCardSkeleton } from '../components/common/Skeleton';
import { InlineRefreshIndicator } from '../components/common/InlineRefreshIndicator';

export const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFacilities = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const geo = await dataService.getFacilitiesGeoJSON();
      if (geo?.features) {
        setFacilities(geo.features);
        setError(null);
      } else {
        setFacilities([]);
      }
    } catch (err: any) {
      console.error("Error loading facilities:", err);
      setError(err?.message || "Gagal memuat data fasilitas umum.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  const filtered = facilities.filter(f => {
    const p = f.properties;
    const matchSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());

    const matchCat = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Infrastruktur Layanan Publik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
            Informasi Fasilitas Umum & Kesehatan
          </h1>
          <p className="text-xs sm:text-sm text-[#66766C]">
            Puskesmas rawat inap 24 jam, Rumah Sakit Umum Daerah, Posko Tanggap Bencana BPBD, dan kantor keamanan di Kabupaten Aceh Utara.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <InlineRefreshIndicator isRefreshing={isRefreshing} />
          <button
            type="button"
            onClick={() => loadFacilities(true)}
            disabled={isRefreshing || loading}
            aria-label="Segarkan data fasilitas"
            className="pill-btn bg-white hover:bg-slate-50 text-[#0D653A] border border-[#B9DFC5] px-3.5 py-2 text-xs font-bold shadow-xs touch-target-48 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Memperbarui…' : 'Segarkan'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Preview */}
      <div className="card-farm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm text-[#25352D] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#16834B]" />
            <span>Sebaran Geospasial Fasilitas Publik</span>
          </span>
          <span className="text-xs font-semibold text-[#66766C]">
            {loading ? 'Memuat...' : `${facilities.length} Titik Terdata`}
          </span>
        </div>
        <FloodMap heightClass="h-72" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#66766C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari fasilitas, kecamatan, atau gampong..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-full pl-9 pr-4 py-2 text-xs md:text-sm outline-none focus:border-[#16834B] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#66766C] shrink-0">Kategori:</span>
          {['all', 'Puskesmas', 'Rumah Sakit', 'Pusat Tanggap Bencana', 'Keamanan', 'Pemerintahan'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#16834B] text-white shadow-xs'
                  : 'bg-[#F4F7F5] text-[#25352D] hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
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
            onClick={() => loadFacilities(false)}
            className="px-3 py-1.5 rounded-xl bg-white border border-red-300 font-bold text-red-700 hover:bg-red-50 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Facilities Cards Grid: Skeletons vs Real Content vs Empty State */}
      <div 
        aria-busy={loading}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {loading && facilities.length === 0 ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <ListCardSkeleton key={idx} />
          ))
        ) : !loading && filtered.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-[#E3EAE5] space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-extrabold text-sm text-[#25352D]">Tidak Ditemukan Fasilitas</h4>
            <p className="text-xs text-[#66766C]">
              Tidak ada data yang sesuai dengan kata kunci "{search}" atau filter yang dipilih.
            </p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const p = item.properties;
            const [lon, lat] = item.geometry.coordinates;

            return (
              <div key={idx} className="card-farm card-farm-hover p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.category === 'Rumah Sakit' ? 'bg-red-50 text-red-700 border border-red-200' :
                      p.category === 'Puskesmas' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      p.category === 'Pusat Tanggap Bencana' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {p.category}
                    </span>

                    {p.status_operasional && (
                      <span className="text-[10px] font-semibold text-[#0D653A] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                        {p.status_operasional}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-[#25352D] leading-snug">
                    {p.name}
                  </h3>

                  <div className="text-xs text-[#66766C] space-y-1">
                    <p><strong className="text-[#25352D]">Alamat:</strong> {p.address}</p>
                    <p><strong className="text-[#25352D]">Kecamatan:</strong> {p.kecamatan}</p>
                    <p><strong className="text-[#25352D]">Pengelola:</strong> {p.operator || 'Pemerintah Kab. Aceh Utara'}</p>
                    {p.phone && p.phone !== '-' && (
                      <a
                        href={`tel:${p.phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full mt-1.5 transition touch-target-48"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#16834B]" />
                        <span>Telepon: {p.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E3EAE5] flex items-center justify-between gap-2">
                  <span className="text-[10px] text-[#66766C] truncate">Sumber: {p.source}</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-btn bg-[#16834B] hover:bg-[#0D653A] text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1 shrink-0 touch-target-48"
                  >
                    <span>Navigasi</span>
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
