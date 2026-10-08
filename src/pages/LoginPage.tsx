import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login logic
    if (email.includes('admin')) {
      setRole('admin');
    } else {
      setRole('officer');
    }
    navigate('/admin/reports');
  };

  const handleQuickDemoRole = (role: 'officer' | 'admin') => {
    setRole(role);
    navigate('/admin/reports');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between p-6">
      <div className="max-w-md mx-auto w-full pt-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66766C] hover:text-[#0D653A] bg-white px-3 py-1.5 rounded-full border border-[#E3EAE5]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      <div className="max-w-md mx-auto w-full my-auto space-y-6">
        {/* Brand Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl mx-auto shadow-lg shadow-[#16834B]/20 border border-white overflow-hidden">
            <img src="/logo.svg" alt="SIGAP Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0D653A]">
            Masuk Portal Petugas
          </h2>
          <p className="text-xs text-[#66766C]">
            Pusat Pengendalian Operasi (PUSDALOPS) BPBD Kab. Aceh Utara
          </p>
        </div>

        {/* Login Card (Farm2Table style) */}
        <div className="card-farm p-6 sm:p-8 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">Email Dinas / Petugas</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#66766C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="petugas@acehutarakab.go.id"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#25352D]">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#66766C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:border-[#16834B] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-3 text-xs font-bold shadow-md shadow-[#16834B]/20"
            >
              <span>Masuk Sebagai Petugas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* LKTI Quick Evaluator Logins */}
          <div className="pt-4 border-t border-[#E3EAE5] space-y-2">
            <p className="text-[11px] font-bold text-[#25352D] text-center">
              Akses Cepat Pengujian Dewan Juri LKTI:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoRole('officer')}
                className="p-2.5 rounded-xl bg-[#E8F5E9] hover:bg-[#B9DFC5] text-[#0D653A] font-bold text-xs border border-[#B9DFC5] transition"
              >
                Petugas Lapangan
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoRole('admin')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#25352D] font-bold text-xs border border-[#E3EAE5] transition"
              >
                Admin BPBD
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-[#66766C] pb-2">
        Akses khusus petugas berwenang verifikasi data kebencanaan.
      </div>
    </div>
  );
};
