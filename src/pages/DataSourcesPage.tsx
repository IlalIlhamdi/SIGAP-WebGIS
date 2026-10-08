import React, { useEffect, useState } from 'react';
import { 
  Database, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  FileCode2, 
  Scale, 
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { dataService } from '../services/dataService';
import type { DataSourceMeta } from '../types';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<DataSourceMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSources() {
      try {
        const meta = await dataService.getDataSourcesMeta();
        setSources(meta);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSources();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#16834B]">
          <Database className="w-4 h-4" />
          <span>Integritas Ilmiah & Transparansi Data</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
          Sumber Data Resmi & Metodologi GIS
        </h1>
        <p className="text-xs sm:text-sm text-[#66766C]">
          Katalog metadata dataset geospasial, lisensi penggunaan, dan batasan teknis aplikasi SIGAP 1.0.
        </p>
      </div>

      {/* Mandatory LKTI Academic Integrity Principle */}
      <div className="card-farm p-6 bg-emerald-50/60 border border-[#B9DFC5] space-y-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#0D653A]">
          <ShieldCheck className="w-5 h-5 text-[#16834B]" />
          <span>Prinsip Integritas Ilmiah LKTI: Nol Fabrikasi Data</span>
        </div>
        <p className="text-xs text-[#25352D] leading-relaxed">
          Seluruh koordinat batas poligon, indeks bahaya, angka penduduk, dan histori banjir dalam aplikasi SIGAP <strong>100% menggunakan data asli</strong> yang dipublikasikan oleh institusi pemerintah berwenang di Indonesia. Aplikasi membedakan secara tegas antara dataset <em>TERVERIFIKASI</em>, dataset yang <em>BELUM TERSEDIA</em>, serta status <em>SIMULASI</em> yang hanya digunakan secara transparan saat demonstrasi antarmuka.
        </p>
      </div>

      {/* Data Sources Grid */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-[#25352D]">6 Sumber Data Resmi Terintegrasi</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((ds) => (
            <div key={ds.id} className="card-farm p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {ds.status}
                  </span>
                  <span className="text-[10px] text-[#66766C] font-semibold">Tahun Rujukan: {ds.reference_year}</span>
                </div>

                <h4 className="text-base font-extrabold text-[#25352D] leading-snug">
                  {ds.dataset_name}
                </h4>

                <div className="text-xs text-[#66766C] space-y-1">
                  <p><strong>Instansi:</strong> <span className="text-[#0D653A] font-semibold">{ds.institution}</span></p>
                  <p><strong>Sistem Koordinat (CRS):</strong> <span className="font-mono text-[#25352D]">{ds.crs}</span></p>
                  <p><strong>Lisensi:</strong> {ds.license}</p>
                  <p><strong>Akses Terakhir:</strong> {ds.accessed_at}</p>
                </div>

                <div className="pt-2 text-xs text-[#25352D] bg-[#F4F7F5] p-2.5 rounded-xl border border-[#E3EAE5]">
                  <span className="text-[10px] text-[#66766C] font-bold block uppercase mb-0.5">Catatan Teknis:</span>
                  <p className="leading-relaxed text-[11px]">{ds.notes}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3EAE5] flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-[#66766C]">{ds.id}</span>
                {ds.source_url && (
                  <a
                    href={ds.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#16834B] hover:underline text-xs"
                  >
                    <span>Kunjungi Portal Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations Documentation Card */}
      <div className="card-farm p-6 space-y-3 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Keterbatasan Data & Sistem (Academic Disclaimer)</span>
        </div>
        <ul className="text-xs text-[#25352D] space-y-2 list-disc list-inside leading-relaxed">
          <li><strong>Tingkat Ketelitian Spasial:</strong> Layer batas administrasi kecamatan dan kabupaten bersumber dari InaRISK BNPB skala 1:50.000 (resolusi raster bahaya 100 meter). Hasil penapisan tidak boleh dijadikan acuan tunggal perizinan tata ruang mikro setingkat persil tanah.</li>
          <li><strong>Peta Bahaya vs Risiko:</strong> Aplikasi saat ini menampilkan Indeks Bahaya Banjir resmi. Analisis risiko komprehensif membutuhkan data kerentanan infrastruktur detail per desa yang saat ini belum seluruhnya tersedia dalam sistem satu data geospasial nasional.</li>
          <li><strong>Bukan Sistem Peringatan Dini Real-time:</strong> SIGAP 1.0 dirancang sebagai Sistem Informasi Geospasial Pendukung Keputusan dan edukasi, bukan pengganti sirene EWS resmi Pusdalops BPBD Kabupaten Aceh Utara.</li>
        </ul>
      </div>
    </div>
  );
};
