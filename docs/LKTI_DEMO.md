# Skenario Presentasi & Demonstrasi LKTI (Durasi: ±5 Menit)

Panduan terstruktur bagi presenter dalam mendemonstrasikan prototipe inovasi **SIGAP Web GIS 1.0** di hadapan dewan juri Lomba Karya Tulis Ilmiah (LKTI).

---

## ⏱️ Alur Demonstrasi 5 Menit

### Menit 0:00 – 0:30 | Pembukaan & Identitas Inovasi (Halaman Landing `/`)
- **Tindakan**: Buka `http://localhost:5173/`. Tampilkan antarmuka pembuka dengan palet warna hijau-putih (*Farm2Table aesthetic*).
- **Narasi Presenter**:
  > *"Selamat pagi/siang Dewan Juri yang terhormat. Kami mempersembahkan SIGAP — Sistem Informasi Geospasial Ancaman Banjir untuk Kabupaten Aceh Utara. Dengan tagline 'Kenali Risiko, Siapkan Mitigasi', SIGAP hadir sebagai inovasi teknologi penunjang keputusan berbasis data geospasial asli dari BNPB InaRISK, BMKG, dan BPS Aceh Utara."*
- **Aksi**: Tekan tombol pill hijau **"Buka Dashboard Kebencanaan"**.

---

### Menit 0:30 – 1:15 | Dashboard Kebencanaan & Cuaca Real-Time (`/dashboard`)
- **Tindakan**: Soroti kartu metrik statistik (5 Kecamatan Bahaya Tinggi, 14 Sedang, 8 Rendah, serta total 614.640 penduduk terdata BPS).
- **Narasi Presenter**:
  > *"Pada dashboard utama, kita dapat melihat sintesis situasi kebencanaan. Terdapat prakiraan cuaca real-time dari BMKG Stasiun Meteorologi Lhoksukon, riwayat 6 kejadian banjir besar yang pernah merendam Aceh Utara dari DIBI BNPB, serta nomor siaga darurat Pusdalops BPBD Aceh Utara (0645) 31113."*

---

### Menit 1:15 – 2:30 | Peta Interaktif Web GIS & Pencarian Wilayah (`/map`)
- **Tindakan**: Buka menu **Peta Bahaya Banjir**.
  1. Tunjukkan batas administratif Kabupaten Aceh Utara dan 27 kecamatan.
  2. Buka search bar di atas, ketik **"Matangkuli"**, lalu klik hasil pencarian.
  3. Tunjukkan popup informasi yang muncul: Kategori Bahaya Tinggi, Elevasi 6–15 mdpl, Kemiringan lereng datar (0–2%), Sungai: Krueng Keureuto, Pirak, dan Peuto.
  4. Uji filter layer di sisi kiri: sembunyikan/tampilkan layer Jaringan Sungai biru dan Titik Evakuasi hijau.
  5. Geser slider transparansi layer untuk melihat basemap OpenStreetMap di baliknya.
- **Narasi Presenter**:
  > *"Peta Web GIS ini memvisualisasikan poligon asli 27 kecamatan yang telah dioptimalkan secara matematis menggunakan Turf.js. Ketika salah satu kecamatan seperti Matangkuli diklik, sistem menyajikan faktor fisik penyebab banjir secara transparan tanpa angka buatan."*

---

### Menit 2:30 – 3:30 | Fitur Unggulan: "Periksa Lokasi Saya" (Point-in-Polygon)
- **Tindakan**: Tekan tombol pill hijau **"Periksa Lokasi Saya"** pada header.
  - *Skenario A (GPS Fisik Aktif)*: Klik tombol **"Deteksi Posisi GPS Saya Sekarang"**.
  - *Skenario B (Di Luar Lokasi / Evaluator Mode)*: Klik tombol preset pengujian LKTI **"Lhoksukon (Pusat Ibukota)"** atau **"Matangkuli"**.
- **Hasil yang Ditampilkan**:
  - Sistem melakukan kalkulasi *point-in-polygon* instan.
  - Menampilkan nama kecamatan yang teridentifikasi, tingkat bahaya resmi InaRISK, dan **3 titik posko evakuasi terdekat** lengkap dengan jarak kilometer (cth: Meunasah Dayah Babussalam, 0.8 km).
  - Tampilkan penafian keselamatan (safety disclaimer).
- **Narasi Presenter**:
  > *"Fitur unggulan 'Periksa Lokasi Saya' memungkinkan masyarakat secara instan mengetahui zona bahaya tempat mereka berdiri dan langsung mendapatkan rekomendasi posko pengungsian terdekat yang telah diverifikasi kelayakannya oleh BPBD."*

---

### Menit 3:30 – 4:15 | Jalur Evakuasi & Direktori Fasilitas (`/evacuation` & `/facilities`)
- **Tindakan**: Buka menu **Jalur & Titik Evakuasi**.
  1. Tunjukkan daftar posko resmi seperti Gedung Serbaguna Landing (daya tampung 2.500 jiwa) dan Masjid Agung Baiturrahim Lhoksukon (1.200 jiwa).
  2. Tunjukkan peringatan keselamatan navigasi: rute jalan harus diverifikasi petugas karena genangan air dapat menutup jalan raya nasional.

---

### Menit 4:15 – 5:00 | Sistem Pelaporan Masyarakat & Verifikasi Petugas (`/reports/new` & `/admin/reports`)
- **Tindakan**:
  1. Buka **Formulir Lapor Banjir** (`/reports/new`). Isi contoh laporan: Kecamatan Lhoksukon, Gampong Ceumpeudak, Ketinggian 60 cm. Klik **Kirim Laporan**.
  2. Perlihatkan tiket laporan berhasil dengan status *"Menunggu Verifikasi"*.
  3. Gunakan tombol **Role Switcher** di sidebar atau buka `/admin/reports`. Masuk ke antrean verifikasi petugas.
  4. Klik tombol hijau **"Verifikasi"** pada laporan yang baru dibuat.
  5. Kembali ke daftar laporan publik (`/reports`) dan tunjukkan bahwa statusnya kini telah resmi berubah menjadi *"Diverifikasi BPBD"*.
- **Narasi Penutup**:
  > *"Alur verifikasi ini memastikan laporan warga tidak menimbulkan hoaks atau kepanikan liar. Dengan perpaduan data resmi pemerintah, partisipasi masyarakat, dan arsitektur Web GIS yang ringan, SIGAP siap menjadi solusi nyata mitigasi banjir di Kabupaten Aceh Utara. Terima kasih."*

---

## 🛡️ Skenario Alternatif (Jika Internet / GPS Terbatas)
1. **Jika GPS Perangkat Tidak Aktif atau Izin Ditolak**:
   - Manfaatkan tombol preset uji coba LKTI yang telah disediakan di modal (*Lhoksukon, Matangkuli, Samudera, Sawang*). Sistem tetap menjalankan kalkulasi matematis geospasial asli.
2. **Jika Koneksi API BMKG Lambat**:
   - Sistem secara otomatis mengaktifkan mekanisme *fallback caching* stasiun meteorologi Malikussaleh tanpa memunculkan pesan error di layar.
