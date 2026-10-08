import React, { useState } from 'react';
import { Users, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export const PopulationPage: React.FC = () => {
  const { allKecamatan } = useApp();
  const [filterHazard, setFilterHazard] = useState('all');

  const totalPop = allKecamatan.reduce((acc, curr) => acc + curr.population_total, 0);
  const highHazardPop = allKecamatan.filter(k => k.hazard_level === 'Tinggi').reduce((acc, curr) => acc + curr.population_total, 0);
  const midHazardPop = allKecamatan.filter(k => k.hazard_level === 'Sedang').reduce((acc, curr) => acc + curr.population_total, 0);
  const lowHazardPop = allKecamatan.filter(k => k.hazard_level === 'Rendah').reduce((acc, curr) => acc + curr.population_total, 0);

  const chartData = [...allKecamatan]
    .filter(k => filterHazard === 'all' || k.hazard_level === filterHazard)
    .sort((a, b) => b.population_total - a.population_total)
    .slice(0, 10)
    .map(k => ({
      name: k.name,
      population: k.population_total,
      density: k.density_per_km2,
      hazard: k.hazard_level,
      color: k.hazard_level === 'Tinggi' ? '#DC2626' : k.hazard_level === 'Sedang' ? '#F59E0B' : '#16834B'
    }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
          <Users className="w-4 h-4 text-purple-600" />
          <span>Statistik Demografi Resmi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
          Data Penduduk & Potensi Paparan Banjir
        </h1>
        <p className="text-xs sm:text-sm text-[#66766C]">
          Sumber Resmi: Badan Pusat Statistik (BPS) Kabupaten Aceh Utara "Kabupaten Aceh Utara Dalam Angka 2024".
        </p>
      </div>

      {/* Scientific Distinction Banner (Mandatory LKTI requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-extrabold text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Distingsi Konseptual Data Kependudukan:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-amber-950">
          <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
            <strong>1. Penduduk Total Administratif</strong>
            <p className="text-[11px] text-amber-800">Jumlah seluruh jiwa yang tercatat resmi berdomisili di kecamatan tersebut (BPS).</p>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
            <strong>2. Penduduk Berpotensi Terpapar</strong>
            <p className="text-[11px] text-amber-800">Jiwa yang bermukim di dalam zona bahaya banjir (InaRISK), yang sewaktu-waktu dapat tergenang.</p>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
            <strong>3. Penduduk Terdampak Aktual</strong>
            <p className="text-[11px] text-amber-800">Jiwa yang diverifikasi mengungsi atau mengalami kerusakan rumah pada suatu tanggal kejadian tertentu (BPBD).</p>
          </div>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-farm p-4 space-y-1 border-l-4 border-l-[#16834B]">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Total Penduduk Kab.</p>
          <p className="text-2xl font-black text-[#0D653A]">{totalPop.toLocaleString()}</p>
          <p className="text-[10px] text-[#66766C]">Jiwa (27 Kecamatan BPS 2024)</p>
        </div>

        <div className="card-farm p-4 space-y-1 border-l-4 border-l-red-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Zona Bahaya Tinggi</p>
          <p className="text-2xl font-black text-red-600">{highHazardPop.toLocaleString()}</p>
          <p className="text-[10px] text-[#66766C]">Jiwa ({((highHazardPop / totalPop) * 100).toFixed(1)}% Total)</p>
        </div>

        <div className="card-farm p-4 space-y-1 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Zona Bahaya Sedang</p>
          <p className="text-2xl font-black text-amber-600">{midHazardPop.toLocaleString()}</p>
          <p className="text-[10px] text-[#66766C]">Jiwa ({((midHazardPop / totalPop) * 100).toFixed(1)}% Total)</p>
        </div>

        <div className="card-farm p-4 space-y-1 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Zona Bahaya Rendah</p>
          <p className="text-2xl font-black text-emerald-700">{lowHazardPop.toLocaleString()}</p>
          <p className="text-[10px] text-[#66766C]">Jiwa ({((lowHazardPop / totalPop) * 100).toFixed(1)}% Total)</p>
        </div>
      </div>

      {/* Top Population Chart */}
      <div className="card-farm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3EAE5] pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-[#25352D]">Kecamatan Terpadat Penduduk di Aceh Utara</h3>
            <p className="text-xs text-[#66766C]">10 Kecamatan dengan Populasi Terbanyak</p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F4F7F5] p-1 rounded-full border border-[#E3EAE5]">
            {['all', 'Tinggi', 'Sedang', 'Rendah'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterHazard(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  filterHazard === cat ? 'bg-[#16834B] text-white' : 'text-[#66766C] hover:text-[#25352D]'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3EAE5" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}rb`} />
              <Tooltip
                formatter={(val: any) => [`${Number(val).toLocaleString()} Jiwa`, 'Populasi']}
                contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#E3EAE5' }}
              />
              <Bar dataKey="population" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`pop-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
