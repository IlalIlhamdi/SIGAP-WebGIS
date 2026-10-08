import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudRain, 
  ChevronRight, 
  PhoneCall,
  Compass,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { HazardDistributionChart } from '../components/charts/HazardDistributionChart';
import { FloodEventsChart } from '../components/charts/FloodEventsChart';
import { FloodMap } from '../components/map/FloodMap';
import { WeatherWidget } from '../components/weather/WeatherWidget';
import type { FloodEvent } from '../types';

export const DashboardPage: React.FC = () => {
  const { allKecamatan, setSelectedKecamatan } = useApp();
  const [weather, setWeather] = useState<any>(null);
  const [floodEvents, setFloodEvents] = useState<FloodEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboardData() {
      const [w, events] = await Promise.all([
        dataService.getBMKGWeather(),
        dataService.getFloodEvents()
      ]);
      setWeather(w);
      setFloodEvents(events);
    }
    loadDashboardData();
  }, []);

  // Compute statistics from verified datasets
  const highHazardKec = allKecamatan.filter(k => k.hazard_level === 'Tinggi');
  const midHazardKec = allKecamatan.filter(k => k.hazard_level === 'Sedang');
  const lowHazardKec = allKecamatan.filter(k => k.hazard_level === 'Rendah');
  const totalPopulation = allKecamatan.reduce((acc, curr) => acc + curr.population_total, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Hero Welcome Card (Farm2Table Clean Green Style) */}
      <div className="card-farm bg-gradient-to-br from-[#16834B] to-[#0D653A] text-white p-6 sm:p-8 shadow-md border-0 relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-[#B9DFC5]">
            <Compass className="w-3.5 h-3.5" />
            <span>Kabupaten Aceh Utara • 27 Kecamatan</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pantau Risiko Banjir di Aceh Utara
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            Informasi geospasial terverifikasi untuk meningkatkan kesiapsiagaan masyarakat dan mendukung mitigasi kebencanaan.
          </p>

          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate('/map')}
              className="pill-btn bg-white text-[#0D653A] hover:bg-emerald-50 px-4 py-2 text-xs font-bold shadow-sm"
            >
              <span>Buka Peta Interaktif</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/reports/new')}
              className="pill-btn bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-xs font-bold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Laporkan Genangan Banjir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards (Farm2Table rounded pills & cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Bahaya Tinggi */}
        <div className="card-farm p-4 space-y-1 border-l-4 border-l-red-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Bahaya Tinggi</p>
          <p className="text-2xl sm:text-3xl font-black text-red-600">
            {highHazardKec.length}
          </p>
          <p className="text-[10px] text-[#66766C]">Kecamatan (Bantaran DAS)</p>
        </div>

        {/* Bahaya Sedang */}
        <div className="card-farm p-4 space-y-1 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Bahaya Sedang</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            {midHazardKec.length}
          </p>
          <p className="text-[10px] text-[#66766C]">Kecamatan (Pesisir & Dataran)</p>
        </div>

        {/* Bahaya Rendah */}
        <div className="card-farm p-4 space-y-1 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Bahaya Rendah</p>
          <p className="text-2xl sm:text-3xl font-black text-[#16834B]">
            {lowHazardKec.length}
          </p>
          <p className="text-[10px] text-[#66766C]">Kecamatan (Perbukitan Hulu)</p>
        </div>

        {/* Total Kejadian Tercatat */}
        <div className="card-farm p-4 space-y-1">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Kejadian Historis</p>
          <p className="text-2xl sm:text-3xl font-black text-[#25352D]">
            {floodEvents.length}
          </p>
          <p className="text-[10px] text-[#66766C]">Banjir Besar (BPBD 2019-2023)</p>
        </div>

        {/* Total Penduduk BPS */}
        <div className="card-farm p-4 space-y-1 col-span-2 lg:col-span-1">
          <p className="text-[11px] font-bold text-[#66766C] uppercase">Penduduk Terdata</p>
          <p className="text-2xl sm:text-3xl font-black text-[#0D653A]">
            {totalPopulation.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#66766C]">Jiwa (BPS Aceh Utara 2024)</p>
        </div>
      </div>

      {/* Weather Snapshot + Emergency Kontak Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* BMKG Weather Widget with Live Atmospheric Effects */}
        <WeatherWidget weatherData={weather} />

        {/* BPBD Emergency Contact Widget */}
        <div className="card-farm p-5 flex flex-col justify-between bg-emerald-50/40 border-[#B9DFC5] space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0D653A] font-extrabold text-sm">
              <PhoneCall className="w-4 h-4 text-[#16834B]" />
              <span>Pusdalops BPBD Aceh Utara</span>
            </div>
            <p className="text-xs text-[#66766C]">
              Layanan siaga tanggap darurat bencana banjir dan pos komando evakuasi 24 jam.
            </p>
            <div className="bg-white p-3 rounded-2xl border border-[#B9DFC5] space-y-1">
              <p className="text-[11px] text-[#66766C] font-semibold">Nomor Telepon Darurat:</p>
              <p className="text-base font-extrabold text-[#0D653A] tracking-wider">(0645) 31113 / 112</p>
              <p className="text-[10px] text-[#66766C]">Posko Induk: Kompleks Perkantoran Landing, Lhoksukon</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/education')}
            className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-2 text-xs font-bold"
          >
            Panduan Tas Siaga & Mitigasi →
          </button>
        </div>
      </div>

      {/* Interactive Map Preview Card */}
      <div className="card-farm p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3EAE5] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#25352D]">Peta Bahaya Banjir Kabupaten Aceh Utara</h3>
            <p className="text-xs text-[#66766C]">Visualisasi batas 27 kecamatan dan indeks bahaya resmi InaRISK BNPB</p>
          </div>
          <button
            onClick={() => navigate('/map')}
            className="pill-btn self-start sm:self-auto bg-[#16834B] hover:bg-[#0D653A] text-white px-3.5 py-1.5 text-xs font-bold"
          >
            Buka Peta Penuh
          </button>
        </div>

        <div className="h-96 w-full rounded-2xl overflow-hidden border border-[#E3EAE5]">
          <FloodMap heightClass="h-96" />
        </div>
      </div>

      {/* Analytics & Comparison Charts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#25352D]">Statistik & Analisis Wilayah</h3>
          <span className="text-xs text-[#66766C]">BPS Aceh Utara & BNPB InaRISK</span>
        </div>
        <HazardDistributionChart data={allKecamatan} />
        <FloodEventsChart events={floodEvents} />
      </div>

      {/* Top 5 High Vulnerability Subdistricts */}
      <div className="card-farm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2.5">
          <div>
            <h4 className="font-extrabold text-sm text-[#25352D]">Kecamatan Prioritas Ancaman Tinggi</h4>
            <p className="text-xs text-[#66766C]">Wilayah bantaran sungai dengan riwayat banjir berulang</p>
          </div>
          <button
            onClick={() => navigate('/areas')}
            className="text-xs font-bold text-[#16834B] hover:underline"
          >
            Lihat Semua 27 Wilayah →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {highHazardKec.slice(0, 4).map((k) => (
            <div
              key={k.id}
              onClick={() => {
                setSelectedKecamatan(k);
                navigate(`/areas/${k.id}`);
              }}
              className="p-3.5 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] hover:border-[#16834B] hover:bg-white transition cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#25352D] group-hover:text-[#16834B] transition">
                  {k.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Tinggi
                </span>
              </div>
              <div className="text-[11px] text-[#66766C] space-y-0.5">
                <p>Sungai: <strong>{k.primary_rivers.join(', ')}</strong></p>
                <p>Elevasi: {k.elevation_range}</p>
                <p>Penduduk: {k.population_total.toLocaleString()} jiwa</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
