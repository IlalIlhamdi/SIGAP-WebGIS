import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ShieldAlert, FileText, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: "Kenali Potensi Bahaya Wilayah Anda",
      desc: "Akses peta interaktif yang memvisualisasikan batas administrasi 27 kecamatan di Kabupaten Aceh Utara berdasarkan data resmi BNPB InaRISK. Ketahui elevasi, kemiringan lereng, dan indeks bahaya secara transparan.",
      icon: Map,
      accent: "bg-[#E8F5E9] text-[#16834B]"
    },
    {
      step: 2,
      title: "Akses Lokasi & Jalur Evakuasi Terverifikasi",
      desc: "Temukan lokasi pengungsian terverifikasi BPBD Aceh Utara seperti Gedung Serbaguna Landing, Masjid Agung Baiturrahim Lhoksukon, dan Meunasah berdaya tampung besar dengan informasi fasilitas darurat yang lengkap.",
      icon: ShieldAlert,
      accent: "bg-emerald-50 text-emerald-700"
    },
    {
      step: 3,
      title: "Laporkan Kejadian & Dukung Keputusan",
      desc: "Masyarakat dapat berpartisipasi melaporkan genangan banjir dengan koordinat GPS dan estimasi tinggi genangan. Seluruh laporan masuk ke antrean verifikasi petugas BPBD sebelum ditampilkan.",
      icon: FileText,
      accent: "bg-blue-50 text-blue-700"
    }
  ];

  const current = steps[step - 1];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col justify-between p-6">
      <div className="max-w-md mx-auto w-full pt-4 flex items-center justify-between">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
          className="w-9 h-9 rounded-full bg-white border border-[#E3EAE5] flex items-center justify-center text-[#25352D]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-[#66766C]">Langkah {step} dari 3</span>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-bold text-[#16834B] hover:underline"
        >
          Lewati
        </button>
      </div>

      <div className="max-w-md mx-auto w-full my-auto py-8 text-center space-y-6">
        <div className={`w-24 h-24 mx-auto rounded-3xl ${current.accent} flex items-center justify-center shadow-lg border-2 border-white`}>
          <Icon className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-[#0D653A] leading-tight">
            {current.title}
          </h2>
          <p className="text-sm text-[#66766C] leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-[#16834B]' : 'w-2 bg-[#E3EAE5]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto w-full pb-4">
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-3.5 text-sm shadow-md"
          >
            <span>Lanjutkan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/dashboard')}
            className="pill-btn w-full bg-[#16834B] hover:bg-[#0D653A] text-white py-3.5 text-sm shadow-md"
          >
            <span>Mulai Gunakan SIGAP</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
