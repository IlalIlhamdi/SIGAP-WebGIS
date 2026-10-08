import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Users, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dataService } from '../services/dataService';

export const AdminDashboardPage: React.FC = () => {
  const { role } = useApp();
  const navigate = useNavigate();
  const reports = dataService.getReports();

  const pending = reports.filter(r => r.status === 'Menunggu Verifikasi');
  const verified = reports.filter(r => r.status === 'Diverifikasi');
  const followedUp = reports.filter(r => r.status === 'Ditindaklanjuti');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#16834B]">
          <ShieldCheck className="w-4 h-4" />
          <span>Sistem Manajemen Bencana Daerah</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
          Panel Kendali Operasi Petugas BPBD
        </h1>
        <p className="text-xs sm:text-sm text-[#66766C]">
          Monitoring laporan kebencanaan dan koordinasi tanggap darurat Kabupaten Aceh Utara.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-farm p-5 space-y-1 border-l-4 border-l-amber-500">
          <span className="text-xs font-bold text-[#66766C] uppercase">Antrean Verifikasi</span>
          <p className="text-3xl font-black text-amber-600">{pending.length}</p>
          <p className="text-xs text-[#66766C]">Laporan butuh validasi petugas</p>
        </div>

        <div className="card-farm p-5 space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-[#66766C] uppercase">Laporan Diverifikasi</span>
          <p className="text-3xl font-black text-[#16834B]">{verified.length}</p>
          <p className="text-xs text-[#66766C]">Ditampilkan pada peta publik</p>
        </div>

        <div className="card-farm p-5 space-y-1 border-l-4 border-l-blue-500">
          <span className="text-xs font-bold text-[#66766C] uppercase">Tindak Lanjut Lapangan</span>
          <p className="text-3xl font-black text-blue-600">{followedUp.length}</p>
          <p className="text-xs text-[#66766C]">Posko darurat dikerahkan</p>
        </div>
      </div>

      {/* Action banner to verification queue */}
      <div className="card-farm p-6 bg-emerald-50/60 border border-[#B9DFC5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-[#0D653A]">
            Antrean Verifikasi Laporan Masyarakat ({pending.length})
          </h3>
          <p className="text-xs text-[#66766C]">
            Tinjau koordinat, foto genangan, dan estimasi tinggi air dari masyarakat untuk disetujui.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/reports')}
          className="pill-btn bg-[#16834B] hover:bg-[#0D653A] text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-[#16834B]/20 shrink-0"
        >
          <span>Buka Antrean Verifikasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
