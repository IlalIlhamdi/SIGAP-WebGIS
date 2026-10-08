import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  CheckCircle2, 
  ZapOff, 
  Backpack, 
  LifeBuoy, 
  Home, 
  ChevronRight,
  Flame,
  Radio
} from 'lucide-react';

export const EducationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pra' | 'saat' | 'pasca' | 'tas'>('pra');

  const emergencyContacts = [
    { agency: "Pusdalops BPBD Kabupaten Aceh Utara", phone: "(0645) 31113", type: "Posko Komando Bencana 24 Jam" },
    { agency: "Panggilan Darurat Terpadu (Call Center)", phone: "112", type: "Bebas Pulsa / Seluler" },
    { agency: "Polres Aceh Utara (Lhoksukon)", phone: "110 / (0645) 31110", type: "Keamanan & Evakuasi Polri" },
    { agency: "Pos SAR / Basarnas Wilayah Aceh Utara", phone: "(0645) 44021", type: "Pencarian & Pertolongan Air" },
    { agency: "Palang Merah Indonesia (PMI) Aceh Utara", phone: "(0645) 43044", type: "Dukungan Medis & Dapur Darurat" },
    { agency: "PLN Gangguan & Keselamatan Listrik", phone: "123", type: "Pemutusan Aliran Banjir" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#E3EAE5] pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#16834B]">
          <BookOpen className="w-4 h-4" />
          <span>Pusat Kesiapsiagaan & Edukasi Warga</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D653A] tracking-tight">
          Panduan Mitigasi & Tanggap Bencana Banjir
        </h1>
        <p className="text-xs sm:text-sm text-[#66766C]">
          Kesiapan mandiri masyarakat sebelum, saat, dan sesudah genangan banjir melanda pemukiman.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E3EAE5]">
        {[
          { id: 'pra', label: '1. Sebelum Banjir (Pra-Bencana)', icon: Home },
          { id: 'saat', label: '2. Saat Terjadi Banjir (Tanggap)', icon: LifeBuoy },
          { id: 'pasca', label: '3. Setelah Banjir (Pemulihan)', icon: ShieldCheck },
          { id: 'tas', label: '4. Tas Siaga Bencana (Go-Bag)', icon: Backpack },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 ${
                isActive 
                  ? 'bg-[#16834B] text-white shadow-xs' 
                  : 'bg-white text-[#66766C] hover:bg-[#F4F7F5] border border-[#E3EAE5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="card-farm p-6 sm:p-8 space-y-5">
        {activeTab === 'pra' && (
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-[#0D653A] flex items-center gap-2">
              <Home className="w-5 h-5 text-[#16834B]" />
              <span>Langkah Mitigasi Sebelum Banjir Datang</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">1. Pantau Informasi Cuaca & Debit Sungai</span>
                <p className="text-[#66766C] leading-relaxed">
                  Cek rutin prakiraan cuaca BMKG dan status tinggi muka air sungai Krueng Keureuto, Krueng Pirak, atau Krueng Pase di aplikasi SIGAP. Waspadai jika hujan lebat turun lebih dari 6 jam di wilayah hulu pegunungan Bener Meriah/Paya Bakong.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">2. Amankan Dokumen & Arsip Berharga</span>
                <p className="text-[#66766C] leading-relaxed">
                  Simpan surat tanah, kartu keluarga, ijazah, dan dokumen penting dalam kantong plastik kedap air (waterproof) dan letakkan di lantai dua atau tempat lemari paling tinggi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">3. Kenali Jalur Evakuasi Gampong</span>
                <p className="text-[#66766C] leading-relaxed">
                  Pastikan seluruh anggota keluarga mengetahui letak posko pengungsian terdekat (Meunasah, masjid, atau gedung pertemuan berlantai tinggi) serta jalur evakuasi yang tidak terputus saluran air deras.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">4. Bersihkan Saluran Air & Drainase</span>
                <p className="text-[#66766C] leading-relaxed">
                  Lakukan gotong royong gampong membersihkan sampah, lumpur, dan semak belukar yang menyumbat saluran pembuang dan gorong-gorong jalan gampong.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saat' && (
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-[#DC2626] flex items-center gap-2">
              <LifeBuoy className="w-5 h-5" />
              <span>Prosedur Keselamatan Saat Banjir Melanda</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <span className="font-extrabold text-red-900 text-sm flex items-center gap-1.5">
                  <ZapOff className="w-4 h-4 text-red-600" />
                  <span>Matikan Aliran Listrik & Gas Segera!</span>
                </span>
                <p className="text-red-800 leading-relaxed">
                  Turunkan Miniature Circuit Breaker (MCB) di meteran rumah sebelum genangan air mencapai stopkontak dinding. Cabut semua kabel elektronik untuk mencegah sengatan listrik mematikan di dalam genangan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <span className="font-extrabold text-red-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Evakuasi Terencana, Jangan Menunggu Terjebak</span>
                </span>
                <p className="text-red-800 leading-relaxed">
                  Prioritaskan lansia, anak-anak, ibu hamil, dan penyandang disabilitas. Bergerak menuju posko evakuasi sebelum arus air deras melumpuhkan jalan. Jangan berjalan melintasi arus air deras setinggi lutut karena risiko terseret lubang selokan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">Waspadai Binatang Berbisa</span>
                <p className="text-[#66766C] leading-relaxed">
                  Ular, kelabang, dan kalajengking kerap mencari tempat kering di atap rumah, pohon, atau tumpukan perabotan saat air naik. Gunakan tongkat kayu untuk meraba langkah.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">Hindari Mengonsumsi Air Genangan</span>
                <p className="text-[#66766C] leading-relaxed">
                  Air banjir terkontaminasi bakteri tinja, limbah septictank, dan bangkai hewan. Gunakan hanya air minum kemasan atau air bersih dari posko bantuan resmi.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pasca' && (
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-[#0D653A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16834B]" />
              <span>Pemulihan & Sanitasi Pasca-Banjir Surut</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">1. Cek Kelayakan Instalasi Sebelum Menyalakan Listrik</span>
                <p className="text-[#66766C] leading-relaxed">
                  Pastikan seluruh stopkontak, sakelar, dan kabel telah benar-benar kering sebelum MCB PLN dinaikkan kembali. Jika ragu, minta teknisi kelistrikan memeriksa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">2. Bersihkan & Disinfeksi Lumpur Endapan</span>
                <p className="text-[#66766C] leading-relaxed">
                  Kuras endapan lumpur sesegera mungkin sebelum mengeras. Gunakan karbol atau klorin untuk membunuh kuman leptospirosis dan bakteri diare pada lantai rumah.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">3. Kuras Sumur & Sumber Air Bersih</span>
                <p className="text-[#66766C] leading-relaxed">
                  Sumur gali yang sempat terendam air banjir harus dikuras dan diberi kaporit desinfektan sebelum airnya digunakan kembali untuk memasak atau mandi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-2">
                <span className="font-extrabold text-[#25352D] text-sm block">4. Waspadai Kerusakan Struktur Bangunan</span>
                <p className="text-[#66766C] leading-relaxed">
                  Periksa fondasi dinding yang retak atau tiang kayu yang keropos akibat terendam air berhari-hari sebelum beraktivitas penuh di dalam rumah.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#0D653A] flex items-center gap-2">
                <Backpack className="w-5 h-5 text-[#16834B]" />
                <span>Daftar Isi Tas Siaga Bencana (Go-Bag 72 Jam)</span>
              </h3>
              <span className="text-xs font-bold text-[#16834B] bg-[#E8F5E9] px-3 py-1 rounded-full">
                Standar BNPB
              </span>
            </div>

            <p className="text-xs text-[#66766C]">
              Tas ransel tahan air yang disiapkan di dekat pintu keluar rumah untuk memenuhi kebutuhan bertahan hidup minimal 3 hari pertama pengungsian:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { title: "Surat & Dokumen Penting", desc: "KTP, KK, Ijazah, Surat Tanah dalam plastik kedap air" },
                { title: "Air Minum & Makanan Siap Saji", desc: "Air botol minimal 2 liter dan biskuit/makanan kaleng tahan lama" },
                { title: "Kotak P3K & Obat Khusus", desc: "Kasa, plester, betadine, obat diare, obat darah tinggi/asma keluarga" },
                { title: "Senter & Baterai Cadangan", desc: "Penerangan darurat saat listrik padam total di lokasi pengungsian" },
                { title: "Powerbank & Peluit Sinyal", desc: "Menjaga daya baterai ponsel dan peluit untuk memanggil regu penolong" },
                { title: "Pakaian Ganti & Selimut", desc: "Pakaian hangat, sarung, jas hujan, dan perlengkapan mandi dasar" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#25352D]">
                    <CheckCircle2 className="w-4 h-4 text-[#16834B] shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-[#66766C]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contacts Directory Card */}
      <div className="card-farm p-6 space-y-4">
        <div className="border-b border-[#E3EAE5] pb-3">
          <h3 className="text-base font-extrabold text-[#25352D] flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>Daftar Kontak Darurat Resmi Kabupaten Aceh Utara</span>
          </h3>
          <p className="text-xs text-[#66766C]">Nomor terverifikasi instansi penanggulangan bencana dan pelayanan publik</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyContacts.map((c, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#F4F7F5] border border-[#E3EAE5] space-y-1">
              <span className="text-[10px] text-[#66766C] block uppercase font-bold">{c.type}</span>
              <h4 className="text-xs font-extrabold text-[#25352D]">{c.agency}</h4>
              <p className="text-sm font-black text-[#0D653A] tracking-wider pt-1">{c.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
