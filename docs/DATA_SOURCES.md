# Sumber Data Resmi & Metadata Geospasial SIGAP 1.0

Dokumen ini memuat catatan lengkap metadata dataset resmi yang digunakan dalam pengembangan aplikasi SIGAP Web GIS Kabupaten Aceh Utara.

---

## 1. Katalog Dataset Resmi

### A. Batas Administrasi Kabupaten & Kecamatan Aceh Utara
- **Instansi**: Badan Nasional Penanggulangan Bencana (BNPB) & Badan Informasi Geospasial (BIG)
- **URL Layanan**: `https://gis.bnpb.go.id/server/rest/services/inarisk/batas_administrasi/MapServer`
  - Layer 2: Batas Kabupaten (`KDPKAB = '11.08'`, `WADMKK = 'Aceh Utara'`)
  - Layer 3: Batas Kecamatan (27 fitur kecamatan di Aceh Utara)
- **Tahun Rujukan**: 2021/2022
- **Sistem Koordinat (CRS)**: Asal SRGI 2013, ditransformasi ke EPSG:4326 (WGS 84)
- **Lisensi**: Data Terbuka Pemerintah Republik Indonesia (UU Informasi Geospasial No. 4/2011)
- **Status**: **TERVERIFIKASI**

### B. Indeks Bahaya Banjir (INDEKS_BAHAYA_BANJIR)
- **Instansi**: BNPB — Portal InaRISK
- **URL Layanan**: `https://gis.bnpb.go.id/server/rest/services/inarisk/INDEKS_BAHAYA_BANJIR/ImageServer`
- **Tipe Data**: Data Raster Resolusi Spasial 100m × 100m
- **Cakupan**: Seluruh wilayah daratan Indonesia termasuk Kabupaten Aceh Utara
- **Sistem Koordinat (CRS)**: EPSG:3395 (World Mercator)
- **Metode**: Pemodelan genangan hidrologi debit rancangan 25-tahunan dikombinasikan dengan kemiringan lereng dan geomorfologi dataran banjir.
- **Status**: **TERVERIFIKASI**

### C. Data Kependudukan & Luas Wilayah
- **Instansi**: Badan Pusat Statistik (BPS) Kabupaten Aceh Utara
- **Publikasi**: *Kabupaten Aceh Utara Dalam Angka 2024*
- **URL**: `https://acehutarakab.bps.go.id/`
- **Data yang Diambil**:
  - Jumlah penduduk total (614.640 jiwa)
  - Kepadatan penduduk per km² di 27 kecamatan
  - Luas daratan administratif per kecamatan
- **Status**: **TERVERIFIKASI**

### D. Prakiraan Cuaca Berbasis Wilayah
- **Instansi**: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)
- **Endpoint API**: `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={kode_wilayah}`
- **Kode Wilayah Digunakan**: `11.08.04.2001` (Ibukota Lhoksukon, Aceh Utara)
- **Parameter**: Suhu udara (°C), kelembaban (%), kecepatan dan arah angin, deskripsi kondisi cuaca 3 harian.
- **Status**: **TERVERIFIKASI**

### E. Jaringan Hidrologi & Sungai
- **Instansi**: OpenStreetMap Contributors
- **Query Overpass**: `way["waterway"="river"](4.75, 96.78, 5.25, 97.55);`
- **Atribut**: Sungai utama Krueng Keureuto, Krueng Pase, Krueng Pirak, Krueng Peuto, Krueng Jambo Aye, Krueng Sawang, Krueng Nisam.
- **Lisensi**: Open Database License (ODbL) 1.0
- **Status**: **TERVERIFIKASI**

### F. Catatan Historis & Titik Evakuasi Bencana
- **Instansi**: Badan Penanggulangan Bencana Daerah (BPBD) Kabupaten Aceh Utara & DIBI BNPB
- **Dokumen Sumber**: *Laporan Kejadian Bencana Pusdalops BPBD Aceh Utara (2019–2023)* dan *Rencana Kontinjensi Bencana Banjir Kabupaten Aceh Utara*.
- **Data yang Diambil**:
  - Riwayat banjir besar (Desember 2023, Januari 2023, Oktober 2022, Januari 2022, Desember 2020, November 2019)
  - 10 Titik lokasi posko evakuasi utama terverifikasi (Masjid, Meunasah, GOR, Gedung Serbaguna Landing).
- **Status**: **TERVERIFIKASI**
