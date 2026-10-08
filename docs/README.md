# SIGAP — Sistem Informasi Geospasial Ancaman Banjir 1.0
### Kabupaten Aceh Utara, Provinsi Aceh, Indonesia
*Tagline: "Kenali Risiko, Siapkan Mitigasi."*

Inovasi Teknologi Berbasis Web GIS untuk Lomba Karya Tulis Ilmiah (LKTI).

---

## 📌 Ringkasan Proyek
**SIGAP** adalah Progressive Web Application (PWA) berbasis Web GIS yang dibangun untuk memvisualisasikan peta bahaya banjir, menganalisis faktor-faktor penyebab geografis, memetakan fasilitas evakuasi pengungsian, dan mendukung pelaporan berbasis masyarakat di **Kabupaten Aceh Utara**.

### ✨ Nilai Integritas Ilmiah:
Aplikasi ini **100% menggunakan data geografis asli** Kabupaten Aceh Utara yang diperoleh langsung dari:
- **BNPB InaRISK** (Batas administrasi resmi 27 kecamatan & Indeks Bahaya Banjir)
- **Badan Informasi Geospasial (BIG)** (DEMNAS Elevasi Nasional)
- **BMKG** (Prakiraan cuaca berbasis wilayah tingkat IV)
- **Badan Pusat Statistik (BPS)** (Statistik kependudukan Kabupaten Aceh Utara 2024)
- **OpenStreetMap** (Jaringan sungai Krueng Keureuto, Krueng Pase, dll)
- **BPBD Kabupaten Aceh Utara** (Catatan banjir historis 2019–2023 & Rencana Kontinjensi)

---

## 🛠️ Teknologi yang Digunakan
- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (Aestetika Farm2Table: Hijau-Putih, Pill Buttons, Rounded Cards)
- **GIS & Mapping**: Leaflet.js, React Leaflet, Turf.js (Operasi geospasial point-in-polygon)
- **Visualisasi Data**: Recharts
- **Database & Backend**: Supabase (PostgreSQL + PostGIS), Row Level Security (RLS)
- **Validasi & Formulir**: Zod, React Hook Form
- **Pengujian**: Vitest, React Testing Library

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal

### 1. Prasyarat Sistem
- Node.js versi 18.0 atau lebih tinggi (Direkomendasikan Node 20+)
- npm versi 9.0 atau lebih tinggi

### 2. Kloning & Pemasangan Dependensi
```bash
cd c:\laragon\www\SIGAP
npm install
```

### 3. Konfigurasi Lingkungan (Opsional)
Salin berkas `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
*Catatan: Aplikasi telah dilengkapi mekanisme data store lokal otomatis jika kredensial Supabase belum diisi, sehingga seluruh fungsi peta, pelaporan, dan verifikasi langsung berjalan tanpa konfigurasi rumit.*

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban (browser) di tautan: **`http://localhost:5173/`**

### 5. Menjalankan Pengujian Otomatis
```bash
npm run test
```

### 6. Build Produksi
```bash
npm run build
npm run preview
```

---

## 📁 Struktur Folder Proyek
```
SIGAP/
├── docs/                     # Dokumentasi Resmi LKTI
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── DATA_SOURCES.md
│   ├── GIS_METHODOLOGY.md
│   ├── DATABASE.md
│   ├── FEATURES.md
│   ├── TESTING.md
│   ├── LKTI_DEMO.md
│   └── LIMITATIONS.md
├── public/
│   ├── data/                 # Dataset Asli GeoJSON & JSON Aceh Utara
│   │   ├── aceh-utara-boundary.geojson
│   │   ├── kecamatan.geojson
│   │   ├── rivers.geojson
│   │   ├── facilities.geojson
│   │   ├── evacuation-points.geojson
│   │   ├── kecamatan-indicators.json
│   │   ├── flood-events.json
│   │   └── data-sources-meta.json
│   └── logo.svg              # Brand Logo SIGAP
├── scripts/
│   └── geospatial/           # Skrip pipeline akuisisi data GIS InaRISK/OSM
├── src/
│   ├── components/
│   │   ├── charts/           # Grafik Recharts
│   │   ├── layout/           # Sidebar, Header, BottomNav, StatusBanner
│   │   ├── map/              # FloodMap, MapLegend, LayerControls, LocationChecker
│   │   └── ui/               # Komponen antarmuka reusable
│   ├── context/              # AppContext (Role, filter layer, simulasi)
│   ├── pages/                # 18 Halaman aplikasi SIGAP
│   ├── services/             # dataService, BMKG API, InaRISK identify
│   ├── types/                # Definisi tipe TypeScript
│   ├── App.tsx               # Konfigurasi routing
│   ├── index.css             # Desain sistem Tailwind v4
│   └── main.tsx
├── supabase/
│   └── migrations/           # Skema PostGIS & RLS
└── tests/                    # Pengujian otomatis Vitest
```
