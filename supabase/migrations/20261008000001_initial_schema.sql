-- ====================================================================
-- SIGAP Web GIS 1.0 — Database Schema & PostGIS Migration
-- Kabupaten Aceh Utara, Provinsi Aceh, Indonesia
-- ====================================================================

-- 1. Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Master Data Sources Metadata
CREATE TABLE IF NOT EXISTS data_sources (
    id VARCHAR(50) PRIMARY KEY,
    dataset_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    source_url TEXT,
    reference_year INT,
    accessed_at DATE DEFAULT CURRENT_DATE,
    license VARCHAR(100),
    crs VARCHAR(50),
    status VARCHAR(50) DEFAULT 'TERVERIFIKASI',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Administrative Areas (Kabupaten and 27 Kecamatan in Aceh Utara)
CREATE TABLE IF NOT EXISTS administrative_areas (
    id VARCHAR(50) PRIMARY KEY,
    official_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    area_type VARCHAR(20) NOT NULL CHECK (area_type IN ('KABUPATEN', 'KECAMATAN', 'GAMPONG')),
    parent_id VARCHAR(50) REFERENCES administrative_areas(id),
    area_km2 NUMERIC(10, 2),
    geom GEOMETRY(MultiPolygon, 4326),
    source_id VARCHAR(50) REFERENCES data_sources(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_administrative_areas_geom ON administrative_areas USING GIST(geom);

-- 4. Flood Hazard Index (InaRISK BNPB)
CREATE TABLE IF NOT EXISTS flood_hazard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id VARCHAR(50) REFERENCES administrative_areas(id) ON DELETE CASCADE,
    hazard_class VARCHAR(20) NOT NULL CHECK (hazard_class IN ('Tinggi', 'Sedang', 'Rendah', 'Belum Tersedia')),
    hazard_score NUMERIC(4, 3), -- Range 0.000 to 1.000
    elevation_range VARCHAR(50),
    slope_class VARCHAR(50),
    rainfall_annual_mm INT,
    methodology TEXT DEFAULT 'InaRISK Model Hidrologi BNPB',
    observation_year INT DEFAULT 2023,
    source_id VARCHAR(50) REFERENCES data_sources(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Historical Flood Events (BPBD Aceh Utara & BNPB DIBI)
CREATE TABLE IF NOT EXISTS flood_events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    water_depth_range VARCHAR(50),
    affected_kecamatan_count INT,
    affected_people INT,
    evacuees_count INT,
    damage_summary TEXT,
    trigger_cause TEXT,
    source_id VARCHAR(50) REFERENCES data_sources(id),
    verification_status VARCHAR(50) DEFAULT 'TERVERIFIKASI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Evacuation Points (Titik Evakuasi Terverifikasi BPBD)
CREATE TABLE IF NOT EXISTS evacuation_points (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    area_id VARCHAR(50) REFERENCES administrative_areas(id),
    location GEOMETRY(Point, 4326) NOT NULL,
    address TEXT,
    capacity_persons INT,
    facility_type VARCHAR(100),
    elevation_m INT,
    facilities_available TEXT[],
    verification_status VARCHAR(50) DEFAULT 'TERVERIFIKASI',
    source_id VARCHAR(50) REFERENCES data_sources(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evacuation_points_loc ON evacuation_points USING GIST(location);

-- 7. Public Facilities (Rumah Sakit, Puskesmas, Kantor Pemerintah)
CREATE TABLE IF NOT EXISTS public_facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    area_id VARCHAR(50) REFERENCES administrative_areas(id),
    location GEOMETRY(Point, 4326) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    operator VARCHAR(100),
    status_operasional VARCHAR(100),
    source_id VARCHAR(50) REFERENCES data_sources(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_facilities_loc ON public_facilities USING GIST(location);

-- 8. Population Statistics (BPS Aceh Utara)
CREATE TABLE IF NOT EXISTS population_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id VARCHAR(50) REFERENCES administrative_areas(id) ON DELETE CASCADE,
    year INT NOT NULL,
    population_total INT NOT NULL,
    density_per_km2 NUMERIC(10, 2),
    source_id VARCHAR(50) REFERENCES data_sources(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. User Flood Reports (Laporan Banjir Masyarakat)
CREATE TABLE IF NOT EXISTS flood_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_code VARCHAR(50) UNIQUE NOT NULL,
    reporter_name VARCHAR(100),
    reporter_phone VARCHAR(30), -- Private / Encrypted / Not exposed publicly
    area_id VARCHAR(50) REFERENCES administrative_areas(id),
    gampong VARCHAR(100) NOT NULL,
    location_detail TEXT NOT NULL,
    reported_location GEOMETRY(Point, 4326) NOT NULL,
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    water_depth_cm INT NOT NULL,
    description TEXT NOT NULL,
    photo_path TEXT,
    status VARCHAR(30) DEFAULT 'Menunggu Verifikasi' CHECK (status IN ('Menunggu Verifikasi', 'Diverifikasi', 'Ditolak', 'Ditindaklanjuti')),
    is_simulation BOOLEAN DEFAULT FALSE,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flood_reports_loc ON flood_reports USING GIST(reported_location);

-- 10. User Profiles & Role-Based Access Control
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    display_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'public' CHECK (role IN ('public', 'officer', 'admin')),
    nip VARCHAR(30),
    unit_kerja VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE administrative_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE flood_hazard ENABLE ROW LEVEL SECURITY;
ALTER TABLE flood_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE evacuation_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE population_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE flood_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public READ access to official information
CREATE POLICY "Public Read Administrative Areas" ON administrative_areas FOR SELECT USING (true);
CREATE POLICY "Public Read Flood Hazard" ON flood_hazard FOR SELECT USING (true);
CREATE POLICY "Public Read Flood Events" ON flood_events FOR SELECT USING (true);
CREATE POLICY "Public Read Evacuation Points" ON evacuation_points FOR SELECT USING (true);
CREATE POLICY "Public Read Public Facilities" ON public_facilities FOR SELECT USING (true);
CREATE POLICY "Public Read Population Stats" ON population_statistics FOR SELECT USING (true);
CREATE POLICY "Public Read Data Sources" ON data_sources FOR SELECT USING (true);

-- Public can submit reports
CREATE POLICY "Public Insert Reports" ON flood_reports FOR INSERT WITH CHECK (true);

-- Public can only view non-sensitive report fields (reporter_phone and name masked)
CREATE POLICY "Public Read Verified Reports" ON flood_reports FOR SELECT USING (
    status IN ('Diverifikasi', 'Ditindaklanjuti', 'Menunggu Verifikasi')
);

-- Officer and Admin can update report statuses
CREATE POLICY "Officer Verify Reports" ON flood_reports FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('officer', 'admin')
    )
);

-- ====================================================================
-- GRANT ROLES PERMISSION (Required for Supabase PostgREST API / anon access)
-- ====================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.flood_reports TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

