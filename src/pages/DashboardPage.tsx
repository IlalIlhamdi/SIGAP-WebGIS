import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  PhoneCall,
  Compass,
  FileText,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';
import { HazardDistributionChart } from '../components/charts/HazardDistributionChart';
import { FloodEventsChart } from '../components/charts/FloodEventsChart';
import { FloodMap } from '../components/map/FloodMap';
import { WeatherWidget } from '../components/weather/WeatherWidget';
import { 
  MetricCardSkeleton, 
  ChartSkeleton, 
  Skeleton 
} from '../components/common/Skeleton';
import { InlineRefreshIndicator } from '../components/common/InlineRefreshIndicator';
import type { FloodEvent } from '../types';

export const DashboardPage: React.FC = () => {
  const { 
    allKecamatan, 
    setSelectedKecamatan, 
    isLoading: indicatorsLoading,
    isRefreshing: indicatorsRefreshing,
    indicatorsError,
    refreshData
  } = useApp();

  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [floodEvents, setFloodEvents] = useState<FloodEvent[]>([]);
  const [floodEventsLoading, setFloodEventsLoading] = useState<boolean>(true);
  const [floodEventsError, setFloodEventsError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Load weather independently
  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const w = await dataService.getBMKGWeather();
      setWeather(w);
      setWeatherError(null);
    } catch (err: any) {
      console.warn("Weather load error:", err);
      setWeatherError(err?.message || "Tidak dapat memuat data BMKG saat ini.");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // Load flood history events independently
  const loadFloodEvents = useCallback(async () => {
    setFloodEventsLoading(true);
    setFloodEventsError(null);
    try {
      const events = await dataService.getFloodEvents();
      setFloodEvents(events);
      setFloodEventsError(null);
    } catch (err: any) {
      console.warn("Flood events load error:", err);
      setFloodEventsError(err?.message || "Gagal memuat catatan historis banjir BPBD.");
    } finally {
      setFloodEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
    loadFloodEvents();
  }, [loadWeather, loadFloodEvents]);

  // Compute stats safely from verified subdistricts
  const isKecamatanPending = indicatorsLoading && allKecamatan.length === 0;
  const highHazardKec = allKecamatan.filter(k => k.hazard_level === 'Tinggi');
  const midHazardKec = allKecamatan.filter(k => k.hazard_level === 'Sedang');
  const lowHazardKec = allKecamatan.filter(k => k.hazard_level === 'Rendah');
  const totalPopulation = allKecamatan.reduce((acc, curr) => acc + curr.population_total, 0);

  return (
    <div className="p-3 min-[360px]:p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Background refresh notice */}
      <InlineRefreshIndicator isRefreshing={indicatorsRefreshing} />

      {/* Hero Welcome Card (Always visible immediately) */}
      <div className="card-farm bg-gradient-to-br from-[#16834B] to-[#0D653A] text-white p-4 sm:p-5 md:p-6 shadow-md border-0 relative overflow-hidden select-none">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-[#B9DFC5]">
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Kabupaten Aceh Utara • 27 Kecamatan</span>
          </div>

          <h1 className="text-[1.375rem] sm:text-[1.75rem] leading-[1.25] font-extrabold tracking-tight">
            Pantau Risiko Banjir di Aceh Utara
          </h1>
          <p className="text-sm sm:text-base leading-[1.5] text-emerald-100 font-medium">
            Informasi geospasial terverifikasi untuk meningkatkan kesiapsiagaan masyarakat dan mendukung mitigasi kebencanaan.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/map')}
              className="pill-btn min-h-[48px] w-full sm:w-auto bg-white text-[#0D653A] hover:bg-emerald-50 px-4 py-2.5 text-sm font-bold shadow-sm justify-center active:scale-[0.98] transition-all"
            >
              <span className="leading-tight break-words text-center sm:text-left">Buka Peta Interaktif</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/reports/new')}
              className="pill-btn min-h-[48px] w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 text-sm font-bold justify-center active:scale-[0.98] transition-all"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="leading-tight break-words text-center sm:text-left">Laporkan Genangan Banjir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Notice for Indicators if failed */}
      {indicatorsError && allKecamatan.length === 0 && (
        <div 
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{indicatorsError}</span>
          </div>
          <button
            onClick={() => refreshData()}
            className="px-3 py-1 rounded-lg bg-white border border-red-300 font-bold text-red-700 hover:bg-red-50 flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Metric Cards (1 column < 360px, 2 columns mobile, 5 on desktop) */}
      <div 
        aria-busy={isKecamatanPending || floodEventsLoading}
        className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        {/* Bahaya Tinggi */}
        {isKecamatanPending ? (
          <MetricCardSkeleton borderLeftColor="border-l-red-500" />
        ) : (
          <div className="card-farm p-3.5 sm:p-4 space-y-1 border-l-4 border-l-red-500">
            <p className="text-xs font-bold text-[#66766C] uppercase tracking-wide">Bahaya Tinggi</p>
            <p className="text-2xl sm:text-3xl font-black text-red-600">
              {highHazardKec.length}
            </p>
            <p className="text-xs text-[#66766C] leading-snug break-words">Kecamatan (Bantaran DAS)</p>
          </div>
        )}

        {/* Bahaya Sedang */}
        {isKecamatanPending ? (
          <MetricCardSkeleton borderLeftColor="border-l-amber-500" />
        ) : (
          <div className="card-farm p-3.5 sm:p-4 space-y-1 border-l-4 border-l-amber-500">
            <p className="text-xs font-bold text-[#66766C] uppercase tracking-wide">Bahaya Sedang</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">
              {midHazardKec.length}
            </p>
            <p className="text-xs text-[#66766C] leading-snug break-words">Kecamatan (Pesisir & Dataran)</p>
          </div>
        )}

        {/* Bahaya Rendah */}
        {isKecamatanPending ? (
          <MetricCardSkeleton borderLeftColor="border-l-emerald-500" />
        ) : (
          <div className="card-farm p-3.5 sm:p-4 space-y-1 border-l-4 border-l-emerald-500">
            <p className="text-xs font-bold text-[#66766C] uppercase tracking-wide">Bahaya Rendah</p>
            <p className="text-2xl sm:text-3xl font-black text-[#16834B]">
              {lowHazardKec.length}
            </p>
            <p className="text-xs text-[#66766C] leading-snug break-words">Kecamatan (Perbukitan Hulu)</p>
          </div>
        )}

        {/* Total Kejadian Tercatat (Independent of indicators) */}
        {floodEventsLoading ? (
          <MetricCardSkeleton borderLeftColor="border-l-slate-400" />
        ) : (
          <div className="card-farm p-3.5 sm:p-4 space-y-1 border-l-4 border-l-slate-400">
            <p className="text-xs font-bold text-[#66766C] uppercase tracking-wide">Kejadian Historis</p>
            <p className="text-2xl sm:text-3xl font-black text-[#25352D]">
              {floodEventsError ? '—' : floodEvents.length}
            </p>
            <p className="text-xs text-[#66766C] leading-snug break-words">Banjir Besar (BPBD 2019-2023)</p>
          </div>
        )}

        {/* Total Penduduk BPS (Full width on 2-col mobile, 1 col on desktop) */}
        {isKecamatanPending ? (
          <MetricCardSkeleton borderLeftColor="border-l-[#16834B]" className="col-span-1 min-[360px]:col-span-2 lg:col-span-1" />
        ) : (
          <div className="card-farm p-3.5 sm:p-4 space-y-1 col-span-1 min-[360px]:col-span-2 lg:col-span-1 border-l-4 border-l-[#16834B]">
            <p className="text-xs font-bold text-[#66766C] uppercase tracking-wide">Penduduk Terdata</p>
            <p className="text-2xl sm:text-3xl font-black text-[#0D653A]">
              {totalPopulation.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-[#66766C] leading-snug break-words">Jiwa (BPS Aceh Utara 2024)</p>
          </div>
        )}
      </div>

      {/* Weather Snapshot + Emergency Kontak Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* BMKG Weather Widget with independent loading and error */}
        <div className="lg:col-span-2 min-w-0">
          <WeatherWidget 
            weatherData={weather} 
            isLoading={weatherLoading}
            error={weatherError}
            onRetry={loadWeather}
          />
        </div>

        {/* BPBD Emergency Contact Widget (Always visible immediately) */}
        <div className="card-farm p-4 sm:p-5 flex flex-col justify-between bg-emerald-50/40 border-[#B9DFC5] space-y-3 lg:col-span-1 min-w-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0D653A] font-extrabold text-sm sm:text-base">
              <PhoneCall className="w-4 h-4 text-[#16834B] shrink-0" />
              <span>Pusdalops BPBD Aceh Utara</span>
            </div>
            <p className="text-xs sm:text-sm text-[#66766C] leading-relaxed">
              Layanan siaga tanggap darurat bencana banjir dan pos komando evakuasi 24 jam.
            </p>
            <div className="bg-white p-3 rounded-2xl border border-[#B9DFC5] space-y-1">
              <p className="text-xs text-[#66766C] font-semibold">Nomor Telepon Darurat:</p>
              <p className="text-base sm:text-lg font-extrabold text-[#0D653A] tracking-wider">(0645) 31113 / 112</p>
              <p className="text-xs text-[#66766C]">Posko Induk: Kompleks Perkantoran Landing, Lhoksukon</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/education')}
            className="pill-btn min-h-[48px] w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-2.5 px-4 text-xs sm:text-sm font-bold cursor-pointer justify-center active:scale-[0.98] transition-all"
          >
            Panduan Tas Siaga & Mitigasi →
          </button>
        </div>
      </div>

      {/* Interactive Map Preview Card */}
      <div className="card-farm p-4 sm:p-5 space-y-3 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3EAE5] pb-3">
          <div className="min-w-0">
            <h3 className="font-extrabold text-base text-[#25352D]">Peta Bahaya Banjir Kabupaten Aceh Utara</h3>
            <p className="text-xs text-[#66766C]">Visualisasi batas 27 kecamatan dan indeks bahaya resmi InaRISK BNPB</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="pill-btn min-h-[40px] self-start sm:self-auto bg-[#16834B] hover:bg-[#0D653A] text-white px-4 py-2 text-xs font-bold cursor-pointer shrink-0 justify-center active:scale-[0.98] transition-all"
          >
            Buka Peta Penuh
          </button>
        </div>

        <div className="h-72 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden border border-[#E3EAE5]">
          <FloodMap heightClass="h-72 sm:h-80 md:h-96" />
        </div>
      </div>

      {/* Analytics & Comparison Charts */}
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="font-extrabold text-base text-[#25352D]">Statistik & Analisis Wilayah</h3>
          <span className="text-xs text-[#66766C]">BPS Aceh Utara & BNPB InaRISK</span>
        </div>

        {/* Hazard Distribution Chart Skeleton / Actual */}
        {isKecamatanPending ? (
          <ChartSkeleton />
        ) : (
          <HazardDistributionChart data={allKecamatan} />
        )}

        {floodEventsError && (
          <div role="alert" className="card-farm p-4 text-sm text-red-700">
            <p>{floodEventsError}</p>
            <button type="button" onClick={loadFloodEvents} disabled={floodEventsLoading} className="min-h-[48px] font-semibold">Coba lagi</button>
          </div>
        )}
        {/* Flood Events Chart Skeleton / Actual */}
        {floodEventsLoading ? (
          <ChartSkeleton />
        ) : (
          !floodEventsError && <FloodEventsChart events={floodEvents} />
        )}
      </div>

      {/* Top 5 High Vulnerability Subdistricts */}
      <div className="card-farm p-4 sm:p-5 space-y-3 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E3EAE5] pb-2.5">
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm text-[#25352D]">Kecamatan Prioritas Ancaman Tinggi</h4>
            <p className="text-xs text-[#66766C]">Wilayah bantaran sungai dengan riwayat banjir berulang</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/areas')}
            className="text-xs font-bold text-[#16834B] hover:underline cursor-pointer self-start sm:self-auto shrink-0 py-1"
          >
            Lihat Semua 27 Wilayah →
          </button>
        </div>

        {isKecamatanPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 sm:p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <div className="space-y-1.5 pt-1">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                  <Skeleton className="h-3.5 w-3/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {highHazardKec.slice(0, 4).map((k) => (
              <div
                key={k.id}
                onClick={() => {
                  setSelectedKecamatan(k);
                  navigate(`/areas/${k.id}`);
                }}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] hover:border-[#16834B] hover:bg-white transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-sm text-[#25352D] group-hover:text-[#16834B] transition truncate">
                    {k.name}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 shrink-0">
                    Tinggi
                  </span>
                </div>
                <div className="text-xs text-[#66766C] space-y-1">
                  <p className="leading-snug">Sungai: <strong className="text-[#25352D]">{k.primary_rivers.join(', ')}</strong></p>
                  <p className="leading-snug">Elevasi: {k.elevation_range}</p>
                  <p className="leading-snug">Penduduk: {k.population_total.toLocaleString('id-ID')} jiwa</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
