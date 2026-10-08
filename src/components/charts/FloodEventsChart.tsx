import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { FloodEvent } from '../../types';

interface FloodEventsChartProps {
  events: FloodEvent[];
}

export const FloodEventsChart: React.FC<FloodEventsChartProps> = ({ events }) => {
  const chartData = [...events]
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .map(e => ({
      date: e.event_date.slice(0, 7), // YYYY-MM
      title: e.title,
      people: e.affected_people,
      evacuees: e.evacuees_count,
      districts: e.affected_kecamatan_count
    }));

  return (
    <div className="card-farm p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h4 className="text-sm font-extrabold text-[#25352D]">Grafik Riwayat Kejadian Banjir Besar</h4>
          <p className="text-xs text-[#66766C]">Jumlah Jiwa Terdampak Menurut Catatan Resmi BPBD & DIBI BNPB</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#16834B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16834B]"></span> Jiwa Terdampak
          </span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pengungsi
          </span>
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3EAE5" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}rb`} />
            <Tooltip
              formatter={(value: any, name: any) => [
                `${Number(value).toLocaleString()} jiwa`,
                name === 'people' ? 'Terdampak' : 'Pengungsi'
              ]}
              labelFormatter={(label) => `Periode: ${label}`}
              contentStyle={{ borderRadius: '12px', fontSize: '11px', borderColor: '#E3EAE5' }}
            />
            <Bar dataKey="people" fill="#16834B" radius={[6, 6, 0, 0]} name="people" />
            <Bar dataKey="evacuees" fill="#F59E0B" radius={[6, 6, 0, 0]} name="evacuees" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
