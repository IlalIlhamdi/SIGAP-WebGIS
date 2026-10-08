import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Eye,
  Camera
} from 'lucide-react';
import { dataService } from '../services/dataService';
import type { FloodReportItem } from '../types';

export const ReportsHistoryPage: React.FC = () => {
  const [reports, setReports] = useState<FloodReportItem[]>(() => dataService.getReports());
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = reports.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch = 
      r.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
      r.gampong.toLowerCase().includes(search.toLowerCase()) ||
      r.report_code.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3EAE5] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
            <FileText className="w-4 h-4" />
            <span>Partisipasi Publik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
            Laporan Kejadian Banjir Masyarakat
          </h1>
          <p className="text-xs sm:text-sm text-[#66766C]">
            Transparansi pelaporan genangan dan debit air banjir dari warga Kabupaten Aceh Utara.
          </p>
        </div>

        <button
          onClick={() => navigate('/reports/new')}
          className="pill-btn bg-[#16834B] hover:bg-[#0D653A] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-[#16834B]/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Kirim Laporan Banjir Baru</span>
        </button>
      </div>

      {/* Verification Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-[#E3EAE5] text-xs text-[#25352D] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#16834B] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Kebijakan Integritas & Privasi SIGAP:</strong> Laporan masyarakat baru diberi status <em>"Menunggu Verifikasi"</em> dan tidak langsung mengubah indeks bahaya resmi InaRISK. Identitas pelapor dan nomor kontak dirahasiakan untuk perlindungan privasi.
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card-farm p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#66766C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kecamatan, gampong, atau kode laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-full pl-9 pr-4 py-2 text-xs md:text-sm outline-none focus:border-[#16834B] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-[#66766C] shrink-0">Status:</span>
          {['all', 'Diverifikasi', 'Ditindaklanjuti', 'Menunggu Verifikasi'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition ${
                statusFilter === st 
                  ? 'bg-[#16834B] text-white' 
                  : 'bg-[#F4F7F5] text-[#25352D] hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rep) => (
          <div key={rep.id} className="card-farm card-farm-hover p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-[#66766C] bg-[#F4F7F5] px-2 py-0.5 rounded-full border border-[#E3EAE5]">
                  {rep.report_code}
                </span>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  rep.status === 'Diverifikasi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  rep.status === 'Ditindaklanjuti' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  rep.status === 'Ditolak' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {rep.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#25352D]">
                  Kecamatan {rep.kecamatan}
                </h3>
                <p className="text-xs text-[#66766C] font-semibold">
                  Gampong {rep.gampong} • {rep.location_detail}
                </p>
              </div>

              <div className="bg-[#F4F7F5] p-2.5 rounded-xl border border-[#E3EAE5] flex items-center justify-between text-xs">
                <span className="text-[#66766C]">Ketinggian Genangan:</span>
                <span className="font-extrabold text-red-600 text-sm">
                  ± {rep.water_depth_cm} cm
                </span>
              </div>

              <p className="text-xs text-[#25352D] leading-relaxed line-clamp-3">
                {rep.description}
              </p>

              {/* Photo preview if present */}
              {rep.photo_url && (
                <div 
                  onClick={() => setSelectedPhoto(rep.photo_url!)}
                  className="relative rounded-xl overflow-hidden h-32 border border-[#E3EAE5] cursor-pointer group"
                >
                  <img 
                    src={rep.photo_url} 
                    alt="Bukti foto banjir" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Perbesar Foto</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E3EAE5] flex items-center justify-between text-[11px] text-[#66766C]">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(rep.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              {rep.verified_by ? (
                <span className="text-emerald-700 font-semibold truncate max-w-[140px]">
                  Verifikasi: {rep.verified_by}
                </span>
              ) : (
                <span className="text-amber-700 italic">Antrean Petugas</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card-farm p-12 text-center space-y-2">
          <p className="font-bold text-[#25352D]">Belum ada laporan yang sesuai kriteria.</p>
          <p className="text-xs text-[#66766C]">Gunakan formulir untuk mengirim laporan banjir pertama Anda.</p>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden p-2">
            <img src={selectedPhoto} alt="Bukti Foto" className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="text-center py-2">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="pill-btn bg-[#16834B] text-white px-4 py-1.5 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
