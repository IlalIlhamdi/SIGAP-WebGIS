import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useApp } from '../context/AppContext';
import type { FloodReportItem } from '../types';

export const AdminReportsVerificationPage: React.FC = () => {
  const { role } = useApp();
  const [reports, setReports] = useState<FloodReportItem[]>(() => dataService.getReports());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<FloodReportItem | null>(null);

  const handleUpdateStatus = (id: string, newStatus: FloodReportItem['status']) => {
    const officerName = role === 'admin' ? 'Administrator BPBD Aceh Utara' : 'Petugas Lapangan Pusdalops';
    dataService.updateReportStatus(id, newStatus, officerName);
    setReports(dataService.getReports());
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport(prev => prev ? { ...prev, status: newStatus, verified_by: officerName } : null);
    }
  };

  const filtered = reports.filter(r => {
    const matchStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchSearch = 
      r.kecamatan.toLowerCase().includes(search.toLowerCase()) ||
      r.gampong.toLowerCase().includes(search.toLowerCase()) ||
      r.report_code.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = reports.filter(r => r.status === 'Menunggu Verifikasi').length;
  const verifiedCount = reports.filter(r => r.status === 'Diverifikasi').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3EAE5] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0D653A]">
            <ShieldCheck className="w-4 h-4 text-[#16834B]" />
            <span>Pusdalops BPBD Kabupaten Aceh Utara</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
            Verifikasi & Validasi Laporan Banjir
          </h1>
          <p className="text-xs sm:text-sm text-[#66766C]">
            Antrean moderasi laporan warga sebelum ditayangkan pada peta bahaya publik.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            {pendingCount} Menunggu Tindakan
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {verifiedCount} Selesai Diverifikasi
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="card-farm p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#66766C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F4F7F5] border border-[#E3EAE5] rounded-full pl-9 pr-4 py-2 text-xs md:text-sm outline-none focus:border-[#16834B] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', 'Menunggu Verifikasi', 'Diverifikasi', 'Ditindaklanjuti', 'Ditolak'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition ${
                statusFilter === st 
                  ? 'bg-[#16834B] text-white' 
                  : 'bg-[#F4F7F5] text-[#25352D] hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Semua' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Verification Table */}
      <div className="card-farm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F7F5] text-[#66766C] font-bold uppercase text-[10px] border-b border-[#E3EAE5]">
              <tr>
                <th className="py-3 px-4">Kode & Waktu</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Genangan</th>
                <th className="py-3 px-4">Pelapor (Privat Petugas)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EAE5]">
              {filtered.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#F4F7F5]/50 transition">
                  <td className="py-3 px-4">
                    <p className="font-mono font-bold text-[#25352D]">{rep.report_code}</p>
                    <p className="text-[10px] text-[#66766C]">
                      {new Date(rep.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-[#25352D]">Kec. {rep.kecamatan}</p>
                    <p className="text-[11px] text-[#66766C]">Gampong {rep.gampong}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-extrabold text-red-600 text-sm">
                      {rep.water_depth_cm} cm
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-[#25352D]">{rep.reporter_name}</p>
                    <p className="text-[10px] text-[#66766C] font-mono">{rep.reporter_contact || 'Anonim'}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      rep.status === 'Diverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                      rep.status === 'Ditindaklanjuti' ? 'bg-blue-100 text-blue-800' :
                      rep.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedReport(rep)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#25352D] font-bold text-[11px]"
                      >
                        Detail
                      </button>

                      {rep.status !== 'Diverifikasi' && (
                        <button
                          onClick={() => handleUpdateStatus(rep.id, 'Diverifikasi')}
                          title="Setujui & Publikasikan"
                          className="px-2.5 py-1 rounded-lg bg-[#E8F5E9] hover:bg-[#B9DFC5] text-[#0D653A] font-bold text-[11px]"
                        >
                          Verifikasi
                        </button>
                      )}

                      {rep.status !== 'Ditindaklanjuti' && (
                        <button
                          onClick={() => handleUpdateStatus(rep.id, 'Ditindaklanjuti')}
                          title="Tandai Ditindaklanjuti BPBD"
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px]"
                        >
                          Tindak
                        </button>
                      )}

                      {rep.status !== 'Ditolak' && (
                        <button
                          onClick={() => handleUpdateStatus(rep.id, 'Ditolak')}
                          title="Tolak Laporan (Spam)"
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px]"
                        >
                          Tolak
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 space-y-4 shadow-2xl border border-[#E3EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E3EAE5] pb-3">
              <div>
                <span className="font-mono text-xs text-[#66766C]">{selectedReport.report_code}</span>
                <h3 className="font-extrabold text-base text-[#25352D]">
                  Detail Verifikasi Petugas
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F4F7F5] rounded-xl space-y-1">
                <p><strong>Wilayah:</strong> Kec. {selectedReport.kecamatan}, Gampong {selectedReport.gampong}</p>
                <p><strong>Patokan:</strong> {selectedReport.location_detail}</p>
                <p><strong>Koordinat:</strong> {selectedReport.coord[0]}, {selectedReport.coord[1]}</p>
                <p><strong>Ketinggian Air:</strong> <span className="text-red-600 font-bold">{selectedReport.water_depth_cm} cm</span></p>
                <p><strong>Waktu:</strong> {new Date(selectedReport.created_at).toLocaleString('id-ID')}</p>
              </div>

              <div className="p-3 bg-[#F4F7F5] rounded-xl space-y-1">
                <p className="font-bold text-[#25352D]">Identitas Pelapor (Internal BPBD):</p>
                <p>Nama: {selectedReport.reporter_name}</p>
                <p>Telepon: {selectedReport.reporter_contact || 'Tidak dicantumkan'}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-[#25352D]">Keterangan Kejadian:</p>
                <p className="p-3 bg-white border border-[#E3EAE5] rounded-xl leading-relaxed text-[#25352D]">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.photo_url && (
                <div className="space-y-1">
                  <p className="font-bold text-[#25352D]">Foto Bukti:</p>
                  <img src={selectedReport.photo_url} alt="Bukti" className="w-full h-44 object-cover rounded-xl border border-[#E3EAE5]" />
                </div>
              )}
            </div>

            {/* Quick action buttons in modal */}
            <div className="pt-3 border-t border-[#E3EAE5] grid grid-cols-3 gap-2">
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'Diverifikasi')}
                className="pill-btn bg-[#16834B] text-white py-2 text-xs font-bold"
              >
                Setujui
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'Ditindaklanjuti')}
                className="pill-btn bg-blue-600 text-white py-2 text-xs font-bold"
              >
                Tindak Lanjut
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'Ditolak')}
                className="pill-btn bg-red-600 text-white py-2 text-xs font-bold"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
