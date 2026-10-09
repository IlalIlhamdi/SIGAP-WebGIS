import React, { useState } from 'react';
import { 
  CloudRain, 
  CloudLightning, 
  Cloud, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  Compass, 
  CheckCircle2, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { WeatherWidgetSkeleton } from '../common/Skeleton';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface WeatherWidgetProps {
  weatherData?: any;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  lastUpdated?: string;
}

export type WeatherMode = 'hujan_sedang' | 'hujan_lebat' | 'hujan_petir' | 'hujan_ringan' | 'berawan';

interface WeatherPreset {
  id: WeatherMode;
  name: string;
  icon: any;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainfall: number; // mm/jam
  floodAlert: 'Normal' | 'Waspada' | 'Siaga' | 'Awas';
  alertDesc: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  dropCount: number;
  hasLightning: boolean;
}

const PRESETS: Record<WeatherMode, WeatherPreset> = {
  hujan_sedang: {
    id: 'hujan_sedang',
    name: 'Hujan Sedang',
    icon: CloudRain,
    temp: 26,
    humidity: 88,
    windSpeed: 14,
    rainfall: 38,
    floodAlert: 'Waspada',
    alertDesc: 'Potensi kenaikan debit di DAS Krueng Pase & Keureuto. Waspadai genangan di dataran rendah.',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-800',
    badgeText: 'Waspada DAS',
    gradient: 'from-[#0F3826] via-[#124E33] to-[#0A301E]',
    dropCount: 35,
    hasLightning: false,
  },
  hujan_lebat: {
    id: 'hujan_lebat',
    name: 'Hujan Lebat',
    icon: CloudRain,
    temp: 24,
    humidity: 94,
    windSpeed: 22,
    rainfall: 58,
    floodAlert: 'Siaga',
    alertDesc: 'Curah hujan tinggi (>50 mm/jam). Siaga luapan tanggul Krueng Keureuto Kec. Matangkuli & Pirak Timu.',
    badgeBg: 'bg-orange-100 border-orange-300 text-orange-800',
    badgeText: 'Siaga Luapan Banjir',
    gradient: 'from-[#0B2E24] via-[#0E3D30] to-[#07211A]',
    dropCount: 65,
    hasLightning: false,
  },
  hujan_petir: {
    id: 'hujan_petir',
    name: 'Hujan Petir & Badai',
    icon: CloudLightning,
    temp: 23,
    humidity: 96,
    windSpeed: 34,
    rainfall: 78,
    floodAlert: 'Awas',
    alertDesc: 'Cuaca ekstrem! Peringatan banjir bandang dan limpasan DAS Krueng Pirak. Siapkan rute evakuasi.',
    badgeBg: 'bg-red-100 border-red-300 text-red-800',
    badgeText: 'Awas Banjir Ekstrem',
    gradient: 'from-[#071F1A] via-[#0B2C24] to-[#041411]',
    dropCount: 80,
    hasLightning: true,
  },
  hujan_ringan: {
    id: 'hujan_ringan',
    name: 'Hujan Ringan',
    icon: CloudRain,
    temp: 28,
    humidity: 80,
    windSpeed: 10,
    rainfall: 15,
    floodAlert: 'Normal',
    alertDesc: 'Kondisi drainase stabil. Aliran sungai Krueng Keureuto terpantau di bawah ambang batas.',
    badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    badgeText: 'Debit Sungai Terkendali',
    gradient: 'from-[#124B31] via-[#18603F] to-[#0D3823]',
    dropCount: 18,
    hasLightning: false,
  },
  berawan: {
    id: 'berawan',
    name: 'Berawan Tebal',
    icon: Cloud,
    temp: 31,
    humidity: 72,
    windSpeed: 12,
    rainfall: 0,
    floodAlert: 'Normal',
    alertDesc: 'Cuaca relatif kondusif. Risiko luapan sungai sangat rendah.',
    badgeBg: 'bg-sky-100 border-sky-300 text-sky-800',
    badgeText: 'Kondusif',
    gradient: 'from-[#19563E] via-[#216B4D] to-[#12422F]',
    dropCount: 0,
    hasLightning: false,
  },
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  weatherData,
  isLoading = false,
  error = null,
  onRetry,
  lastUpdated
}) => {
  const [selectedMode, setSelectedMode] = useState<WeatherMode>('hujan_sedang');
  const [isSimulatorActive, setIsSimulatorActive] = useState<boolean>(false);

  // If loading and no existing data, show layout-accurate skeleton
  if (isLoading && !weatherData && !isSimulatorActive) {
    return <WeatherWidgetSkeleton />;
  }

  // If error and no data available
  if (error && !weatherData && !isSimulatorActive) {
    return (
      <div 
        role="alert"
        className="card-farm md:col-span-2 p-6 border-red-200 bg-red-50/50 flex flex-col items-center justify-center text-center space-y-3 min-h-[280px]"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-red-900">Gagal Memuat Data Cuaca BMKG</h4>
          <p className="text-xs text-red-700 max-w-sm">{error}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-red-700 font-bold text-xs border border-red-300 flex items-center gap-2 active:scale-95 transition shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        )}
      </div>
    );
  }

  // Determine active weather object: Real BMKG response vs explicitly chosen simulation preset
  const isUsingRealData = !isSimulatorActive && !!weatherData?.data?.cuaca?.length;
  const realItem = isUsingRealData ? weatherData.data.cuaca[0] : null;

  if (!isSimulatorActive && !isUsingRealData) {
    return <div className="card-farm md:col-span-2 p-5" role="status">Prakiraan cuaca belum tersedia.</div>;
  }

  const getVisualConfig = (desc: string) => {
    const lower = desc.toLowerCase();
    if (lower.includes('petir') || lower.includes('badai')) {
      return {
        icon: CloudLightning,
        gradient: 'from-[#071F1A] via-[#0B2C24] to-[#041411]',
        dropCount: 65,
        hasLightning: true,
      };
    }
    if (lower.includes('lebat')) {
      return {
        icon: CloudRain,
        gradient: 'from-[#0B2E24] via-[#0E3D30] to-[#07211A]',
        dropCount: 55,
        hasLightning: false,
      };
    }
    if (lower.includes('hujan')) {
      return {
        icon: CloudRain,
        gradient: 'from-[#0F3826] via-[#124E33] to-[#0A301E]',
        dropCount: 30,
        hasLightning: false,
      };
    }
    return {
      icon: Cloud,
      gradient: 'from-[#19563E] via-[#216B4D] to-[#12422F]',
      dropCount: 0,
      hasLightning: false,
    };
  };

  const current = isUsingRealData
    ? {
        name: realItem.weather_desc || 'Berawan',
        temp: realItem.t ?? '—',
        humidity: realItem.hu ?? '—',
        windSpeed: realItem.ws ?? '—',
        rainfallNote: 'Prakiraan BMKG',
        badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
        badgeText: 'Prakiraan BMKG',
        alertDesc: 'Prakiraan cuaca BMKG untuk wilayah ini. Informasi ini bukan pengukuran debit sungai atau peringatan banjir resmi.',
        alertStatus: 'Prakiraan',
        ...getVisualConfig(realItem.weather_desc || ''),
      }
    : {
        name: PRESETS[selectedMode].name,
        temp: PRESETS[selectedMode].temp,
        humidity: PRESETS[selectedMode].humidity,
        windSpeed: PRESETS[selectedMode].windSpeed,
        rainfallNote: `Simulasi (${PRESETS[selectedMode].rainfall} mm/jam)`,
        badgeBg: 'bg-amber-100 border-amber-300 text-amber-800',
        badgeText: 'Simulasi Hipotetis',
        alertDesc: `[Skenario Simulasi] ${PRESETS[selectedMode].alertDesc}`,
        alertStatus: PRESETS[selectedMode].floodAlert,
        icon: PRESETS[selectedMode].icon,
        gradient: PRESETS[selectedMode].gradient,
        dropCount: PRESETS[selectedMode].dropCount,
        hasLightning: PRESETS[selectedMode].hasLightning,
      };

  // Raindrops calculation
  const rainDrops = Array.from({ length: current.dropCount }).map((_, i) => ({
    id: i,
    left: `${(i * 100) / (current.dropCount || 1) + ((i * 17) % 7)}%`,
    duration: `${0.4 + ((i * 3) % 5) * 0.1}s`,
    delay: `${((i * 7) % 10) * 0.08}s`,
    height: `${12 + ((i * 5) % 15)}px`,
    opacity: 0.3 + ((i * 4) % 6) * 0.1,
  }));

  // Periods: Map real normalized timeline from BMKG if actual, else compute from preset
  const periods = isUsingRealData
    ? weatherData.data.cuaca.slice(0, 4).map((c: any, idx: number) => ({
        label: idx === 0 ? 'Saat Ini' : c.datetime ? String(c.datetime).split('T')[1]?.slice(0, 5) || c.datetime : `Prakiraan ${idx + 1}`,
        time: c.datetime ? String(c.datetime).replace('T', ' ').slice(0, 16) : 'WIB',
        temp: c.t ?? '—',
        hu: c.hu ?? '—',
        desc: c.weather_desc || 'Berawan',
      }))
    : [
        { label: 'Pagi', temp: current.temp - 1, hu: current.humidity + 2, desc: current.name, time: '07:00 WIB' },
        { label: 'Siang', temp: current.temp + 4, hu: Math.max(40, current.humidity - 10), desc: selectedMode === 'hujan_petir' ? 'Hujan Petir' : 'Hujan Sedang', time: '13:00 WIB' },
        { label: 'Malam', temp: current.temp, hu: current.humidity, desc: current.name, time: '19:00 WIB' },
        { label: 'Dini Hari', temp: current.temp - 2, hu: Math.min(99, current.humidity + 4), desc: 'Hujan Ringan', time: '01:00 WIB' },
      ];

  return (
    <div className="card-farm md:col-span-2 overflow-hidden border border-[#B9DFC5] shadow-md bg-white">
      {/* HEADER: Title & Status Banner */}
      <div className="p-4 sm:p-5 border-b border-[#E3EAE5] flex flex-wrap items-center justify-between gap-2 bg-[#F9FAF9]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <CloudRain className="w-5 h-5 text-sky-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-extrabold text-sm sm:text-base text-[#111827]">Prakiraan Cuaca</h3>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${current.badgeBg}`}>
                {isUsingRealData ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                {current.badgeText}
              </span>
            </div>
            <p className="text-xs text-[#64748B] truncate">
              {isUsingRealData 
                ? (weatherData?.source || 'Stasiun Meteorologi Malikussaleh / Lhoksukon, Kab. Aceh Utara')
                : 'Skenario Hipotetis Pengujian LKTI (Bukan Data Aktual BMKG)'}
            </p>
          </div>
        </div>

        {/* Weather Simulator Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {isSimulatorActive ? (
            <button
              type="button"
              onClick={() => setIsSimulatorActive(false)}
              className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
            >
              ← Kembali ke Data Aktual BMKG
            </button>
          ) : (
            <span className="text-xs font-bold text-[#64748B] mr-1 hidden sm:inline">Uji Skenario:</span>
          )}
          {(['hujan_sedang', 'hujan_lebat', 'hujan_petir', 'hujan_ringan', 'berawan'] as WeatherMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setSelectedMode(mode);
                setIsSimulatorActive(true);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedMode === mode && isSimulatorActive
                  ? 'bg-[#0D653A] text-white shadow-xs font-bold'
                  : 'bg-white text-[#475569] border border-[#CBD5E1] hover:border-[#0D653A]'
              }`}
            >
              {PRESETS[mode].name}
            </button>
          ))}
        </div>
      </div>

      {/* ATMOSPHERIC VISUAL EFFECT CANVAS & HERO SNAPSHOT */}
      <div className={`relative bg-gradient-to-br ${current.gradient} text-white p-5 sm:p-6 overflow-hidden select-none transition-colors duration-500`}>
        {/* Animated Rain Streaks Layer */}
        {current.dropCount > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {rainDrops.map((drop) => (
              <div
                key={drop.id}
                className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-200 to-white rounded-full animate-rain-drop"
                style={{
                  left: drop.left,
                  top: '-20px',
                  height: drop.height,
                  opacity: drop.opacity,
                  animationDuration: drop.duration,
                  animationDelay: drop.delay,
                  animationIterationCount: 'infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* Animated Lightning Flash Layer (in Thunderstorm mode) */}
        {current.hasLightning && (
          <div className="absolute inset-0 bg-cyan-100 pointer-events-none z-0 animate-lightning-flash" />
        )}

        {/* Soft Background Drifting Clouds */}
        <div className="absolute -top-10 -right-10 w-72 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none animate-cloud-drift" />
        <div className="absolute -bottom-10 -left-10 w-80 h-44 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none animate-cloud-drift" />

        {/* HERO CONTENT: Temperature, Weather Condition & Live Metrics */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 min-w-0">
          {/* Left: Big Temp & Condition Name */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
              <current.icon className="w-8 h-8 sm:w-11 sm:h-11 text-cyan-200 drop-shadow-md animate-pulse" />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
                  {current.temp}°C
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border shadow-xs ${current.badgeBg}`}>
                  {current.badgeText}
                </span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-white/95 truncate">
                {current.name} • Aceh Utara
              </p>
              <p className="text-xs text-cyan-100/90 font-medium">
                Indikator: <span className="font-bold text-white">{current.rainfallNote}</span>
              </p>
            </div>
          </div>

          {/* Right: Key Weather Indicators Grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 bg-black/20 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-white/15">
            <div className="text-center px-1 sm:px-2 min-w-0">
              <div className="flex items-center justify-center gap-1 text-xs text-cyan-200 font-semibold mb-0.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-300 shrink-0" /> <span className="truncate">Lembab</span>
              </div>
              <p className="text-base sm:text-lg font-black text-white">{current.humidity}%</p>
              <p className="text-xs text-white/80">Kelembaban</p>
            </div>

            <div className="text-center px-1 sm:px-2 border-x border-white/15 min-w-0">
              <div className="flex items-center justify-center gap-1 text-xs text-cyan-200 font-semibold mb-0.5">
                <Wind className="w-3.5 h-3.5 text-cyan-300 shrink-0" /> <span className="truncate">Angin</span>
              </div>
              <p className="text-base sm:text-lg font-black text-white">{current.windSpeed}</p>
              <p className="text-xs text-white/80">km/jam</p>
            </div>

            <div className="text-center px-1 sm:px-2 min-w-0">
              <div className="flex items-center justify-center gap-1 text-xs text-cyan-200 font-semibold mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" /> <span className="truncate">Status</span>
              </div>
              <p className={`text-xs sm:text-base font-black truncate ${
                current.alertStatus === 'Awas' ? 'text-red-300' :
                current.alertStatus === 'Siaga' ? 'text-orange-300' :
                current.alertStatus === 'Waspada' ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                {current.alertStatus}
              </p>
              <p className="text-xs text-white/80">{isUsingRealData ? 'Cuaca' : 'Simulasi'}</p>
            </div>
          </div>
        </div>

        {/* Flood / Weather Alert Note Box */}
        <div className="relative z-10 mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-start gap-2.5 text-xs text-white/95">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-extrabold text-amber-200 mr-1.5">
              {isUsingRealData ? 'Catatan Meteorologi:' : 'Skenario Uji Coba:'}
            </span>
            {current.alertDesc}
          </div>
        </div>
      </div>

      {/* FORECAST TIMELINE CARDS */}
      <div className="p-4 sm:p-5 bg-white space-y-3 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-[#475569]">
          <span>{isUsingRealData ? 'Prakiraan Waktu Berkala (BMKG)' : 'Prakiraan Skenario Berkala'}</span>
          <span className="text-xs text-[#0D653A]">
            {isUsingRealData ? (weatherData?.source || 'API BMKG Indonesia') : 'Mode Simulasi Hipotetis'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {periods.map((item: any, i: number) => (
            <div 
              key={i} 
              className="bg-[#F8FAF9] p-3 rounded-2xl text-center space-y-1 border border-[#E2E8F0] hover:border-[#16834B]/40 transition-all hover:bg-emerald-50/30"
            >
              <div className="flex items-center justify-between text-xs text-[#64748B] font-bold">
                <span>{item.label}</span>
                <span className="text-xs font-medium text-[#94A3B8]">{item.time}</span>
              </div>
              <p className="text-xl font-black text-[#0D653A] pt-0.5">
                {item.temp}°C
              </p>
              <p className="text-xs font-bold text-[#1E293B] truncate">
                {item.desc}
              </p>
              <p className="text-xs text-[#64748B]">
                Kelembaban: <span className="font-semibold text-[#0D653A]">{item.hu}%</span>
              </p>
            </div>
          ))}
        </div>

        {/* Official BMKG Citation Footer */}
        <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2">
          <p className="italic">
            {isUsingRealData
              ? `* Atribusi: Prakiraan cuaca bersumber resmi dari ${weatherData?.source || 'API BMKG'}.${lastUpdated ? ` Terakhir disinkronkan: ${lastUpdated}.` : ''}`
              : '* Perhatian: Mode simulasi pengujian interaktif aktif. Nilai di atas adalah skenario hipotetis dan bukan data riil.'}
          </p>
          <div className="flex items-center gap-1 text-[#0D653A] font-bold">
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Kabupaten Aceh Utara</span>
          </div>
        </div>
      </div>
    </div>
  );
};
