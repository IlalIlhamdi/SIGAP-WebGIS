import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Settings, 
  BookOpen, 
  FileText, 
  Info, 
  RotateCcw, 
  Lock,
  Smartphone,
  ChevronRight,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserProfilePage: React.FC = () => {
  const { role, setRole, isSimulationMode, setIsSimulationMode } = useApp();
  const navigate = useNavigate();

  const handleResetData = () => {
    if (confirm("Reset ulang data laporan ke kondisi awal prototipe LKTI?")) {
      localStorage.removeItem('sigap_reports');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <h1 className="text-2xl font-extrabold text-[#0D653A] tracking-tight">
          Profil & Pengaturan Aplikasi
        </h1>
        <p className="text-xs text-[#66766C]">
          Konfigurasi peran pengguna, status PWA, dan informasi prototipe LKTI SIGAP 1.0.
        </p>
      </div>

      {/* User Card */}
      <div className="card-farm p-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#16834B] flex items-center justify-center font-extrabold text-xl shadow-xs border border-[#B9DFC5]">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#25352D]">
              {role === 'admin' ? 'Administrator BPBD' : role === 'officer' ? 'Petugas Pusdalops BPBD' : 'Masyarakat Umum'}
            </h3>
            <p className="text-xs text-[#66766C]">
              Peran Aktif: <strong className="text-[#0D653A] uppercase">{role}</strong>
            </p>
            <p className="text-[11px] text-[#66766C]">Wilayah Tugas: Kabupaten Aceh Utara</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#16834B] border border-[#B9DFC5] uppercase">
          Aktif
        </span>
      </div>

      {/* Role Switcher (LKTI Evaluator Convenience) */}
      <div className="card-farm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-2">
          <h4 className="font-extrabold text-xs text-[#25352D] uppercase">
            Ganti Peran Demonstrasi (Simulasi LKTI)
          </h4>
          <span className="text-[10px] text-[#66766C]">Multi-Role Access</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'public' as const, label: 'Masyarakat', desc: 'Lapor & Lihat Peta' },
            { id: 'officer' as const, label: 'Petugas', desc: 'Validasi Laporan' },
            { id: 'admin' as const, label: 'Admin', desc: 'Akses Penuh BPBD' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`p-3 rounded-2xl text-left border transition ${
                role === r.id
                  ? 'border-[#16834B] bg-[#E8F5E9] text-[#0D653A] font-bold shadow-xs'
                  : 'border-[#E3EAE5] bg-white text-[#25352D] hover:bg-[#F4F7F5]'
              }`}
            >
              <p className="text-xs font-bold">{r.label}</p>
              <p className="text-[10px] text-[#66766C]">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* App & Documentation Links */}
      <div className="card-farm p-5 space-y-3">
        <h4 className="font-extrabold text-xs text-[#25352D] uppercase border-b border-[#E3EAE5] pb-2">
          Dokumentasi & Tautan Penting LKTI
        </h4>

        <div className="space-y-1.5 text-xs">
          <button
            onClick={() => navigate('/data-sources')}
            className="w-full p-2.5 rounded-xl bg-[#F4F7F5] hover:bg-slate-200 flex items-center justify-between text-left transition font-semibold text-[#25352D]"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#16834B]" />
              <span>Sumber Data & Metodologi Resmi GIS</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66766C]" />
          </button>

          <button
            onClick={() => navigate('/education')}
            className="w-full p-2.5 rounded-xl bg-[#F4F7F5] hover:bg-slate-200 flex items-center justify-between text-left transition font-semibold text-[#25352D]"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#16834B]" />
              <span>Pusat Edukasi & Tas Siaga Bencana</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66766C]" />
          </button>

          <button
            onClick={() => navigate('/onboarding')}
            className="w-full p-2.5 rounded-xl bg-[#F4F7F5] hover:bg-slate-200 flex items-center justify-between text-left transition font-semibold text-[#25352D]"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Buka Ulang Panduan Aplikasi (Onboarding)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#66766C]" />
          </button>
        </div>
      </div>

      {/* Reset & Storage Tools */}
      <div className="card-farm p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#25352D]">Reset Data Laporan Demonstrasi</p>
          <p className="text-[11px] text-[#66766C]">Kembalikan antrean laporan ke state awal pabrikan</p>
        </div>
        <button
          onClick={handleResetData}
          className="pill-btn bg-white border border-[#E3EAE5] hover:bg-red-50 text-red-600 px-3 py-1.5 text-xs font-bold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data</span>
        </button>
      </div>

      <div className="text-center text-[11px] text-[#66766C] pt-2">
        SIGAP 1.0 — Inovasi Teknologi LKTI • Hak Cipta 2026 Tim Peneliti
      </div>
    </div>
  );
};
