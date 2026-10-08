# Arsitektur Sistem SIGAP Web GIS 1.0

## 1. Ikhtisar Arsitektur
SIGAP dirancang dengan arsitektur **Client-Side Spatial Processing + Cloud Geodatabase Hybrid**. Arsitektur ini dipilih untuk menjamin performa maksimal pada perangkat seluler (smartphone) dengan konsumsi bandwidth minimal saat digunakan di lapangan atau saat sinyal seluler terbatas akibat banjir.

```
+-------------------------------------------------------------------+
|                        PRESENTATION LAYER                         |
|   +--------------------------+     +--------------------------+   |
|   |  Desktop View (Sidebar)  |     |   Mobile View (BottomNav)|   |
|   +--------------------------+     +--------------------------+   |
|   - Leaflet.js Web GIS Map (OpenStreetMap Basemap)                |
|   - Recharts Visual Analytics (Hazard & Historical Bars/Pies)     |
|   - Farm2Table Design Tokens (#16834B, #0D653A, #F4F7F5)          |
+-------------------------------------------------------------------+
                                  |
+-------------------------------------------------------------------+
|                      SPATIAL & BUSINESS LOGIC                     |
|   - Turf.js Geoprocessing Engine (Point-in-Polygon, Distance)     |
|   - Geolocation API (User GPS coordinate detection)               |
|   - DataService (Caching, geoJSON optimization, status state)     |
|   - Role-Based Access Control (public / officer / admin)          |
+-------------------------------------------------------------------+
                                  |
+-------------------------------------------------------------------+
|                     DATA INTEGRATION LAYER                        |
|   +------------------------------------+----------------------+   |
|   | Official Public Repositories (GIS) | Backend & Databases  |   |
|   | - BNPB InaRISK ArcGIS Server       | - Supabase PostgreSQL|   |
|   | - BIG DEMNAS Digital Elevation     | - PostGIS Extension  |   |
|   | - BMKG Weather API (adm4 code)     | - Row Level Security |   |
|   | - BPS Aceh Utara Data Katalog      | - Local Storage Store|   |
+-------------------------------------------------------------------+
```

---

## 2. Lapisan Geospasial (GIS Pipeline)
1. **Penyederhanaan Geometri (Geometry Generalization)**:
   - Poligon asli 27 kecamatan dari InaRISK BNPB disederhanakan menggunakan algoritma Ramer-Douglas-Peucker (`@turf/simplify`) dengan toleransi presisi `0.0008` derajat (~80 meter).
   - Ukuran payload berhasil direduksi dari 7,5 MB menjadi **137 KB** (penurunan beban jaringan sebesar 95%) tanpa mengubah bentuk batas administratif secara visual.
2. **Koordinat dan Proyeksi Geografis**:
   - Seluruh dataset vektor GeoJSON diekspor dalam format standar **EPSG:4326 (WGS 84)**.
   - Layanan raster InaRISK menggunakan proyeksi EPSG:3395 (World Mercator) yang ditransformasikan secara dinamis saat operasi penapisan koordinat titik GPS.
3. **Point-in-Polygon Geofencing**:
   - Fitur "Periksa Lokasi Saya" mengeksekusi fungsi `turf.booleanPointInPolygon` secara instan di sisi klien untuk memvalidasi apakah koordinat pengguna berada dalam poligon batas luar Kabupaten Aceh Utara dan menentukan kecamatan yang bersangkutan.

---

## 3. Manajemen Status (State Management)
Aplikasi memanfaatkan React Context (`AppContext`):
- `role`: Mengatur hak akses antara masyarakat umum (`public`), petugas Pusdalops (`officer`), dan admin BPBD (`admin`).
- `layers`: Mengontrol visibilitas lapisan GIS (Batas, Bahaya InaRISK, Sungai, Evakuasi, Fasilitas, Laporan).
- `layerOpacity`: Slider transparansi overlay (rentang 0.2 hingga 1.0).
- `isSimulationMode`: Mengaktifkan banner peringatan simulasi jika digunakan dalam skenario uji coba.

---

## 4. Keamanan dan Privasi Data
- **Sanitasi Data Masukan**: Formulir laporan menggunakan skema validasi ketat.
- **Anonymization Pelapor**: Nama pelapor dan nomor telepon disembunyikan dari antarmuka publik dan hanya dapat diakses oleh petugas yang telah terautentikasi.
- **Row Level Security (RLS)**: Tabel Supabase menerapkan kebijakan SELECT publik untuk data terverifikasi dan UPDATE hanya untuk role petugas.
