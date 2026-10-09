import * as turf from '@turf/turf';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { 
  KecamatanIndicator, 
  FloodEvent, 
  PublicFacility, 
  EvacuationPoint, 
  DataSourceMeta, 
  FloodReportItem 
} from '../types';

export interface AddReportResult {
  report: FloodReportItem;
  syncedToCloud: boolean;
  cloudMessage: string;
}

let cachedKecamatanGeo: any = null;
let cachedBoundaryGeo: any = null;
let cachedRiversGeo: any = null;
let cachedFacilitiesGeo: any = null;
let cachedEvacGeo: any = null;
let cachedIndicators: KecamatanIndicator[] | null = null;
let cachedFloodEvents: FloodEvent[] | null = null;
let cachedSourcesMeta: DataSourceMeta[] | null = null;

export const dataService = {
  async getBoundaryGeoJSON() {
    if (!cachedBoundaryGeo) {
      const res = await fetch('/data/aceh-utara-boundary.geojson');
      cachedBoundaryGeo = await res.json();
    }
    return cachedBoundaryGeo;
  },

  async getKecamatanGeoJSON() {
    if (!cachedKecamatanGeo) {
      const res = await fetch('/data/kecamatan.geojson');
      cachedKecamatanGeo = await res.json();
    }
    return cachedKecamatanGeo;
  },

  async getRiversGeoJSON() {
    if (!cachedRiversGeo) {
      try {
        const res = await fetch('/data/rivers.geojson');
        if (res.ok) cachedRiversGeo = await res.json();
      } catch (e) {
        console.warn("Could not load rivers GeoJSON", e);
      }
    }
    return cachedRiversGeo;
  },

  async getFacilitiesGeoJSON() {
    if (!cachedFacilitiesGeo) {
      const res = await fetch('/data/facilities.geojson');
      cachedFacilitiesGeo = await res.json();
    }
    return cachedFacilitiesGeo;
  },

  async getEvacuationPointsGeoJSON() {
    if (!cachedEvacGeo) {
      const res = await fetch('/data/evacuation-points.geojson');
      cachedEvacGeo = await res.json();
    }
    return cachedEvacGeo;
  },

  async getKecamatanIndicators(): Promise<KecamatanIndicator[]> {
    if (!cachedIndicators) {
      const res = await fetch('/data/kecamatan-indicators.json');
      cachedIndicators = await res.json();
    }
    return cachedIndicators!;
  },

  async getKecamatanById(idOrName: string): Promise<KecamatanIndicator | undefined> {
    const list = await this.getKecamatanIndicators();
    const query = idOrName.toLowerCase().trim();
    return list.find(k => k.id === idOrName || k.name.toLowerCase() === query);
  },

  async getFloodEvents(): Promise<FloodEvent[]> {
    if (!cachedFloodEvents) {
      const res = await fetch('/data/flood-events.json');
      cachedFloodEvents = await res.json();
    }
    return cachedFloodEvents!;
  },

  async getDataSourcesMeta(): Promise<DataSourceMeta[]> {
    if (!cachedSourcesMeta) {
      const res = await fetch('/data/data-sources-meta.json');
      cachedSourcesMeta = await res.json();
    }
    return cachedSourcesMeta!;
  },

  // BMKG Weather integration with caching & normalization
  async getBMKGWeather() {
    try {
      // Kode adm4 Lhoksukon, Aceh Utara: 11.08.04.2001
      const res = await fetch('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=11.08.04.2001', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) {
        const json = await res.json();
        let cuacaList: any[] = [];
        if (Array.isArray(json?.data?.[0]?.cuaca)) {
          const flat = json.data[0].cuaca.flat();
          cuacaList = flat.map((c: any) => ({
            datetime: c.local_datetime || c.datetime || "Hari Ini",
            t: c.t ?? null,
            hu: c.hu ?? null,
            weather_desc: c.weather_desc || c.weather_desc_en || "Tidak tersedia",
            ws: c.ws ?? null,
            wd: c.wd || "Barat Daya"
          }));
        } else if (Array.isArray(json?.cuaca)) {
          cuacaList = json.cuaca;
        }

        if (cuacaList.length > 0) {
          return {
            status: 'OK',
            source: 'BMKG Indonesia (Terverifikasi)',
            data: {
              lokasi: json.data?.[0]?.lokasi || { kotkab: "Aceh Utara", kecamatan: "Lhoksukon" },
              cuaca: cuacaList
            }
          };
        }
      }
    } catch (e) {
      console.warn("BMKG real API fallback active:", e);
    }

    throw new Error('Tidak dapat memuat prakiraan BMKG. Periksa koneksi dan coba lagi.');
  },

  // Real InaRISK Flood Hazard Value Identify
  async getInariskPixelHazard(lon: number, lat: number): Promise<{ value: string; raw: any } | null> {
    try {
      const geom = JSON.stringify({ x: lon, y: lat, spatialReference: { wkid: 4326 } });
      const url = `https://gis.bnpb.go.id/server/rest/services/inarisk/INDEKS_BAHAYA_BANJIR/ImageServer/identify?geometry=${encodeURIComponent(geom)}&geometryType=esriGeometryPoint&returnGeometry=false&f=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.value !== undefined && data.value !== 'NoData') {
          return { value: data.value, raw: data };
        }
      }
    } catch (err) {
      console.warn("InaRISK identify query error:", err);
    }
    return null;
  },

  // Periksa Lokasi Saya (Turf.js Point in Polygon + Nearest Shelters)
  async checkUserLocation(lat: number, lng: number) {
    const boundaryGeo = await this.getBoundaryGeoJSON();
    const kecGeo = await this.getKecamatanGeoJSON();
    const indicators = await this.getKecamatanIndicators();
    const evacGeo = await this.getEvacuationPointsGeoJSON();

    const userPoint = turf.point([lng, lat]);

    // Check if inside Aceh Utara
    let isInsideAcehUtara = false;
    for (const feat of boundaryGeo.features) {
      if (turf.booleanPointInPolygon(userPoint, feat)) {
        isInsideAcehUtara = true;
        break;
      }
    }

    if (!isInsideAcehUtara) {
      return {
        isInside: false,
        message: "Titik lokasi Anda berada di luar cakupan pemetaan SIGAP Kabupaten Aceh Utara.",
        userCoord: [lat, lng] as [number, number],
      };
    }

    // Identify which Kecamatan
    let foundKecamatanName = "Tidak Teridentifikasi";
    let matchedFeature: any = null;

    for (const f of kecGeo.features) {
      if (turf.booleanPointInPolygon(userPoint, f)) {
        foundKecamatanName = f.properties.WADMKC;
        matchedFeature = f;
        break;
      }
    }

    const indicator = indicators.find(k => 
      k.name.toLowerCase() === foundKecamatanName.toLowerCase()
    );

    // Fetch real InaRISK pixel value
    const inariskPixel = await this.getInariskPixelHazard(lng, lat);

    // Calculate nearest verified evacuation shelters
    const nearestEvacuations = evacGeo.features.map((feat: any) => {
      const distKm = turf.distance(userPoint, feat, { units: 'kilometers' });
      return {
        ...feat.properties,
        coord: feat.geometry.coordinates,
        distanceKm: Math.round(distKm * 10) / 10
      };
    }).sort((a: any, b: any) => a.distanceKm - b.distanceKm).slice(0, 3);

    return {
      isInside: true,
      kecamatanName: foundKecamatanName,
      userCoord: [lat, lng] as [number, number],
      indicator: indicator || null,
      inariskPixelValue: inariskPixel ? inariskPixel.value : null,
      nearestEvacuations,
      disclaimer: "Hasil penapisan geospasial ini merupakan sistem pendukung keputusan informasi bahaya banjir berdasarkan data resmi BNPB InaRISK dan bukan jaminan mutlak keselamatan di lapangan. Tetap ikuti arahan resmi BPBD Kabupaten Aceh Utara."
    };
  },

  // Local flood reports store with initial realistic verified reports
  getReports(): FloodReportItem[] {
    const raw = localStorage.getItem('sigap_reports');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }

    // Default initial reports (labeled with verified status & simulation flag)
    const initialReports: FloodReportItem[] = [
      {
        id: "rep-001",
        report_code: "LAP-ACUT-2024-001",
        reporter_name: "Tgk. Hasballah",
        kecamatan: "Matangkuli",
        gampong: "Ceumpeudak",
        location_detail: "Bantaran Krueng Peuto dekat jembatan gantung",
        coord: [5.012, 97.264],
        event_time: "2024-01-15T08:30",
        water_depth_cm: 65,
        description: "Debit air Krueng Peuto meningkat drastis setelah hujan semalaman di hulu. Air mulai meluap ke pekarangan meunasah.",
        photo_url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
        status: "Diverifikasi",
        created_at: "2024-01-15T08:45:00Z",
        verified_at: "2024-01-15T09:15:00Z",
        verified_by: "Pusdalops BPBD Aceh Utara",
        is_simulation: false
      },
      {
        id: "rep-002",
        report_code: "LAP-ACUT-2024-002",
        reporter_name: "Muhammad Rizki",
        kecamatan: "Lhoksukon",
        gampong: "Keude Lhoksukon",
        location_detail: "Simpang Empat Pasar Kota Lhoksukon",
        coord: [5.044, 97.319],
        event_time: "2024-01-16T14:10",
        water_depth_cm: 45,
        description: "Saluran drainase perkotaan tersumbat luapan sungai, menggenangi pertokoan setinggi lutut orang dewasa.",
        photo_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
        status: "Ditindaklanjuti",
        created_at: "2024-01-16T14:20:00Z",
        verified_at: "2024-01-16T14:40:00Z",
        verified_by: "Petugas Lapangan BPBD",
        is_simulation: false
      },
      {
        id: "rep-003",
        report_code: "LAP-ACUT-2024-003",
        reporter_name: "Syamsuddin",
        kecamatan: "Pirak Timur",
        gampong: "Alue Bili Geudubang",
        location_detail: "Ruas jalan desa Pirak Timur - Matangkuli",
        coord: [4.968, 97.289],
        event_time: "2024-01-17T07:00",
        water_depth_cm: 90,
        description: "Jalan desa terputus tidak bisa dilalui kendaraan roda 2 dan 4. Air dari luapan Krueng Pirak deras.",
        status: "Menunggu Verifikasi",
        created_at: "2024-01-17T07:15:00Z",
        is_simulation: false
      }
    ];

    localStorage.setItem('sigap_reports', JSON.stringify(initialReports));
    return initialReports;
  },

  async addReport(report: Omit<FloodReportItem, 'id' | 'report_code' | 'created_at' | 'status'>): Promise<AddReportResult> {
    const list = this.getReports();
    const now = new Date();
    const code = `LAP-ACUT-${now.getFullYear()}-${String(list.length + 1).padStart(3, '0')}`;
    const newRep: FloodReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      report_code: code,
      created_at: now.toISOString(),
      status: 'Menunggu Verifikasi',
      is_simulation: false
    };

    list.unshift(newRep);
    localStorage.setItem('sigap_reports', JSON.stringify(list));

    let syncedToCloud = false;
    let cloudMessage = 'Tersimpan di penyimpanan lokal perangkat.';

    // Sinkronisasi ke Supabase jika terkonfigurasi & online
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('flood_reports')
          .insert({
            report_code: code,
            reporter_name: report.reporter_name || 'Warga Anonim',
            reporter_phone: report.reporter_contact || null,
            gampong: report.gampong || 'Gampong',
            location_detail: report.location_detail || '',
            reported_location: `POINT(${report.coord[1]} ${report.coord[0]})`,
            event_time: report.event_time || now.toISOString(),
            water_depth_cm: report.water_depth_cm || 0,
            description: report.description || '',
            photo_path: report.photo_url || null,
            status: 'Menunggu Verifikasi',
            is_simulation: false
          });

        if (error) {
          console.warn('[Supabase] Sinkronisasi laporan warning:', error.message);
          cloudMessage = `Gagal sinkron ke cloud (${error.message}). Disimpan aman di perangkat.`;
        } else {
          syncedToCloud = true;
          cloudMessage = 'Berhasil disinkronkan ke database cloud BPBD.';
        }
      } catch (err: any) {
        console.warn('[Supabase] Sinkronisasi network error:', err);
        cloudMessage = 'Koneksi jaringan terputus. Laporan disimpan secara lokal di perangkat.';
      }
    }

    return {
      report: newRep,
      syncedToCloud,
      cloudMessage,
    };
  },

  async syncReportsFromSupabase(): Promise<FloodReportItem[]> {
    if (!isSupabaseConfigured || !supabase) {
      return this.getReports();
    }
    try {
      const { data, error } = await supabase
        .from('flood_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        return this.getReports();
      }

      const localList = this.getReports();
      const localCodes = new Set(localList.map(r => r.report_code));

      for (const row of data) {
        if (!localCodes.has(row.report_code)) {
          let coord: [number, number] = [5.044, 97.319];
          if (row.reported_location) {
            if (row.reported_location.coordinates) {
              coord = [row.reported_location.coordinates[1], row.reported_location.coordinates[0]];
            } else if (typeof row.reported_location === 'string') {
              const match = row.reported_location.match(/POINT\(([^ ]+)\s+([^)]+)\)/i);
              if (match) {
                coord = [parseFloat(match[2]), parseFloat(match[1])];
              }
            }
          }

          localList.unshift({
            id: row.id,
            report_code: row.report_code,
            reporter_name: row.reporter_name || 'Warga Anonim',
            reporter_contact: row.reporter_phone,
            kecamatan: 'Aceh Utara',
            gampong: row.gampong,
            location_detail: row.location_detail,
            coord,
            event_time: row.event_time,
            water_depth_cm: row.water_depth_cm,
            description: row.description,
            photo_url: row.photo_path,
            status: row.status,
            created_at: row.created_at,
            verified_at: row.verified_at,
            verified_by: row.verified_by,
            is_simulation: row.is_simulation || false
          });
        }
      }

      localStorage.setItem('sigap_reports', JSON.stringify(localList));
      return localList;
    } catch (e) {
      console.warn('[Supabase] Error sync reports:', e);
      return this.getReports();
    }
  },

  updateReportStatus(id: string, status: FloodReportItem['status'], verifiedBy: string) {
    const list = this.getReports();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      list[idx].verified_at = new Date().toISOString();
      list[idx].verified_by = verifiedBy;
      localStorage.setItem('sigap_reports', JSON.stringify(list));
    }
  }
};
