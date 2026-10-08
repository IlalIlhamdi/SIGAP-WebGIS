import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  AlertCircle, 
  Activity, 
  Waves, 
  ShieldAlert, 
  Building2, 
  Users, 
  FileText, 
  BookOpen, 
  Database, 
  ShieldCheck, 
  UserCircle2,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { role, setRole } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/map', label: 'Peta Bahaya Banjir', icon: Map, badge: 'GIS' },
    { to: '/areas', label: 'Wilayah Terdampak', icon: AlertCircle },
    { to: '/analysis', label: 'Analisis Faktor', icon: Activity },
    { to: '/rivers', label: 'Sungai & Drainase', icon: Waves },
    { to: '/evacuation', label: 'Jalur & Titik Evakuasi', icon: ShieldAlert },
    { to: '/facilities', label: 'Fasilitas Umum', icon: Building2 },
    { to: '/population', label: 'Data Penduduk', icon: Users },
    { to: '/reports', label: 'Laporan Masyarakat', icon: FileText },
    { to: '/education', label: 'Edukasi & Mitigasi', icon: BookOpen },
    { to: '/data-sources', label: 'Sumber Data & Metode', icon: Database },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-[#E3EAE5] h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#E3EAE5] flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-[#16834B]/20 shrink-0 border border-[#B9DFC5]">
          <img src="/logo.svg" alt="SIGAP Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl text-[#0D653A] tracking-tight">SIGAP</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#B9DFC5] text-[#0D653A]">v1.0</span>
          </div>
          <p className="text-xs text-[#66766C] font-medium leading-tight">Kab. Aceh Utara</p>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="text-[11px] font-bold text-[#66766C]/70 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${isActive 
                  ? 'bg-[#16834B] text-white shadow-sm shadow-[#16834B]/25' 
                  : 'text-[#25352D] hover:bg-[#F4F7F5] hover:text-[#0D653A]'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#66766C]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#B9DFC5]/60 text-[#0D653A]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Petugas / Admin Section */}
        <div className="pt-4 mt-4 border-t border-[#E3EAE5]">
          <p className="text-[11px] font-bold text-[#66766C]/70 uppercase tracking-wider px-3 mb-2">Akses Petugas BPBD</p>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) => `
              flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${isActive 
                ? 'bg-[#0D653A] text-white shadow-sm' 
                : 'text-[#25352D] hover:bg-[#F4F7F5] hover:text-[#0D653A]'}
            `}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verifikasi Laporan</span>
            </div>
            {role !== 'public' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </NavLink>
        </div>
      </div>

      {/* User / Demo Role Footer */}
      <div className="p-4 border-t border-[#E3EAE5] bg-[#F4F7F5]/60">
        <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-[#E3EAE5] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#16834B] flex items-center justify-center shrink-0 font-bold">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#25352D] truncate">
                {role === 'admin' ? 'BPBD Administrator' : role === 'officer' ? 'Petugas Lapangan' : 'Masyarakat Umum'}
              </p>
              <p className="text-[10px] text-[#66766C] uppercase font-semibold">Peran: {role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (role === 'public') setRole('officer');
              else if (role === 'officer') setRole('admin');
              else setRole('public');
            }}
            title="Ganti Peran Demonstrasi LKTI"
            className="text-[10px] font-bold bg-[#F4F7F5] hover:bg-[#B9DFC5] text-[#0D653A] px-2 py-1 rounded-lg border border-[#E3EAE5] transition shrink-0"
          >
            Switch
          </button>
        </div>
      </div>
    </aside>
  );
};
