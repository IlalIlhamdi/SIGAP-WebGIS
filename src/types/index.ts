export type HazardLevel = 'Tinggi' | 'Sedang' | 'Rendah' | 'Belum Tersedia';

export type VerificationStatus = 'TERVERIFIKASI' | 'BELUM TERSEDIA' | 'SIMULASI';

export type UserRole = 'public' | 'officer' | 'admin';

export interface KecamatanIndicator {
  id: string;
  name: string;
  is_capital: boolean;
  population_total: number;
  area_km2: number;
  density_per_km2: number;
  hazard_level: HazardLevel;
  hazard_score: number; // 0.0 - 1.0 (InaRISK Flood Hazard Index)
  primary_rivers: string[];
  elevation_range: string;
  slope_class: string;
  rainfall_annual_mm: number;
  historical_flood_events: number;
  last_major_flood: string;
  vulnerable_sectors: string[];
  sources: {
    demography: string;
    hazard: string;
    events: string;
  };
}

export interface FloodEvent {
  id: string;
  title: string;
  event_date: string;
  year: number;
  water_depth_cm: string;
  affected_kecamatan_count: number;
  affected_kecamatan: string[];
  affected_people: number;
  evacuees_count: number;
  damage_summary: string;
  trigger_cause: string;
  source: string;
  verification_status: VerificationStatus;
}

export interface PublicFacility {
  id: string;
  name: string;
  category: 'Kesehatan' | 'Pemerintahan' | 'Keamanan' | 'Pendidikan' | 'Pusat Tanggap Bencana' | 'Rumah Sakit' | 'Puskesmas';
  kecamatan: string;
  coord: [number, number]; // [lon, lat]
  address: string;
  phone?: string;
  operator?: string;
  status_operasional?: string;
  source: string;
  is_verified_boundary: boolean;
}

export interface EvacuationPoint {
  id: string;
  name: string;
  kecamatan: string;
  coord: [number, number]; // [lon, lat]
  address: string;
  capacity_persons: number;
  facility_type: string;
  elevation_m: number;
  verification_status: VerificationStatus;
  facilities_available: string[];
  source: string;
  is_verified_boundary: boolean;
}

export interface DataSourceMeta {
  id: string;
  dataset_name: string;
  institution: string;
  source_url: string;
  reference_year: number;
  accessed_at: string;
  license: string;
  crs: string;
  status: VerificationStatus;
  notes: string;
}

export interface BMKGWeatherForecast {
  lokasi?: {
    provinsi: string;
    kotkab: string;
    kecamatan: string;
    desa?: string;
  };
  cuaca?: Array<{
    datetime: string;
    t: number; // Suhu
    hu: number; // Kelembaban
    weather_desc: string;
    ws: number; // Kecepatan angin
    wd: string; // Arah angin
  }>;
}

export interface FloodReportItem {
  id: string;
  report_code: string;
  reporter_name: string; // Kept private in UI
  reporter_contact?: string; // Kept private
  kecamatan: string;
  gampong: string;
  location_detail: string;
  coord: [number, number]; // [lat, lng]
  event_time: string;
  water_depth_cm: number;
  description: string;
  photo_url?: string;
  status: 'Menunggu Verifikasi' | 'Diverifikasi' | 'Ditolak' | 'Ditindaklanjuti';
  created_at: string;
  verified_at?: string;
  verified_by?: string;
  is_simulation?: boolean;
}
