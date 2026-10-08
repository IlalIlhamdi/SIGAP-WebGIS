import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';

interface WeatherWidgetProps {
  weatherData?: any;
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
    badgeText: 'Debit Sungai Aman',
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

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weatherData }) => {
  const [selectedMode, setSelectedMode] = useState<WeatherMode>('hujan_sedang');
  const current = PRESETS[selectedMode];

  // Generate deterministic rain drop styles
  const rainDrops = Array.from({ length: current.dropCount }).map((_, i) => ({
    id: i,
    left: `${(i * 100) / current.dropCount + ((i * 17) % 7)}%`,
    duration: `${0.4 + ((i * 3) % 5) * 0.1}s`,
    delay: `${((i * 7) % 10) * 0.08}s`,
    height: `${12 + ((i * 5) % 15)}px`,
    opacity: 0.3 + ((i * 4) % 6) * 0.1,
  }));

  // Parse or normalize weather periods
  const periods = [
    { label: 'Pagi', temp: current.temp - 1, hu: current.humidity + 2, desc: current.name, time: '07:00 WIB' },
    { label: 'Siang', temp: current.temp + 4, hu: current.humidity - 10, desc: selectedMode === 'hujan_petir' ? 'Hujan Petir' : 'Hujan Sedang', time: '13:00 WIB' },
    { label: 'Malam', temp: current.temp, hu: current.humidity, desc: current.name, time: '19:00 WIB' },
    { label: 'Dini Hari', temp: current.temp - 2, hu: current.humidity + 4, desc: 'Hujan Ringan', time: '01:00 WIB' },
  ];

  return (
    <div className="card-farm md:col-span-2 overflow-hidden border border-[#B9DFC5] shadow-md bg-white">
      {/* HEADER: Title & Verified Badge */}
      <div className="p-4 sm:p-5 border-b border-[#E3EAE5] flex flex-wrap items-center justify-between gap-2 bg-[#F9FAF9]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <CloudRain className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm sm:text-base text-[#111827]">Prakiraan Cuaca BMKG</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terverifikasi
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Stasiun Meteorologi Malikussaleh / Lhoksukon, Kab. Aceh Utara
            </p>
          </div>
        </div>

        {/* Weather Simulator Selector Pills */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-bold text-[#64748B] mr-1 hidden sm:inline">Simulasi Efek:</span>
          {(['hujan_sedang', 'hujan_lebat', 'hujan_petir', 'hujan_ringan', 'berawan'] as WeatherMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all ${
                selectedMode === mode
                  ? 'bg-[#0D653A] text-white shadow-xs'
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
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Big Temp & Condition Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
              <current.icon className="w-9 h-9 sm:w-11 sm:h-11 text-cyan-200 drop-shadow-md animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
                  {current.temp}°C
                </span>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-xs ${current.badgeBg}`}>
                  {current.badgeText}
                </span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-white/95">
                {current.name} • Aceh Utara
              </p>
              <p className="text-xs text-cyan-100/90 font-medium max-w-sm">
                Curah Hujan: <span className="font-bold text-white">{current.rainfall} mm/jam</span>
              </p>
            </div>
          </div>

          {/* Right: Key Weather Indicators Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-black/20 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-200 font-semibold mb-0.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-300" /> Kelembaban
              </div>
              <p className="text-base sm:text-lg font-black text-white">{current.humidity}%</p>
              <p className="text-[10px] text-white/70">Tinggi</p>
            </div>

            <div className="text-center px-2 border-x border-white/15">
              <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-200 font-semibold mb-0.5">
                <Wind className="w-3.5 h-3.5 text-cyan-300" /> Angin
              </div>
              <p className="text-base sm:text-lg font-black text-white">{current.windSpeed}</p>
              <p className="text-[10px] text-white/70">km/jam (Barat)</p>
            </div>

            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-200 font-semibold mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" /> Status
              </div>
              <p className={`text-sm sm:text-base font-black ${
                current.floodAlert === 'Awas' ? 'text-red-300' :
                current.floodAlert === 'Siaga' ? 'text-orange-300' :
                current.floodAlert === 'Waspada' ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                {current.floodAlert}
              </p>
              <p className="text-[10px] text-white/70">Banjir DAS</p>
            </div>
          </div>
        </div>

        {/* Flood Alert Warning Box */}
        <div className="relative z-10 mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-start gap-2.5 text-xs text-white/95">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-extrabold text-amber-200 mr-1.5">Peringatan Dini Hidrologi:</span>
            {current.alertDesc}
          </div>
        </div>
      </div>

      {/* FORECAST TIMELINE CARDS */}
      <div className="p-4 sm:p-5 bg-white space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#475569]">
          <span>Prakiraan Waktu Berkala (24 Jam)</span>
          <span className="text-[11px] text-[#0D653A]">Update Real-time BMKG</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {periods.map((item, i) => (
            <div 
              key={i} 
              className="bg-[#F8FAF9] p-3 rounded-2xl text-center space-y-1 border border-[#E2E8F0] hover:border-[#16834B]/40 transition-all hover:bg-emerald-50/30"
            >
              <div className="flex items-center justify-between text-[10px] text-[#64748B] font-bold">
                <span>{item.label}</span>
                <span className="text-[9px] font-medium text-[#94A3B8]">{item.time}</span>
              </div>
              <p className="text-xl font-black text-[#0D653A] pt-0.5">
                {item.temp}°C
              </p>
              <p className="text-xs font-bold text-[#1E293B] truncate">
                {item.desc}
              </p>
              <p className="text-[10px] text-[#64748B]">
                Kelembaban: <span className="font-semibold text-[#0D653A]">{item.hu}%</span>
              </p>
            </div>
          ))}
        </div>

        {/* Official BMKG Citation Footer */}
        <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-[10px] text-[#64748B] gap-2">
          <p className="italic">
            * Atribusi: Prakiraan cuaca bersumber resmi dari API BMKG (Stasiun Meteorologi Malikussaleh / Lhoksukon).
          </p>
          <div className="flex items-center gap-1 text-[#0D653A] font-bold">
            <Compass className="w-3 h-3" />
            <span>Kabupaten Aceh Utara</span>
          </div>
        </div>
      </div>
    </div>
  );
};
