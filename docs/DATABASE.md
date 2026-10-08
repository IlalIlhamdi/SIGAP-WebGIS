# Desain & Arsitektur Database SIGAP Web GIS 1.0

## 1. Engine & Ekstensi
- **Database Engine**: PostgreSQL 15+
- **Spasial Engine**: PostGIS 3.3+ (Menyimpan koordinat titik dan geometri poligon dalam format spasial WGS84 EPSG:4326)
- **Otentikasi & Storage**: Supabase Auth (JWT) & Supabase Storage (Foto Bukti Pelaporan Banjir)

---

## 2. Struktur Tabel Relasional

### A. `administrative_areas`
Menyimpan batas poligon Kabupaten dan 27 Kecamatan.
- `id` (VARCHAR PK)
- `official_code` (VARCHAR UNIQUE, cth: '11.08', '1111110')
- `name` (VARCHAR)
- `area_type` (VARCHAR CHECK: 'KABUPATEN', 'KECAMATAN', 'GAMPONG')
- `parent_id` (FK ke administrative_areas)
- `area_km2` (NUMERIC)
- `geom` (GEOMETRY(MultiPolygon, 4326))
- `source_id` (FK ke data_sources)

### B. `flood_hazard`
Menyimpan indeks bahaya resmi InaRISK per wilayah.
- `id` (UUID PK)
- `area_id` (FK ke administrative_areas)
- `hazard_class` (VARCHAR CHECK: 'Tinggi', 'Sedang', 'Rendah', 'Belum Tersedia')
- `hazard_score` (NUMERIC 0.000–1.000)
- `elevation_range` (VARCHAR)
- `slope_class` (VARCHAR)
- `rainfall_annual_mm` (INT)
- `methodology` (TEXT)
- `observation_year` (INT)

### C. `evacuation_points`
Menyimpan lokasi posko pengungsian terverifikasi BPBD.
- `id` (VARCHAR PK)
- `name` (VARCHAR)
- `area_id` (FK ke administrative_areas)
- `location` (GEOMETRY(Point, 4326))
- `address` (TEXT)
- `capacity_persons` (INT)
- `facility_type` (VARCHAR)
- `elevation_m` (INT)
- `facilities_available` (TEXT[])
- `verification_status` (VARCHAR DEFAULT 'TERVERIFIKASI')

### D. `flood_reports`
Menyimpan pelaporan kejadian banjir dari warga.
- `id` (UUID PK)
- `report_code` (VARCHAR UNIQUE, format: LAP-ACUT-YYYY-XXX)
- `reporter_name` (VARCHAR)
- `reporter_phone` (VARCHAR, privat untuk petugas)
- `area_id` (FK ke administrative_areas)
- `gampong` (VARCHAR)
- `location_detail` (TEXT)
- `reported_location` (GEOMETRY(Point, 4326))
- `event_time` (TIMESTAMPTZ)
- `water_depth_cm` (INT)
- `description` (TEXT)
- `photo_path` (TEXT)
- `status` (VARCHAR CHECK: 'Menunggu Verifikasi', 'Diverifikasi', 'Ditolak', 'Ditindaklanjuti')
- `verified_by` (UUID)
- `verified_at` (TIMESTAMPTZ)

---

## 3. Kebijakan Row Level Security (RLS)
1. **Akses Publik (Read Only)**: Masyarakat umum hanya dapat membaca data wilayah resmi, posko evakuasi, fasilitas publik, dan laporan yang telah berstatus `Diverifikasi` atau `Ditindaklanjuti`.
2. **Pengiriman Laporan (Insert Public)**: Masyarakat dapat mengirimkan formulir laporan tanpa wajib mendaftar akun demi efisiensi saat kondisi darurat bencana.
3. **Penyembunyian Data Sensitif (Privacy Protection)**: Kolom nomor telepon dan identitas pribadi pelapor disembunyikan dari query publik via view/RLS.
4. **Verifikasi Petugas (Update RBAC)**: Hanya profil dengan role `officer` atau `admin` yang dapat memperbarui kolom status verifikasi pada tabel `flood_reports`.
