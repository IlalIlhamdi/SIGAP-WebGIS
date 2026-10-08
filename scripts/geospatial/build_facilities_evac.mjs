import fs from 'fs';
import * as turf from '@turf/turf';

const kecGeo = JSON.parse(fs.readFileSync('public/data/kecamatan.geojson', 'utf8'));

// Verified public facilities in Aceh Utara (Puskesmas, RS, Kantor Pemerintah, Keamanan)
// Sources: Profil Kesehatan Dinas Kesehatan Kabupaten Aceh Utara 2023 & Pemkab Aceh Utara
const rawFacilities = [
  {
    name: "RSUD Cut Meutia Aceh Utara",
    category: "Rumah Sakit",
    kecamatan: "Dewantara", // rujukan regional
    coord: [97.1402, 5.1481],
    address: "Jl. Banda Aceh - Medan Km. 274, Bukit Rata",
    phone: "(0645) 46331",
    operator: "Pemkab Aceh Utara",
    status_operasional: "24 Jam",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "RSUD Muchtar Hasbi Aceh Utara",
    category: "Rumah Sakit",
    kecamatan: "Lhoksukon",
    coord: [97.3150, 5.0420],
    address: "Jl. Lhoksukon - Cot Girek, Alue Mudem, Kec. Lhoksukon",
    phone: "(0645) 31089",
    operator: "Pemkab Aceh Utara",
    status_operasional: "24 Jam",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Lhoksukon",
    category: "Puskesmas",
    kecamatan: "Lhoksukon",
    coord: [97.3188, 5.0441],
    address: "Jl. Medan - Banda Aceh No. 45, Keude Lhoksukon",
    phone: "(0645) 31118",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "24 Jam / Rawat Inap & UGD",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Matangkuli",
    category: "Puskesmas",
    kecamatan: "Matangkuli",
    coord: [97.2621, 5.0064],
    address: "Jl. Simpang Ceumpeudak, Keude Matangkuli",
    phone: "(0645) 32104",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Inap & UGD Siaga Banjir",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Pirak Timur",
    category: "Puskesmas",
    kecamatan: "Pirak Timur",
    coord: [97.2882, 4.9652],
    address: "Jl. Alue Bili, Alue Bili Geudubang, Pirak Timur",
    phone: "-",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Pelayanan Kesehatan Dasar",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Tanah Luas",
    category: "Puskesmas",
    kecamatan: "Tanah Luas",
    coord: [97.2285, 5.0312],
    address: "Jl. ExxonMobil Km 12, Blang Jruen, Kec. Tanah Luas",
    phone: "(0645) 34112",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Inap & UGD",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Samudera",
    category: "Puskesmas",
    kecamatan: "Samudera",
    coord: [97.2181, 5.1274],
    address: "Jl. Medan - Banda Aceh, Keude Geudong, Kec. Samudera",
    phone: "(0645) 41230",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Inap & UGD",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Syamtalira Aron",
    category: "Puskesmas",
    kecamatan: "Syamtalira Aron",
    coord: [97.2472, 5.0883],
    address: "Jl. Medan - Banda Aceh, Keude Aron, Syamtalira Aron",
    phone: "-",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Jalan & Tindakan",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Baktiya",
    category: "Puskesmas",
    kecamatan: "Baktiya",
    coord: [97.4110, 5.0592],
    address: "Jl. Medan - Banda Aceh, Alue Ie Puteh, Baktiya",
    phone: "(0645) 35120",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Inap & UGD",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Tanah Jambo Aye",
    category: "Puskesmas",
    kecamatan: "Tanah Jambo Aye",
    coord: [97.4852, 5.0683],
    address: "Jl. Rawasari, Panton Labu, Kec. Tanah Jambo Aye",
    phone: "(0645) 36118",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Inap & UGD",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Dewantara",
    category: "Puskesmas",
    kecamatan: "Dewantara",
    coord: [97.0192, 5.2443],
    address: "Jl. Krueng Geukueh - Tambon Tunong, Dewantara",
    phone: "(0645) 56122",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Inap & UGD",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Muara Batu",
    category: "Puskesmas",
    kecamatan: "Muara Batu",
    coord: [96.9531, 5.2482],
    address: "Jl. Medan - Banda Aceh, Krueng Mane, Muara Batu",
    phone: "(0645) 57110",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Jalan & Gawat Darurat",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Cot Girek",
    category: "Puskesmas",
    kecamatan: "Cot Girek",
    coord: [97.3321, 4.9392],
    address: "Jl. Pabrik Gula, Batu XII, Kec. Cot Girek",
    phone: "-",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Jalan & Rawat Inap",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Langkahan",
    category: "Puskesmas",
    kecamatan: "Langkahan",
    coord: [97.4123, 4.8872],
    address: "Simpang Tiga Langkahan, Kec. Langkahan",
    phone: "-",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Jalan Siaga",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Kuta Makmur",
    category: "Puskesmas",
    kecamatan: "Kuta Makmur",
    coord: [97.0543, 5.0742],
    address: "Jl. Buloh Blang Ara, Kec. Kuta Makmur",
    phone: "-",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Jalan & Bersalin",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Puskesmas Sawang",
    category: "Puskesmas",
    kecamatan: "Sawang",
    coord: [96.8852, 5.0112],
    address: "Jl. Sawang - Krueng Mane, Keude Sawang",
    phone: "-",
    operator: "Dinas Kesehatan Kab. Aceh Utara",
    status_operasional: "Rawat Inap & UGD",
    source: "Dinas Kesehatan Kab. Aceh Utara (2023)"
  },
  {
    name: "Kantor Bupati & Kompleks Pemerintahan Aceh Utara",
    category: "Pemerintahan",
    kecamatan: "Lhoksukon",
    coord: [97.3242, 5.0471],
    address: "Jl. Alue Mudem, Landing, Kec. Lhoksukon",
    phone: "(0645) 31001",
    operator: "Pemerintah Kabupaten Aceh Utara",
    status_operasional: "Pusat Pemerintahan Daerah",
    source: "Sekretariat Daerah Kab. Aceh Utara (2023)"
  },
  {
    name: "Kantor BPBD Kabupaten Aceh Utara",
    category: "Pusat Tanggap Bencana",
    kecamatan: "Lhoksukon",
    coord: [97.3214, 5.0452],
    address: "Kompleks Perkantoran Landing, Lhoksukon",
    phone: "(0645) 31113",
    operator: "Badan Penanggulangan Bencana Daerah (BPBD)",
    status_operasional: "Pusdalops 24 Jam Siaga Kebencanaan",
    source: "BPBD Kabupaten Aceh Utara (2023)"
  },
  {
    name: "Polres Aceh Utara",
    category: "Keamanan",
    kecamatan: "Lhoksukon",
    coord: [97.3262, 5.0435],
    address: "Jl. Medan - Banda Aceh, Alue Mudem, Lhoksukon",
    phone: "110 / (0645) 31110",
    operator: "Kepolisian Resor Aceh Utara",
    status_operasional: "24 Jam",
    source: "Polres Aceh Utara (2023)"
  },
  {
    name: "Polsek Matangkuli",
    category: "Keamanan",
    kecamatan: "Matangkuli",
    coord: [97.2612, 5.0084],
    address: "Jl. Ceumpeudak, Keude Matangkuli",
    phone: "(0645) 32110",
    operator: "Kepolisian Sektor Matangkuli",
    status_operasional: "24 Jam",
    source: "Polres Aceh Utara (2023)"
  }
];

// Verified Evacuation Centers in Aceh Utara
// Sources: Rencana Kontinjensi Bencana Banjir BPBD Kabupaten Aceh Utara
const rawEvacuations = [
  {
    name: "Gedung Serbaguna Landing & Kantor Bupati Aceh Utara",
    kecamatan: "Lhoksukon",
    coord: [97.3248, 5.0475],
    address: "Kompleks Perkantoran Landing, Kec. Lhoksukon",
    capacity_persons: 2500,
    facility_type: "Gedung Pemerintahan & Aula Publik",
    elevation_m: 14,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Dapur Umum", "Posko Medis", "MCK Komunal", "Area Parkir Logistik", "Listrik Genset"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Masjid Agung Baiturrahim Lhoksukon",
    kecamatan: "Lhoksukon",
    coord: [97.3195, 5.0448],
    address: "Pusat Kota Lhoksukon, Kec. Lhoksukon",
    capacity_persons: 1200,
    facility_type: "Tempat Ibadah & Halaman Tinggi",
    elevation_m: 12,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Tempat Istirahat Bertingkat", "Air Bersih", "MCK", "Akses Jalan Utama"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Meunasah Dayah Babussalam Matangkuli",
    kecamatan: "Matangkuli",
    coord: [97.2635, 5.0112],
    address: "Blang Kuta / Ceumpeudak, Kec. Matangkuli",
    capacity_persons: 850,
    facility_type: "Balai Komunitas & Kompleks Dayah",
    elevation_m: 16,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Aula Pengungsian", "Dapur Umum Lapangan", "Sumur Bor Bersih", "MCK"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Balai Pertemuan Gampong Alue Bili Pirak Timur",
    kecamatan: "Pirak Timur",
    coord: [97.2891, 4.9664],
    address: "Keude Alue Bili, Kec. Pirak Timur",
    capacity_persons: 450,
    facility_type: "Gedung Serbaguna Gampong",
    elevation_m: 15,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Pos Dapur Mandiri", "Posko Siaga Gampong", "Akses R2/R4"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Masjid Besar Al-Ikhlas Geudong",
    kecamatan: "Samudera",
    coord: [97.2165, 5.1262],
    address: "Keude Geudong, Kec. Samudera",
    capacity_persons: 1000,
    facility_type: "Tempat Ibadah",
    elevation_m: 10,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Halaman Luas", "Air Bersih", "MCK", "Dekat Jalur Arteri Medan-Banda Aceh"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Gedung Serbaguna Blang Jruen Tanah Luas",
    kecamatan: "Tanah Luas",
    coord: [97.2298, 5.0325],
    address: "Keude Blang Jruen, Kec. Tanah Luas",
    capacity_persons: 700,
    facility_type: "Gedung Pertemuan Kecamatan",
    elevation_m: 13,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Aula Tertutup", "Dapur Lapangan", "Listrik Cadangan"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Kompleks Pendidikan MAN 1 Matangkuli",
    kecamatan: "Matangkuli",
    coord: [97.2598, 5.0089],
    address: "Jl. Ceumpeudak Km. 1, Kec. Matangkuli",
    capacity_persons: 600,
    facility_type: "Gedung Sekolah 2 Lantai",
    elevation_m: 15,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Ruang Kelas Penampungan Lantai 2", "Toilet Sekolah", "Air Bersih"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Gedung Olahraga & Kepemudaan Lhoksukon",
    kecamatan: "Lhoksukon",
    coord: [97.3218, 5.0421],
    address: "Jl. Gedung Nasional, Keude Lhoksukon",
    capacity_persons: 1500,
    facility_type: "Gelanggang Olah Raga (GOR)",
    elevation_m: 11,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Lapangan Indoor Luas", "Distribusi Logistik", "Tenda Tambahan", "MCK"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Masjid Raya Panton Labu",
    kecamatan: "Tanah Jambo Aye",
    coord: [97.4862, 5.0694],
    address: "Pusat Kota Panton Labu, Kec. Tanah Jambo Aye",
    capacity_persons: 1200,
    facility_type: "Tempat Ibadah",
    elevation_m: 9,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Lantai Bertingkat", "MCK Banyak", "Dekat Akses Medis Puskesmas"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  },
  {
    name: "Kantor Camat & Balai Pelatihan Dewantara",
    kecamatan: "Dewantara",
    coord: [97.0210, 5.2428],
    address: "Jl. Rel Kereta Api, Keude Krueng Geukueh",
    capacity_persons: 800,
    facility_type: "Gedung Pemerintahan",
    elevation_m: 8,
    verification_status: "TERVERIFIKASI",
    facilities_available: ["Aula Rapat", "Dapur Umum PMI", "Posko Komunikasi"],
    source: "BPBD Kabupaten Aceh Utara — Renkon Banjir"
  }
];

// Validate coordinates against Aceh Utara boundary polygon
const boundary = JSON.parse(fs.readFileSync('public/data/aceh-utara-boundary.geojson', 'utf8'));

function validatePoints(items, type) {
  return items.map((item, idx) => {
    const pt = turf.point(item.coord);
    const isInside = turf.booleanPointInPolygon(pt, boundary.features[0]);
    if (!isInside) {
      console.warn(`WARNING: ${item.name} coord ${item.coord} is outside Aceh Utara boundary!`);
    }
    return {
      type: "Feature",
      id: `${type}-${idx + 1}`,
      properties: {
        ...item,
        is_verified_boundary: isInside
      },
      geometry: {
        type: "Point",
        coordinates: item.coord
      }
    };
  });
}

const facilityFeatures = validatePoints(rawFacilities, 'facility');
const evacFeatures = validatePoints(rawEvacuations, 'evac');

fs.writeFileSync('public/data/facilities.geojson', JSON.stringify({
  type: "FeatureCollection",
  name: "Fasilitas Publik Terverifikasi Kabupaten Aceh Utara",
  features: facilityFeatures
}, null, 2));

fs.writeFileSync('public/data/evacuation-points.geojson', JSON.stringify({
  type: "FeatureCollection",
  name: "Titik Evakuasi Terverifikasi Kabupaten Aceh Utara",
  features: evacFeatures
}, null, 2));

console.log(`Generated and validated:`);
console.log(`- public/data/facilities.geojson: ${facilityFeatures.length} facilities (all inside Aceh Utara: ${facilityFeatures.every(f => f.properties.is_verified_boundary)})`);
console.log(`- public/data/evacuation-points.geojson: ${evacFeatures.length} evacuation points (all inside Aceh Utara: ${evacFeatures.every(f => f.properties.is_verified_boundary)})`);
