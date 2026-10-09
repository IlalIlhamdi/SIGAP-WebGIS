# Panduan Pengembangan & Rilis Android SIGAP (Capacitor)

Dokumen ini menjelaskan arsitektur, konfigurasi lingkungan, alur kerja pengembangan, serta prosedur pembuatan APK dan Android App Bundle (AAB) bertanda tangan untuk aplikasi **SIGAP — Sistem Informasi Geospasial Ancaman Banjir Kabupaten Aceh Utara**.

---

## 1. Ringkasan Arsitektur & Identitas Aplikasi

Aplikasi Android SIGAP dibangun menggunakan arsitektur hybrid modern:
- **Frontend Core**: React 19 + TypeScript + Vite + Tailwind CSS (Farm2Table Clean Green tokens: `#16834B`, `#0D653A`, `#F4F7F5`).
- **Engine Spasial**: Leaflet.js (dibundel lokal tanpa CDN eksternal) dan Turf.js untuk pemrosesan geospasial *client-side* (*Point-in-Polygon* & penentuan posko evakuasi terdekat).
- **Native Bridge**: Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/app`, `@capacitor/geolocation`, `@capacitor/camera`, `@capacitor/network`, `@capacitor/status-bar`).
- **Database & Storage Cloud**: Supabase PostgreSQL + PostGIS (dengan mekanisme *offline-first fallback* dan view proteksi privasi).

### Identitas Aplikasi:
| Parameter | Nilai Konfigurasi | Lokasi Berkas |
| :--- | :--- | :--- |
| **Nama Aplikasi** | `SIGAP` | `android/app/src/main/res/values/strings.xml` & `capacitor.config.ts` |
| **Package Name / App ID** | `id.sigap.acehutara` | `android/app/build.gradle` & `capacitor.config.ts` |
| **Version Name** | `1.0.0` | `android/app/build.gradle` |
| **Version Code** | `1` | `android/app/build.gradle` |
| **Web Build Dir** | `dist` | `capacitor.config.ts` |
| **Bahasa Utama** | Bahasa Indonesia (`id`) | `android/app/src/main/AndroidManifest.xml` & `index.html` |
| **Target SDK / Compile SDK**| `36` (Android 16 / 15 kompatibel) | `android/variables.gradle` |
| **Minimum SDK** | `24` (Android 7.0 Nougat+) | `android/variables.gradle` |

---

## 2. Prasyarat Lingkungan Pengembangan

Untuk membuka proyek di Android Studio dan mengompilasi APK/AAB:
1. **Node.js**: v20.x atau v24.x LTS (Proyek telah diverifikasi dengan Node.js v24.19.0).
2. **Java Development Kit (JDK)**: JDK 21 LTS atau JDK 17 (Rekomendasi: Microsoft OpenJDK 21 atau Eclipse Adoptium Temurin 21).
   > *Catatan*: Hindari menjalankan Gradle daemon menggunakan JDK 25 (preview) karena pustaka Groovy bawaan Gradle belum mendukung class version 69.
3. **Android Studio**: Android Studio Koala / Ladybug / Meerkat atau yang lebih baru.
4. **Android SDK Tools**:
   - SDK Platform: `android-34`, `android-35`, atau `android-36`.
   - Build Tools: `34.0.0`, `35.0.0`, atau `36.0.0`.
   - Android SDK Command-line Tools & Platform-tools (`adb`).
5. **Path Android SDK**:
   Secara baku berlokasi di `%LOCALAPPDATA%\Android\Sdk` dan telah dikonfigurasi pada `android/local.properties`:
   ```properties
   sdk.dir=C\:/Users/ASUS/AppData/Local/Android/Sdk
   ```

---

## 3. Konfigurasi Environment Tanpa Membocorkan Kunci Rahasia

Salin `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Contoh konfigurasi aman sisi klien:
```env
VITE_APP_TITLE=SIGAP Aceh Utara
VITE_APP_VERSION=1.0.0

# Kredensial Supabase Publik (HANYA Anon Key yang memiliki batas akses RLS)
VITE_SUPABASE_URL=https://proyek-anda.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# API Eksternal
VITE_BMKG_API_URL=https://api.bmkg.go.id/publik/prakiraan-cuaca
VITE_INARISK_GIS_URL=https://gis.bnpb.go.id/server/rest/services/inarisk
```

> [!CAUTION]
> **PENTING TENTANG KEAMANAN KUNCI:**
> - **JANGAN PERNAH** memasukkan `service_role_key`, kredensial database admin, atau token rahasia ke dalam file `.env` atau kode bundle React.
> - Kredensial anon key aman digunakan di sisi klien karena izin baca/tulis dibatasi ketat oleh Row Level Security (RLS) PostgreSQL.
> - Jika kredensial Supabase tidak diatur, aplikasi SIGAP secara otomatis beralih ke mode offline terverifikasi menggunakan arsip data lokal di `public/data/`.

---

## 4. Alur Kerja Pengembangan (Workflow)

Semua script workflow telah ditambahkan ke `package.json`:

```bash
# 1. Jalankan development server web
npm run dev

# 2. Jalankan pengujian unit & integrasi data spasial
npm run test

# 3. Lakukan build web dan sinkronisasi ke direktori android/
npm run cap:sync

# 4. Buka proyek Android langsung di Android Studio
npm run cap:open

# 5. Jalankan aplikasi ke emulator atau HP terhubung via USB
npm run cap:run

# 6. Build debug APK melalui baris perintah
npm run android:build
```

---

## 5. Menjalankan di Android Studio & Perangkat Fisik (HP)

### A. Membuka di Android Studio
1. Jalankan perintah `npm run cap:open` atau buka aplikasi **Android Studio**.
2. Pilih menu **File -> Open**.
3. Navigasikan ke direktori `C:\laragon\www\SIGAP\android` lalu klik **OK**.
4. Tunggu proses *Gradle Sync* selesai hingga indeks proyek siap.

### B. Menjalankan pada Emulator Android (AVD)
1. Di Android Studio, buka **Device Manager** (ikon ponsel di pojok kanan atas).
2. Pilih AVD yang tersedia (misalnya `Pixel_7_Pro` API 34/35).
3. Klik tombol tombol **Play (Run 'app')** berwarna hijau di toolbar.

### C. Menjalankan pada HP Fisik melalui USB
1. Pada HP Android, aktifkan **Developer Options (Opsi Pengembang)**:
   - Masuk ke *Settings -> About Phone*.
   - Ketuk *Build Number* sebanyak 7 kali berturut-turut.
2. Di *Developer Options*, aktifkan **USB Debugging**.
3. Sambungkan HP ke komputer menggunakan kabel USB data.
4. Pada layar HP, setujui dialog popup *"Allow USB Debugging"*.
5. Di terminal komputer, pastikan HP terdeteksi:
   ```bash
   adb devices
   ```
6. Pilih perangkat HP Anda pada dropdown target di Android Studio, lalu klik **Run 'app'**.

---

## 6. Prosedur Pembuatan APK Debug

Untuk menghasilkan APK debug untuk keperluan pengujian instalasi mandiri:

1. Pastikan aset web telah disinkronkan:
   ```bash
   npm run cap:sync
   ```
2. Jalankan perintah kompilasi Gradle:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug
   ```
3. Lokasi berkas APK hasil build:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
4. Memasang APK langsung ke HP via adb:
   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 7. Panduan Pembuatan APK Release & AAB Bertanda Tangan (Keystore)

Untuk merilis aplikasi ke Google Play Store atau distribusi resmi instansi BPBD:

### Langkah 1: Buat Keystore Produksi
Jalankan perintah berikut (simpan keystore di direktori aman **di luar repository git**):

```powershell
keytool -genkey -v -keystore C:\Users\ASUS\sigap-release-key.jks -alias sigap-release -keyalg RSA -keysize 2048 -validity 10000
```
Isi data organisasi (BPBD Kab. Aceh Utara) dan simpan kata sandi dengan aman.

### Langkah 2: Konfigurasi Keystore di Luar Repository
Buat atau edit berkas `gradle.properties` pada direktori profil pengguna (`C:\Users\ASUS\.gradle\gradle.properties`):

```properties
SIGAP_RELEASE_STORE_FILE=C:/Users/ASUS/sigap-release-key.jks
SIGAP_RELEASE_KEY_ALIAS=sigap-release
SIGAP_RELEASE_STORE_PASSWORD=kata_sandi_keystore_anda
SIGAP_RELEASE_KEY_PASSWORD=kata_sandi_alias_anda
```

### Langkah 3: Konfigurasi `android/app/build.gradle` untuk Signing Otomatis
Tambahkan blok signingConfigs pada `android/app/build.gradle`:

```groovy
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('SIGAP_RELEASE_STORE_FILE')) {
                storeFile file(SIGAP_RELEASE_STORE_FILE)
                storePassword SIGAP_RELEASE_STORE_PASSWORD
                keyAlias SIGAP_RELEASE_KEY_ALIAS
                keyPassword SIGAP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Langkah 4: Kompilasi Release APK dan AAB
```powershell
# Untuk rilis Google Play Store (AAB format):
cd android
.\gradlew.bat bundleRelease

# Untuk APK mandiri siap instal (APK format):
.\gradlew.bat assembleRelease
```

Lokasi berkas hasil kompilasi:
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab`
- **APK**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 8. Pembaruan Aplikasi Setelah Kode React Diubah

Setiap kali Anda mengubah kode komponen, halaman, atau CSS di `src/`:
1. Jangan mengedit file di `android/app/src/main/assets/public` secara manual.
2. Jalankan perintah:
   ```bash
   npm run cap:sync
   ```
   Perintah ini akan melakukan `tsc -b && vite build` lalu menyinkronkan seluruh aset web ke folder native Android secara otomatis.
3. Buka Android Studio atau jalankan ulang aplikasi di perangkat (`npm run cap:run`).

---

## 9. Kebijakan Privasi Data & Keamanan Backend

1. **Privasi Pelapor**:
   - Kolom `reporter_phone` dan nama pelapor tidak pernah diekspos melalui API publik.
   - Telah disiapkan migration SQL view `public.v_flood_reports_public` pada `supabase/migrations/20261009000001_secure_public_reports_view.sql` untuk menutupi nomor telepon pelapor.
2. **Proteksi Panel Petugas**:
   - Halaman `/admin` dan `/admin/reports` diproteksi guard role di sisi antarmuka dan membutuhkan autentikasi resmi Pusdalops BPBD untuk verifikasi status di backend database.
3. **Keamanan Jaringan Android**:
   - Tidak mengaktifkan `usesCleartextTraffic="true"` global secara sembarangan demi mematuhi standar keamanan Google Play dan enkripsi data transit HTTPS.

---

## 10. Fitur Offline & Keterbatasan yang Perlu Diketahui

1. **Fitur yang Berfungsi Sepenuhnya Offline**:
   - Modul Edukasi Bencana (Pra, Saat, Pasca Banjir, Tas Siaga 72 Jam).
   - Daftar kontak darurat resmi BPBD Aceh Utara, SAR, Kepolisian, PMI, dan PLN.
   - Peta batas administrasi Kabupaten Aceh Utara dan 27 kecamatan (vektor GeoJSON dibundel lokal di dalam APK).
   - Data persebaran titik posko evakuasi dan fasilitas publik.
   - Penapisan lokasi mandiri menggunakan koordinat GPS perangkat.
   - Penyimpanan draf laporan warga secara lokal di perangkat (*Offline Draft*).
2. **Keterbatasan Saat Tanpa Koneksi Internet**:
   - *Tile Peta Raster (Basemap OpenStreetMap)*: Ubin gambar peta membutuhkan koneksi internet untuk diunduh secara *on-the-fly*. Saat offline, lapisan poligon bahaya lokal tetap dirender di atas kanvas peta.
   - *Prakiraan Cuaca BMKG Real-time*: Menampilkan pesan gagal atau belum tersedia ketika API tidak dapat diakses; tidak mengganti prakiraan dengan data contoh.
   - *Sinkronisasi Laporan ke Cloud*: Laporan baru tersimpan dengan status draft lokal pada perangkat dan akan dikirim ke antrean BPBD saat internet tersambung kembali.

---

## 11. Panduan Pemecahan Masalah (Troubleshooting)

| Gejala Masalah | Penyebab Umum | Solusi Perbaikan |
| :--- | :--- | :--- |
| **Layar putih kosong (White Screen) saat dibuka** | Kesalahan routing dasar atau file path relatif | Pastikan aset dibundel dari `dist` dan base path Vite tidak mengarah ke domain absolut luar. Jalankan `npm run cap:sync`. |
| **Peta Leaflet abu-abu / kotak ubin tidak pas** | Kontainer peta diinisialisasi sebelum ukuran layar selesai dirender | Kode `FloodMap.tsx` telah ditambahkan pemanggilan otomatis `map.invalidateSize()` pada event mount, timeout 250ms, dan window resize. |
| **Gagal membaca GPS ("Izin Ditolak")** | Izin lokasi perangkat belum diaktifkan oleh pengguna | Buka *Pengaturan HP -> Aplikasi -> SIGAP -> Izin (Permissions)*, aktifkan izin *Location*. Anda juga dapat memilih titik demonstrasi wilayah Aceh Utara di antarmuka. |
| **Kamera gagal mengambil foto** | Izin kamera ditolak atau perangkat kehabisan memori | Plugin `@capacitor/camera` telah dikonfigurasi dengan kompresi otomatis ke resolusi maksimal 1280px dan fallback dialog galeri gambar. |
| **Build Gradle error: "Unsupported class file major version 69"** | Gradle daemon berjalan menggunakan JDK 25 preview | Pasang dan gunakan JDK 21 LTS (`Microsoft.OpenJDK.21` atau `Temurin-21`) dengan menyetel `JAVA_HOME` ke direktori JDK 21. |
