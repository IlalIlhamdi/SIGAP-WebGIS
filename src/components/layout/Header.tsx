import React, { useState, useRef, useEffect } from 'react';
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
import { registerBackButtonHandler } from '../../lib/native/back-button';

interface HeaderProps {
  onOpenLocationCheck?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLocationCheck }) => {
  const { allKecamatan, setSelectedKecamatan, role, setRole, isSimulationMode, setIsSimulationMode } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredKecamatan = searchQuery.trim()
    ? allKecamatan.filter(k => k.name.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    : [];

  const handleSelectKecamatan = (k: any) => {
    setSelectedKecamatan(k);
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedIndex(-1);
    navigate(`/areas/${k.id}`);
  };

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Android back button to close active search results
  useEffect(() => {
    if (showSearchResults && searchQuery.trim()) {
      return registerBackButtonHandler(() => {
        setShowSearchResults(false);
        return true;
      }, 5);
    }
  }, [showSearchResults, searchQuery]);

  // Handle keyboard navigation in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchResults) {
      if (e.key === 'ArrowDown' && filteredKecamatan.length > 0) {
        setShowSearchResults(true);
        setSelectedIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredKecamatan.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev <= 0 ? filteredKecamatan.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredKecamatan.length) {
        handleSelectKecamatan(filteredKecamatan[selectedIndex]);
      } else if (filteredKecamatan.length > 0) {
        handleSelectKecamatan(filteredKecamatan[0]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSearchResults(false);
      inputRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3EAE5] px-3 min-[360px]:px-4 lg:px-8 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-2.5 sm:pb-3">
      <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-2 sm:gap-x-4 max-w-7xl mx-auto">
        {/* Row 1 Left (or Left on Desktop): Brand & Breadcrumbs */}
        <div className="flex items-center gap-2.5 min-w-0 order-1">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/logo.svg" alt="SIGAP Logo" className="w-8 h-8 rounded-xl object-contain shadow-xs shrink-0" />
            <span className="font-extrabold text-lg text-[#0D653A] tracking-tight shrink-0">SIGAP</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#66766C] min-w-0">
            <span className="text-[#16834B] flex items-center gap-1 font-bold shrink-0">
              <Compass className="w-3.5 h-3.5 shrink-0" /> Kabupaten Aceh Utara
            </span>
            <span>/</span>
            <span className="truncate">Provinsi Aceh</span>
          </div>
        </div>

        {/* Row 1 Right (or Right on Desktop): GPS Action & Toggles */}
        <div className="flex items-center gap-2 order-2 sm:order-3 shrink-0">
          {/* Periksa Lokasi Saya Button (Area sentuh minimal 48 x 48 px) */}
          {onOpenLocationCheck && (
            <button
              onClick={onOpenLocationCheck}
              type="button"
              aria-label="Periksa Lokasi Saya via GPS"
              className="min-w-[48px] min-h-[48px] px-3.5 py-2.5 rounded-full bg-[#16834B] hover:bg-[#0D653A] active:scale-95 text-white text-xs md:text-sm font-bold shadow-sm shadow-[#16834B]/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <MapPin className="w-4 h-4 text-[#B9DFC5] shrink-0" />
              <span className="hidden sm:inline">Periksa Lokasi</span>
              <span className="sm:hidden font-semibold">GPS</span>
            </button>
          )}

          {/* LKTI Simulation Mode Toggle */}
          <button
            onClick={() => setIsSimulationMode(!isSimulationMode)}
            type="button"
            title="Toggle Mode Simulasi LKTI"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 min-h-[48px] rounded-full text-xs font-bold border transition ${
              isSimulationMode 
                ? 'bg-amber-100 text-amber-800 border-amber-300' 
                : 'bg-[#F4F7F5] text-[#66766C] border-[#E3EAE5] hover:bg-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSimulationMode ? 'bg-amber-500 animate-ping' : 'bg-slate-400'}`}></span>
            <span>{isSimulationMode ? 'Mode Simulasi' : 'Data Asli'}</span>
          </button>
        </div>

        {/* Search Bar: Full width row 2 on mobile (order-3), middle on desktop (order-2) */}
        <div ref={searchContainerRef} className="relative w-full sm:w-auto sm:flex-1 sm:max-w-md min-w-0 order-3 sm:order-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#66766C] absolute left-3.5 pointer-events-none shrink-0" />
            <input
              ref={inputRef}
              type="text"
              id="header-search-input"
              aria-label="Cari kecamatan di Kabupaten Aceh Utara"
              placeholder="Cari kecamatan (cth: Lhoksukon, Matangkuli)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowSearchResults(true)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[44px] bg-[#F4F7F5] border border-[#E3EAE5] focus:border-[#16834B] focus:bg-white text-xs md:text-sm text-[#25352D] rounded-full pl-9 pr-10 py-2 outline-none transition"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndex(-1);
                  inputRef.current?.focus();
                }}
                className="absolute right-1 w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#66766C] hover:text-[#25352D] text-sm font-bold rounded-full hover:bg-black/5 active:scale-95 transition"
                aria-label="Hapus kata kunci pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E3EAE5] rounded-2xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
              {filteredKecamatan.length > 0 ? (
                <>
                  <div className="p-2 text-xs font-bold text-[#66766C] uppercase bg-[#F4F7F5] border-b border-[#E3EAE5]">
                    Ditemukan {filteredKecamatan.length} Kecamatan
                  </div>
                  {filteredKecamatan.map((k, idx) => (
                    <button
                      key={k.id}
                      onClick={() => handleSelectKecamatan(k)}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-[#E3EAE5]/50 last:border-0 transition ${
                        selectedIndex === idx ? 'bg-[#E8F5E9] text-[#0D653A]' : 'hover:bg-[#F4F7F5]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-[#25352D]">{k.name}</p>
                        <p className="text-xs text-[#66766C] truncate">Elevasi: {k.elevation_range} • {k.density_per_km2} jiwa/km²</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        k.hazard_level === 'Tinggi' ? 'bg-red-100 text-red-700' :
                        k.hazard_level === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        Bahaya {k.hazard_level}
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-bold text-slate-700">Kecamatan tidak ditemukan</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tidak ada kecamatan yang cocok dengan "{searchQuery}".
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
