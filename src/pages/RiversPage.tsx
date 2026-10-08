import React, { useState } from 'react';
import { Waves, MapPin, Info, ShieldCheck, ChevronRight, Droplets, Compass } from 'lucide-react';
import { FloodMap } from '../components/map/FloodMap';
import { useNavigate } from 'react-router-dom';

export const RiversPage: React.FC = () => {
  const navigate = useNavigate();

  const majorBasins = [
    {
      name: "DAS Krueng Keureuto",
      length_approx: "± 78 km",
      area_drained: "Kawasan Tengah (Lhoksukon, Matangkuli, Tanah Luas, Paya Bakong, Cot Girek)",
      mitigation_project: "Bendungan Keureuto (PSN Kementerian PUPR)",
      flood_characteristic: "Kapasitas palung sungai menyempit di hilir Lhoksukon. Saat debit puncak di hulu melebihi 800 m³/detik, tanggul alami jebol dan menggenangi permukiman serta sawah hingga 2 meter.",
      tributaries: ["Krueng Peuto", "Krueng Pirak"],
      source: "BWS Sumatera I & Dokumen Amdal PUPR"
    },
    {
      name: "DAS Krueng Pase",
      length_approx: "± 62 km",
      area_drained: "Kawasan Barat-Tengah (Geuredong Pase, Meurah Mulia, Syamtalira Bayu, Samudera)",
      mitigation_project: "Normalisasi Tanggul & Perkuatan Tebing BWS Sumatera I",
      flood_characteristic: "Sungai berhulu di perbukitan Geuredong Pase dengan kemiringan terjal. Memicu banjir bandang cepat dan sedimentasi tinggi di daerah dataran Meurah Mulia dan Samudera.",
      tributaries: ["Alue Keutapang", "Alue Merbo"],
      source: "Balai Wilayah Sungai (BWS) Sumatera I"
    },
    {
      name: "DAS Krueng Pirak",
      length_approx: "± 45 km",
      area_drained: "Kecamatan Pirak Timur & Matangkuli",
      mitigation_project: "Pembangunan Tanggul Kritis & Kanal Pengelak",
      flood_characteristic: "Bertemu dengan Krueng Keureuto di Matangkuli. Efek backwater (arus balik) sering terjadi ketika debit kedua sungai sama-sama tinggi.",
      tributaries: ["Alue Bili"],
      source: "Dinas Pengairan Provinsi Aceh"
    },
    {
      name: "DAS Krueng Jambo Aye",
      length_approx: "± 105 km",
      area_drained: "Kawasan Pesisir Timur (Tanah Jambo Aye, Langkahan, Seunuddon, Baktiya)",
      mitigation_project: "Tanggul Pengaman Tebing Jambo Aye & Saluran Pembuang",
      flood_characteristic: "Salah satu sungai terbesar di pesisir timur Aceh yang membatasi Aceh Utara dan Aceh Timur. Genangan pasang laut (rob) dapat menahan aliran air tawar keluar ke Selat Malaka.",
      tributaries: ["Krueng Arakundo"],
      source: "BPSDA Aceh & BWS Sumatera I"
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-600">
          <Waves className="w-4 h-4" />
          <span>Hidrologi & Jaringan Aliran Air</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
          Informasi Sungai & Drainase Aceh Utara
        </h1>
        <p className="text-xs sm:text-sm text-[#66766C]">
          Karakteristik Daerah Aliran Sungai (DAS) utama yang membentuk pola genangan dan banjir tahunan.
        </p>
      </div>

      {/* Interactive Map View with Rivers Layer Focus */}
      <div className="card-farm p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3EAE5] pb-2.5">
          <div>
            <h3 className="font-extrabold text-sm text-[#25352D]">Visualisasi Spasial Aliran Sungai</h3>
            <p className="text-xs text-[#66766C]">Garis biru menunjukkan jaringan sungai OSM terverifikasi di Kabupaten Aceh Utara</p>
          </div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Layer Sungai Aktif
          </span>
        </div>
        <div className="h-80 w-full rounded-2xl overflow-hidden border border-[#E3EAE5]">
          <FloodMap heightClass="h-80" />
        </div>
      </div>

      {/* Major River Basins Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#25352D]">4 Sistem DAS Utama Penyebab Banjir</h3>
          <span className="text-xs text-[#66766C]">Sumber: BWS Sumatera I</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {majorBasins.map((basin, idx) => (
            <div key={idx} className="card-farm p-5 space-y-3 border-t-4 border-t-sky-500">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-[#0D653A]">{basin.name}</h4>
                  <p className="text-xs text-[#66766C]">Panjang Utama: {basin.length_approx}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div className="p-2.5 bg-[#F4F7F5] rounded-xl">
                  <span className="text-[10px] text-[#66766C] font-bold block uppercase">Wilayah Pengaliran:</span>
                  <p className="font-semibold text-[#25352D]">{basin.area_drained}</p>
                </div>

                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-amber-800 font-bold block uppercase">Karakteristik Ancaman Banjir:</span>
                  <p className="text-amber-950 text-[11px] leading-relaxed">{basin.flood_characteristic}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#66766C] pt-1">
                  <span>Proyek Mitigasi: <strong>{basin.mitigation_project}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Disclaimer Note */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-[#E3EAE5] text-xs text-[#66766C] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#25352D]">Catatan Integritas Data Teknis:</strong> SIGAP tidak membuat kesimpulan subjektif mengenai status pemeliharaan drainase gampong secara umum tanpa hasil audit teknis PUPR. Visualisasi didasarkan pada data jaringan alami sungai, elevasi topografi, dan catatan riwayat genangan resmi BPBD Aceh Utara.
        </div>
      </div>
    </div>
  );
};
