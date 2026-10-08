import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  ArrowUpDown, 
  ChevronRight, 
  Waves, 
  Activity,
  Layers
} from 'lucide-react';

export const AreasPage: React.FC = () => {
  const { allKecamatan, setSelectedKecamatan } = useApp();
  const [search, setSearch] = useState('');
  const [hazardFilter, setHazardFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'population' | 'density'>('name');
  const navigate = useNavigate();

  const filtered = allKecamatan
    .filter(k => {
      const matchSearch = k.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchHazard = hazardFilter === 'all' || k.hazard_level.toLowerCase() === hazardFilter.toLowerCase();
      return matchSearch && matchHazard;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'population') return b.population_total - a.population_total;
      if (sortBy === 'density') return b.density_per_km2 - a.density_per_km2;
      return 0;
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3EAE5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
            Wilayah Administrasi & Kerentanan
          </h1>
          <p className="text-xs sm:text-sm text-[#66766C]">
            Data Resmi 27 Kecamatan di Kabupaten Aceh Utara (BPS & InaRISK BNPB)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#16834B] border border-[#B9DFC5]">
            Total: 27 Kecamatan
          </span>
        </div>
      </div>

      {/* Controls: Search, Filter, Sort */}
      <div className="card-farm p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#66766C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kecamatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-full pl-9 pr-4 py-2 text-xs md:text-sm outline-none focus:border-[#16834B] focus:bg-white transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F4F7F5] p-1 rounded-full border border-[#E3EAE5]">
            {['all', 'Tinggi', 'Sedang', 'Rendah'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setHazardFilter(lvl)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  hazardFilter === lvl 
                    ? 'bg-[#16834B] text-white' 
                    : 'text-[#66766C] hover:text-[#25352D]'
                }`}
              >
                {lvl === 'all' ? 'Semua' : lvl}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#F4F7F5] px-3 py-1.5 rounded-full border border-[#E3EAE5] text-xs font-bold text-[#66766C]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-[#25352D] font-bold"
            >
              <option value="name">Urut: Nama</option>
              <option value="population">Urut: Penduduk</option>
              <option value="density">Urut: Kepadatan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Subdistricts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((k) => (
          <div
            key={k.id}
            onClick={() => {
              setSelectedKecamatan(k);
              navigate(`/areas/${k.id}`);
            }}
            className="card-farm card-farm-hover p-5 flex flex-col justify-between cursor-pointer group space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-[#25352D] group-hover:text-[#16834B] transition">
                      {k.name}
                    </h3>
                    {k.is_capital && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#16834B] border border-[#B9DFC5]">
                        Ibukota
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#66766C]">ID Kecamatan: {k.id}</p>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                  k.hazard_level === 'Tinggi' ? 'bg-red-100 text-red-700 border border-red-200' :
                  k.hazard_level === 'Sedang' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  Bahaya {k.hazard_level}
                </span>
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-[#F4F7F5] p-2 rounded-xl">
                  <span className="text-[10px] text-[#66766C] block">Penduduk (BPS)</span>
                  <span className="font-bold text-[#25352D]">{k.population_total.toLocaleString()} jiwa</span>
                </div>
                <div className="bg-[#F4F7F5] p-2 rounded-xl">
                  <span className="text-[10px] text-[#66766C] block">Kepadatan</span>
                  <span className="font-bold text-[#25352D]">{k.density_per_km2} /km²</span>
                </div>
                <div className="bg-[#F4F7F5] p-2 rounded-xl">
                  <span className="text-[10px] text-[#66766C] block">Elevasi</span>
                  <span className="font-bold text-[#25352D]">{k.elevation_range}</span>
                </div>
                <div className="bg-[#F4F7F5] p-2 rounded-xl">
                  <span className="text-[10px] text-[#66766C] block">Luas Wilayah</span>
                  <span className="font-bold text-[#25352D]">{k.area_km2} km²</span>
                </div>
              </div>

              {/* Rivers */}
              <div className="mt-2.5 text-xs text-[#66766C] flex items-center gap-1.5 truncate">
                <Waves className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">Sungai: <strong className="text-[#25352D]">{k.primary_rivers.join(', ')}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3EAE5] flex items-center justify-between text-xs font-bold text-[#16834B]">
              <span>Buka Analisis Detail</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card-farm p-12 text-center space-y-2">
          <p className="font-bold text-[#25352D]">Tidak ditemukan kecamatan yang sesuai.</p>
          <p className="text-xs text-[#66766C]">Silakan ubah kata kunci pencarian atau filter kategori bahaya.</p>
        </div>
      )}
    </div>
  );
};
