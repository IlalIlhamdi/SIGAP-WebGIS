# Batasan Sistem & Keterbatasan Ilmiah Data (System Limitations)

Sebagai bagian dari kejujuran dan etika penelitian karya tulis ilmiah (LKTI), dokumen ini menguraikan batasan teknis dan batasan data dari prototipe **SIGAP Web GIS 1.0**.

---

## 1. Keterbatasan Data Geospasial
1. **Resolusi Raster Indeks Bahaya**:
   - Peta indeks bahaya banjir bersumber dari InaRISK BNPB dengan resolusi raster 100m × 100m (skala tinjauan 1:50.000). Resolusi ini sangat baik untuk perencanaan tingkat kecamatan dan kawasan daerah aliran sungai (DAS), namun belum cukup detail untuk pemetaan mikro setingkat batas persil pekarangan rumah perorangan.
2. **Ketiadaan Data Kerentanan Fisik Bangunan Tingkat Gampong**:
   - Meskipun data demografi BPS tersedia lengkap di tingkat kecamatan (27 kecamatan), data spesifik mengenai tipe konstruksi bangunan (panggung kayu vs permanen beton) di seluruh 852 gampong di Aceh Utara belum tersedia secara seragam dalam satu basis data spasial terbuka.
3. **Pembedaan Peta Bahaya vs Peta Risiko**:
   - Peta utama SIGAP adalah **Peta Bahaya Banjir (Flood Hazard Map)**. Pembuatan peta risiko terintegrasi penuh membutuhkan survei kerentanan sosial-ekonomi mikro yang belum seluruhnya terakomodasi dalam prototipe versi 1.0.

---

## 2. Keterbatasan Sensor & Pemantauan Real-Time
1. **Bukan Sistem Sensor IoT Otomatis**:
   - Status kenaikan air saat ini masih mengandalkan laporan berjenjang Pusdalops BPBD Aceh Utara dan partisipasi pelaporan masyarakat, belum terhubung secara otomatis ke sensor telemetri Automatic Water Level Recorder (AWLR) di pintu air Krueng Keureuto.
2. **Ketergantungan Navigasi Rute Aman**:
   - Fitur petunjuk arah ke posko evakuasi menggunakan integrasi rute peta eksternal. Karena ketinggian air genangan di badan jalan dapat berubah drastis dalam hitungan jam, rute aplikasi tidak boleh diklaim sebagai jalur yang 100% bebas banjir tanpa arahan petugas evakuasi di posko lapangan.

---

## 3. Peta Jalan Pengembangan Masa Depan (Future Roadmap)
- [ ] Integrasi sensor telemetri ketinggian air (IoT AWLR) di Daerah Aliran Sungai Krueng Keureuto dan Krueng Pase.
- [ ] Integrasi radar cuaca citra satelit Himawari-9 / C-Band BMKG.
- [ ] Pemodelan hidrodinamika 2D (HEC-RAS 2D) untuk simulasi sebaran genangan saat tanggul sungai jebol.
- [ ] Sistem notifikasi WhatsApp Gateway otomatis peringatan bahaya banjir bagi keuchik (kepala desa) dan camat.
