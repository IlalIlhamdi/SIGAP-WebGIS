import React, { useState } from 'react';
import { 
  Activity, 
  Mountain, 
  TrendingUp, 
  CloudRain, 
  Waves, 
  Users, 
  Trees, 
  ShieldCheck, 
  AlertCircle,
  BarChart3,
  Layers,
  Info
} from 'lucide-react';
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

export const FactorAnalysisPage: React.FC = () => {
  const { allKecamatan } = useApp();
  const [selectedFactor, setSelectedFactor] = useState<'rainfall' | 'density' | 'elevation' | 'hazard_score'>('rainfall');

  const factorsMetadata = [
    {
      id: 'rainfall',
      name: 'Curah Hujan Tahunan',
      unit: 'mm / tahun',
      source: 'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)',
      year: 2023,
      category: 'Komponen Bahaya (Hazard)',
      icon: CloudRain,
      color: '#0284C7',
      description: 'Presipitasi rata-rata tahunan di wilayah Aceh Utara berkisar antara 1.820 mm (pesisir Dewantara) hingga >2.450 mm (hulu pegunungan Geuredong Pase & Paya Bakong). Hujan lebat berdurasi lama di hulu merupakan pemicu utama debit banjir kiriman ke wilayah hilir Lhoksukon dan Matangkuli.'
    },
    {
      id: 'elevation',
      name: 'Elevasi Rata-rata Wilayah',
      unit: 'mdpl (meter di atas permukaan laut)',
      source: 'Data Elevasi Nasional (DEMNAS) — BIG',
      year: 2022,
      category: 'Komponen Bahaya (Hazard)',
      icon: Mountain,
      color: '#D97706',
      description: 'Topografi Kabupaten Aceh Utara memiliki variasi tajam antara wilayah hilir pesisir (<10 mdpl) dan perbukitan hulu Bukit Barisan (>500 mdpl). Daerah bertopografi rendah seperti Matangkuli (6-15 mdpl) dan Lhoksukon (5-18 mdpl) menjadi cekungan penampungan air alami yang sulit mengalir ke laut saat pasang.'
    },
    {
      id: 'density',
      name: 'Kepadatan Penduduk',
      unit: 'jiwa / km²',
      source: 'Badan Pusat Statistik (BPS) Kabupaten Aceh Utara',
      year: 2024,
      category: 'Komponen Kerentanan & Paparan (Exposure)',
      icon: Users,
      color: '#9333EA',
      description: 'Menggambarkan tingkat konsentrasi populasi yang rentan terdampak banjir luapan. Kecamatan Dewantara memiliki kepadatan tertinggi (2.197 jiwa/km²), diikuti Samudera (882 jiwa/km²) dan Matangkuli (746 jiwa/km²), yang menuntut kesiapan kapasitas evakuasi lebih besar.'
    },
    {
      id: 'hazard_score',
      name: 'Indeks Bahaya Banjir InaRISK',
      unit: 'Skor Normalisasi (0 - 100)',
      source: 'BNPB InaRISK — Pemodelan Hidrologi Nasional',
      year: 2023,
      category: 'Indeks Resmi Nasional',
      icon: ShieldCheck,
      color: '#DC2626',
      description: 'Skor indeks bahaya banjir BNPB berbasis pemodelan debit banjir rancangan 25-tahunan, geomorfologi dataran banjir, serta histori kejadian. Matangkuli (skor 94) dan Pirak Timur (skor 92) mencatatkan indeks bahaya tertinggi di Kabupaten Aceh Utara.'
    }
  ];

  const currentMeta = factorsMetadata.find(f => f.id === selectedFactor)!;

  // Chart data sorted by current factor
  const chartData = [...allKecamatan]
    .map(k => {
      let val = 0;
      if (selectedFactor === 'rainfall') val = k.rainfall_annual_mm;
      else if (selectedFactor === 'density') val = k.density_per_km2;
      else if (selectedFactor === 'hazard_score') val = Math.round(k.hazard_score * 100);
      else if (selectedFactor === 'elevation') {
        const parts = k.elevation_range.match(/\d+/g);
        val = parts ? parseInt(parts[0], 10) : 10;
      }
      return {
        name: k.name,
        value: val,
        hazard: k.hazard_level,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#16834B]">
          <Activity className="w-4 h-4" />
          <span>Analisis Saintifik Multikriteria</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
          Analisis Faktor Risiko & Bahaya Banjir
        </h1>
        <p className="text-xs sm:text-sm text-[#66766C]">
          Karakteristik fisik, hidrologi, dan demografi resmi yang mempengaruhi dinamika banjir di Aceh Utara.
        </p>
      </div>

      {/* Scientific Distinction Alert (Bahaya vs Risiko) */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-[#B9DFC5] text-xs space-y-2">
        <div className="flex items-center gap-2 font-extrabold text-[#0D653A]">
          <Info className="w-4 h-4 text-[#16834B] shrink-0" />
          <span>Prinsip Metodologis: Peta Bahaya (Hazard) vs Peta Risiko (Risk)</span>
        </div>
        <p className="text-[#25352D] leading-relaxed">
          Sesuai Peraturan Kepala BNPB No. 02 Tahun 2012, <strong>Bahaya (Hazard)</strong> merefleksikan besaran dan probabilitas kejadian fisik banjir (debit air, genangan, elevasi, kemiringan lereng). Sedangkan <strong>Risiko (Risk)</strong> merupakan fungsi interaksi antara <em>Bahaya × Kerentanan ÷ Kapasitas</em>. SIGAP 1.0 menampilkan peta bahaya resmi dari InaRISK BNPB dan menyajikan indikator kerentanan sosial secara terpisah demi menjaga integritas data tanpa manipulasi bobot acak.
        </p>
      </div>

      {/* Factor Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {factorsMetadata.map((f) => {
          const Icon = f.icon;
          const isSelected = selectedFactor === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFactor(f.id as any)}
              className={`card-farm p-4 text-left transition-all space-y-2 ${
                isSelected 
                  ? 'border-2 border-[#16834B] shadow-sm bg-white' 
                  : 'hover:bg-[#F4F7F5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#66766C] px-2 py-0.5 rounded-full bg-[#F4F7F5]">
                  {f.year}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#25352D]">{f.name}</h4>
                <p className="text-[11px] text-[#66766C]">{f.unit}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Factor Detail & Chart */}
      <div className="card-farm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3EAE5] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16834B] block">
              {currentMeta.category}
            </span>
            <h3 className="text-lg font-extrabold text-[#25352D]">
              Perbandingan Nilai: {currentMeta.name}
            </h3>
            <p className="text-xs text-[#66766C]">Satuan: {currentMeta.unit} • Sumber: {currentMeta.source}</p>
          </div>
          <span className="text-xs font-bold text-[#66766C]">Top 12 Kecamatan</span>
        </div>

        {/* Scientific Context Description */}
        <div className="p-3.5 rounded-xl bg-[#F4F7F5] border border-[#E3EAE5] text-xs text-[#25352D] leading-relaxed">
          {currentMeta.description}
        </div>

        {/* Chart View */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3EAE5" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(val: any) => [`${val} ${currentMeta.unit}`, currentMeta.name]}
                contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#E3EAE5' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={currentMeta.color}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.hazard === 'Tinggi' ? '#DC2626' : entry.hazard === 'Sedang' ? '#F59E0B' : '#16834B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Factor Summary Table */}
      <div className="card-farm p-5 space-y-3">
        <h4 className="font-extrabold text-sm text-[#25352D]">Matriks Indikator Terverifikasi Antar-Kecamatan</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F7F5] text-[#66766C] font-bold uppercase text-[10px] border-b border-[#E3EAE5]">
              <tr>
                <th className="py-2.5 px-3">Kecamatan</th>
                <th className="py-2.5 px-3">Bahaya Banjir</th>
                <th className="py-2.5 px-3">Curah Hujan (mm)</th>
                <th className="py-2.5 px-3">Elevasi</th>
                <th className="py-2.5 px-3">Kemiringan</th>
                <th className="py-2.5 px-3">Penduduk</th>
                <th className="py-2.5 px-3">Kepadatan (/km²)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EAE5]">
              {allKecamatan.map((k) => (
                <tr key={k.id} className="hover:bg-[#F4F7F5]/50 transition">
                  <td className="py-2.5 px-3 font-bold text-[#25352D]">{k.name}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      k.hazard_level === 'Tinggi' ? 'bg-red-100 text-red-700' :
                      k.hazard_level === 'Sedang' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {k.hazard_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#25352D]">{k.rainfall_annual_mm}</td>
                  <td className="py-2.5 px-3 text-[#25352D]">{k.elevation_range}</td>
                  <td className="py-2.5 px-3 text-[#66766C]">{k.slope_class}</td>
                  <td className="py-2.5 px-3 font-medium text-[#25352D]">{k.population_total.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-[#66766C]">{k.density_per_km2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
