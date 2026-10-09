import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Map, 
  LayoutGrid, 
  ArrowRight, 
  Waves, 
  MapPin, 
  FileText
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F5F2] flex justify-center py-0 sm:py-6 selection:bg-[#B9DFC5] selection:text-[#0D653A]">
      {/* Mobile-optimized Container matching the user's reference mockup */}
      <div className="w-full max-w-[440px] sm:max-w-[450px] min-h-screen sm:min-h-0 sm:rounded-3xl bg-white shadow-2xl border-x sm:border border-[#E2EAE4] flex flex-col justify-between relative overflow-hidden">

        {/* TOP SECTION: Scenic Lush Landscape (Sky, mountains, meadows, river) */}
        <div className="relative w-full overflow-hidden select-none bg-[#D8EEDE]">
          <img 
            src="/images/landing-landscape.webp" 
            alt="Lanskap Alam Aceh Utara & Krueng Keureuto" 
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* MIDDLE SECTION: Title, Subtitle, 2x2 Feature Cards & Action Buttons */}
        <div className="px-5 sm:px-6 pt-1 pb-4 relative z-10 text-center flex-1 flex flex-col items-center justify-center">
          
          {/* Main Brand Wordmark: Glossy Emerald SIGAP with Leaf inside 'A' */}
          <div className="mb-1.5">
            <img 
              src="/images/sigap-title-clean.webp" 
              alt="SIGAP" 
              className="h-12 sm:h-14 w-auto object-contain mx-auto"
            />
          </div>

          {/* Subtitle & Tagline */}
          <h1 className="text-sm sm:text-base font-extrabold text-[#111827] tracking-tight leading-snug">
            Sistem Informasi Geospasial Ancaman Banjir
          </h1>
          <p className="text-xs sm:text-[13px] text-[#4B5563] italic font-medium mt-0.5 mb-4">
            “Kenali Risiko, Siapkan Mitigasi.”
          </p>

          {/* 2x2 Feature Cards Grid with Watermark Art */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full mb-4 text-left">
            {/* Card 1: 27 Kecamatan */}
            <div 
              onClick={() => navigate('/areas')}
              className="group relative bg-white border border-[#E5EBE6] rounded-2xl p-3.5 shadow-xs hover:shadow-md hover:border-[#16834B]/50 transition-all cursor-pointer overflow-hidden active:scale-98"
            >
              {/* Translucent Map Pin Watermark on right */}
              <svg 
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-14 h-14 text-emerald-900/[0.06] pointer-events-none group-hover:scale-105 transition-transform" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>

              <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center mb-2">
                <Map className="w-4 h-4" />
              </div>
              <p className="font-extrabold text-xs sm:text-sm text-[#111827] leading-tight">27 Kecamatan</p>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight mt-0.5">Batas Asli InaRISK</p>
            </div>

            {/* Card 2: DAS & Sungai */}
            <div 
              onClick={() => navigate('/rivers')}
              className="group relative bg-white border border-[#E5EBE6] rounded-2xl p-3.5 shadow-xs hover:shadow-md hover:border-[#0284C7]/50 transition-all cursor-pointer overflow-hidden active:scale-98"
            >
              {/* Translucent River Wave Watermark on right */}
              <svg 
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-16 h-10 text-sky-900/[0.08] pointer-events-none group-hover:scale-105 transition-transform" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              >
                <path d="M2 9c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
                <path d="M2 15c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />
              </svg>

              <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-2">
                <Waves className="w-4 h-4" />
              </div>
              <p className="font-extrabold text-xs sm:text-sm text-[#111827] leading-tight">DAS & Sungai</p>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight mt-0.5">Krueng Keureuto & Pase</p>
            </div>

            {/* Card 3: Periksa GPS */}
            <div 
              onClick={() => navigate('/map?locate=true')}
              className="group relative bg-white border border-[#E5EBE6] rounded-2xl p-3.5 shadow-xs hover:shadow-md hover:border-[#16A34A]/50 transition-all cursor-pointer overflow-hidden active:scale-98"
            >
              {/* Translucent Target/Crosshair Watermark on right */}
              <svg 
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-14 h-14 text-emerald-900/[0.07] pointer-events-none group-hover:scale-105 transition-transform" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="7" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="1" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="1" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="23" y2="12" />
              </svg>

              <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="font-extrabold text-xs sm:text-sm text-[#111827] leading-tight">Periksa GPS</p>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight mt-0.5">Point-in-Polygon</p>
            </div>

            {/* Card 4: Lapor Banjir */}
            <div 
              onClick={() => navigate('/reports/new')}
              className="group relative bg-white border border-[#E5EBE6] rounded-2xl p-3.5 shadow-xs hover:shadow-md hover:border-[#EF4444]/50 transition-all cursor-pointer overflow-hidden active:scale-98"
            >
              {/* Translucent Document Watermark on right */}
              <svg 
                className="absolute -right-1 top-1/2 -translate-y-1/2 w-12 h-14 text-rose-900/[0.07] pointer-events-none group-hover:scale-105 transition-transform" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>

              <div className="w-8 h-8 rounded-xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <p className="font-extrabold text-xs sm:text-sm text-[#111827] leading-tight">Lapor Banjir</p>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium leading-tight mt-0.5">Verifikasi Terbuka</p>
            </div>
          </div>

          {/* ACTION BUTTONS (Exact pills aligned with 3-column CSS Grid: 24px minmax(0, 1fr) 24px) */}
          <div className="w-full space-y-2.5">
            {/* Primary Pill Button: Buka Dashboard Kebencanaan */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'grid',
                gridTemplateColumns: '24px minmax(0, 1fr) 24px',
                alignItems: 'center',
              }}
              className="w-full min-h-[48px] py-3 px-5 sm:px-6 rounded-full font-semibold text-sm text-white bg-[#0D653A] hover:bg-[#0A4E2D] border-2 border-transparent shadow-md shadow-[#0D653A]/20 transition-all duration-150 active:scale-[0.98]"
            >
              <span className="w-6 h-6 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-5 h-5 text-white" />
              </span>
              <span className="text-center font-semibold text-sm leading-snug px-1 break-words">
                Buka Dashboard Kebencanaan
              </span>
              <span className="w-6 h-6 flex items-center justify-center shrink-0">
                <ArrowRight className="w-5 h-5 text-white" />
              </span>
            </button>

            {/* Secondary Pill Button: Peta Interaktif GIS */}
            <button
              type="button"
              onClick={() => navigate('/map')}
              style={{
                display: 'grid',
                gridTemplateColumns: '24px minmax(0, 1fr) 24px',
                alignItems: 'center',
              }}
              className="w-full min-h-[48px] py-3 px-5 sm:px-6 rounded-full font-semibold text-sm text-[#0D653A] bg-white hover:bg-[#F9FAF9] border-2 border-[#0D653A] shadow-xs transition-all duration-150 active:scale-[0.98]"
            >
              <span className="w-6 h-6 flex items-center justify-center shrink-0">
                <Map className="w-5 h-5 text-[#0D653A]" />
              </span>
              <span className="text-center font-semibold text-sm leading-snug px-1 break-words">
                Peta Interaktif GIS
              </span>
              {/* Kolom kanan 24px kosong untuk menjaga teks tetap presisi di tengah tombol */}
              <span className="w-6 h-6 shrink-0" aria-hidden="true" />
            </button>
          </div>

          {/* Tertiary Onboarding Link */}
          <div className="mt-3.5 mb-1">
            <button
              onClick={() => navigate('/onboarding')}
              className="text-xs sm:text-[13px] text-[#2563EB] hover:text-[#0D653A] font-medium underline underline-offset-4 transition-colors"
            >
              Pelajari Panduan Penggunaan Aplikasi (Onboarding) →
            </button>
          </div>

        </div>

        {/* BOTTOM SECTION: Subtle wave footer accent */}
        <div className="w-full h-8 overflow-hidden select-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 400 30" preserveAspectRatio="none">
            <path d="M0,15 C90,5 180,25 270,12 C340,3 380,18 400,10 L400,30 L0,30 Z" fill="#6EAA7D" />
          </svg>
        </div>

      </div>
    </div>
  );
};
