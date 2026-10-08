import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import type { KecamatanIndicator } from '../../types';

interface HazardDistributionChartProps {
  data: KecamatanIndicator[];
}

export const HazardDistributionChart: React.FC<HazardDistributionChartProps> = ({ data }) => {
  const tinggiCount = data.filter(k => k.hazard_level === 'Tinggi').length;
  const sedangCount = data.filter(k => k.hazard_level === 'Sedang').length;
  const rendahCount = data.filter(k => k.hazard_level === 'Rendah').length;

  const pieData = [
    { name: 'Bahaya Tinggi', value: tinggiCount, color: '#DC2626' },
    { name: 'Bahaya Sedang', value: sedangCount, color: '#F59E0B' },
    { name: 'Bahaya Rendah', value: rendahCount, color: '#16834B' },
  ];

  // Top 8 highest hazard score kecamatan
  const topHazardList = [...data]
    .sort((a, b) => b.hazard_score - a.hazard_score)
    .slice(0, 8)
    .map(k => ({
      name: k.name,
      score: Math.round(k.hazard_score * 100),
      hazard: k.hazard_level,
      color: k.hazard_level === 'Tinggi' ? '#DC2626' : k.hazard_level === 'Sedang' ? '#F59E0B' : '#16834B'
    }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Pie summary */}
      <div className="card-farm p-4 flex flex-col items-center justify-center">
        <h4 className="text-xs font-bold text-[#66766C] uppercase mb-2">Proporsi Kategori Bahaya</h4>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val: any) => [`${val} Kecamatan`, 'Jumlah']} 
                contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#E3EAE5' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 text-xs font-bold mt-1">
          <span className="text-red-600">● {tinggiCount} Tinggi</span>
          <span className="text-amber-600">● {sedangCount} Sedang</span>
          <span className="text-emerald-600">● {rendahCount} Rendah</span>
        </div>
      </div>

      {/* Bar ranking */}
      <div className="card-farm p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-[#66766C] uppercase">Skor Indeks Bahaya Banjir (InaRISK 0-100)</h4>
          <span className="text-[10px] text-[#66766C]">8 Kecamatan Tertinggi</span>
        </div>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHazardList} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E3EAE5" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={85} tick={{ fontSize: 11, fontWeight: 600 }} />
              <Tooltip 
                formatter={(val: any) => [`${val}/100`, 'Indeks Bahaya']} 
                contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#E3EAE5' }}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                {topHazardList.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
