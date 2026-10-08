import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Bell, 
  Menu, 
  X,
  Compass,
  AlertTriangle,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenLocationCheck?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLocationCheck }) => {
  const { allKecamatan, setSelectedKecamatan, role, setRole, isSimulationMode, setIsSimulationMode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filteredKecamatan = searchQuery.trim()
    ? allKecamatan.filter(k => k.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    : [];

  const handleSelectKecamatan = (k: any) => {
    setSelectedKecamatan(k);
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/areas/${k.id}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3EAE5] px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="flex lg:hidden items-center gap-2">
            <img src="/logo.svg" alt="SIGAP Logo" className="w-8 h-8 rounded-xl object-contain shadow-xs" />
            <span className="font-extrabold text-lg text-[#0D653A] tracking-tight">SIGAP</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#66766C]">
            <span className="text-[#16834B] flex items-center gap-1 font-bold">
              <Compass className="w-3.5 h-3.5" /> Kabupaten Aceh Utara
            </span>
            <span>/</span>
            <span>Provinsi Aceh</span>
          </div>
        </div>

        {/* Center: Search Bar with Autocomplete */}
        <div className="relative flex-1 max-w-md mx-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#66766C] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kecamatan (cth: Lhoksukon, Matangkuli)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-[#F4F7F5] border border-[#E3EAE5] focus:border-[#16834B] focus:bg-white text-xs md:text-sm text-[#25352D] rounded-full pl-9 pr-4 py-2 outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#66766C] hover:text-[#25352D] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && filteredKecamatan.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E3EAE5] rounded-2xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
              <div className="p-2 text-[11px] font-bold text-[#66766C] uppercase bg-[#F4F7F5] border-b border-[#E3EAE5]">
                Ditemukan {filteredKecamatan.length} Kecamatan
              </div>
              {filteredKecamatan.map((k) => (
                <button
                  key={k.id}
                  onClick={() => handleSelectKecamatan(k)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F4F7F5] flex items-center justify-between border-b border-[#E3EAE5]/50 last:border-0 transition"
                >
                  <div>
                    <p className="text-xs font-bold text-[#25352D]">{k.name}</p>
                    <p className="text-[11px] text-[#66766C]">Elevasi: {k.elevation_range} • {k.density_per_km2} jiwa/km²</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    k.hazard_level === 'Tinggi' ? 'bg-red-100 text-red-700' :
                    k.hazard_level === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    Bahaya {k.hazard_level}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Periksa Lokasi Saya Button (Farm2Table Pill) */}
          {onOpenLocationCheck && (
            <button
              onClick={onOpenLocationCheck}
              className="pill-btn bg-[#16834B] hover:bg-[#0D653A] text-white text-xs md:text-sm px-3.5 py-2 shadow-sm shadow-[#16834B]/20"
            >
              <MapPin className="w-4 h-4 text-[#B9DFC5]" />
              <span className="hidden sm:inline">Periksa Lokasi Saya</span>
              <span className="sm:hidden">GPS</span>
            </button>
          )}

          {/* LKTI Simulation Mode Toggle */}
          <button
            onClick={() => setIsSimulationMode(!isSimulationMode)}
            title="Toggle Mode Simulasi LKTI"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              isSimulationMode 
                ? 'bg-amber-100 text-amber-800 border-amber-300' 
                : 'bg-[#F4F7F5] text-[#66766C] border-[#E3EAE5] hover:bg-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSimulationMode ? 'bg-amber-500 animate-ping' : 'bg-slate-400'}`}></span>
            <span>{isSimulationMode ? 'Mode Simulasi Aktif' : 'Data Asli'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
