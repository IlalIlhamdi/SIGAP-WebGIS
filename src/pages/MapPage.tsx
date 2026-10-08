import React, { useState } from 'react';
import { FloodMap } from '../components/map/FloodMap';
import { useApp } from '../context/AppContext';
import { 
  Filter, 
  MapPin, 
  Layers, 
  Compass, 
  Info, 
  Search, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MapPage: React.FC = () => {
  const { allKecamatan, selectedKecamatan, setSelectedKecamatan, layers, toggleLayer } = useApp();
  const [filterHazard, setFilterHazard] = useState<string>('all');
  const navigate = useNavigate();

  const filteredKecamatan = allKecamatan.filter(k => {
    if (filterHazard === 'all') return true;
    return k.hazard_level.toLowerCase() === filterHazard.toLowerCase();
  });

  return (
    <div className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto space-y-4 pb-12">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-[#E3EAE5] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#66766C] flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter Bahaya:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: 'Semua (27)' },
              { id: 'tinggi', label: 'Tinggi (5)', color: 'text-red-700 bg-red-50 hover:bg-red-100' },
              { id: 'sedang', label: 'Sedang (14)', color: 'text-amber-700 bg-amber-50 hover:bg-amber-100' },
              { id: 'rendah', label: 'Rendah (8)', color: 'text-green-700 bg-green-50 hover:bg-green-100' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterHazard(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  filterHazard === f.id
                    ? 'bg-[#16834B] text-white shadow-xs'
                    : f.color || 'bg-[#F4F7F5] text-[#25352D] hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#66766C]">
          <span className="font-semibold text-[#0D653A]">CRS: EPSG:4326 (WGS 84)</span>
          <span>•</span>
          <span>Sumber: InaRISK BNPB 2023</span>
        </div>
      </div>

      {/* Main Map View & Legend */}
      <div className="w-full">
        <FloodMap heightClass="h-[60vh] sm:h-[66vh] min-h-[460px]" />
      </div>
    </div>
  );
};
