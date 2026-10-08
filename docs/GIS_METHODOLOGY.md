# Metodologi Pengolahan GIS, Klasifikasi, dan Analisis Spasial

## 1. Pembedaan Konseptual: Peta Bahaya (Hazard) vs Peta Risiko (Risk)

Salah satu kelemahan umum dalam sistem informasi kebencanaan adalah menyamakan istilah **Bahaya (Hazard)** dengan **Risiko (Risk)**. Dalam SIGAP 1.0, perbedaan ini didefinisikan secara tegas sesuai kerangka ilmiah kebencanaan (UNISDR / BNPB Perka No. 02/2012):

### A. Bahaya Banjir (Flood Hazard)
- **Definisi**: Potensi intensitas, frekuensi, dan luas genangan fenomena fisik air yang dapat menimbulkan ancaman bahaya bagi kehidupan manusia dan lingkungan.
- **Faktor Pembentuk**:
  1. Elevasi topografi (ketinggian permukaan tanah terhadap muka air laut).
  2. Kemiringan lereng (slope gradient).
  3. Curah hujan harian kumulatif dan debit puncak aliran sungai.
  4. Geomorfologi dan jarak dari bantaran sungai utama.
- **Status di SIGAP 1.0**: **Tersedia Lengkap & Terverifikasi**. Indeks bahaya banjir diambil langsung dari peta resmi InaRISK BNPB.

### B. Risiko Banjir (Flood Risk)
- **Definisi**: Estimasi besarnya kerugian (jiwa, ekonomi, infrastruktur) akibat interaksi antara bahaya dan kondisi kerentanan masyarakat, yang dirumuskan secara matematis sebagai:
  $$\text{Risiko} = \frac{\text{Bahaya} \times \text{Kerentanan}}{\text{Kapasitas}}$$
  - **Kerentanan (Vulnerability)**: Kepadatan penduduk rentan (anak-anak/lansia), kemiskinan, jenis material rumah, dan fasilitas publik yang terpapar.
  - **Kapasitas (Capacity)**: Kesiapan sistem peringatan dini, tanggul banjir, jalur evakuasi, dan sumber daya logistik BPBD.
- **Status di SIGAP 1.0**: Karena data kerentanan fisik tingkat mikro per-persil bangunan gampong belum sepenuhnya diintegrasikan oleh satu data nasional, aplikasi menampilkan **Peta Bahaya Banjir** secara eksplisit pada modul peta utama dan menyajikan indikator demografi kerentanan secara terpisah pada modul analisis, guna **mencegah kalkulasi indeks komposit fiktif** yang tidak tervalidasi secara empiris.

---

## 2. Klasifikasi Tingkat Bahaya di Kabupaten Aceh Utara

Berdasarkan analisis geomorfologi dan data InaRISK BNPB, 27 kecamatan di Aceh Utara diklasifikasikan ke dalam 3 zona:

| Tingkat Bahaya | Jumlah Kec. | Karakteristik Wilayah | Contoh Kecamatan |
|---|---|---|---|
| **Tinggi** (Merah) | 5 | Dataran rendah alluvial (<15 mdpl), lereng datar (0–2%), bantaran pertemuan 3 sungai (Krueng Keureuto, Pirak, Peuto). Tergenang rutin tahunan >1x dengan TMA 80–200 cm. | Matangkuli, Pirak Timur, Lhoksukon, Tanah Luas, Baktiya |
| **Sedang** (Kuning) | 14 | Dataran transisi (15–30 mdpl) dan kawasan pesisir rawan pasang laut (rob). Tergenang periodik 2–5 tahunan. | Samudera, Syamtalira Aron, Meurah Mulia, Cot Girek, Langkahan, Dewantara |
| **Rendah** (Hijau) | 8 | Wilayah hulu perbukitan dan kaki pegunungan (>30–500 mdpl), lereng bergelombang hingga terjal (>15%). Air mengalir cepat tanpa genangan luas. | Sawang, Nisam Antara, Geuredong Pase, Paya Bakong (kawasan Waduk), Kuta Makmur |

---

## 3. Alur Algoritma Fitur "Periksa Lokasi Saya"

Fitur ini berjalan secara deterministik di sisi klien dengan alur berikut:
1. **Ekstraksi Koordinat**: Browser memicu `navigator.geolocation.getCurrentPosition()`.
2. **Boundary Geofencing**:
   $$\text{isInsideAcehUtara} = \text{turf.booleanPointInPolygon}(\text{Point}(lng, lat), \text{Polygon}_{\text{Aceh Utara}})$$
   - Jika `false`, aplikasi memberikan notifikasi bahwa titik berada di luar cakupan Aceh Utara tanpa memberikan kesimpulan palsu.
3. **Identifikasi Kecamatan**:
   - Jika `true`, iterasi 27 poligon kecamatan untuk menentukan nama kecamatan tempat titik berada.
4. **Kalkulasi Titik Evakuasi Terdekat**:
   - Menggunakan formula Haversine (`turf.distance`) untuk menghitung jarak lurus ke 10 titik posko evakuasi terverifikasi dan mengurutkan 3 shelter terdekat.
5. **Penafian Keselamatan (Safety Disclaimer)**:
   - Sistem selalu menegaskan bahwa hasil penapisan adalah sistem pendukung keputusan dan bukan jaminan bebas bahaya jika terjadi debit banjir ekstrem.
