-- ====================================================================
-- SIGAP Web GIS 1.0 — Security Migration: Public Masked Reports View
-- Privasi Pelapor: Sembunyikan kontak dan nomor telepon pelapor dari akses publik
-- ====================================================================

-- 1. Buat view publik yang mengecualikan reporter_phone dan menganonimkan nama pribadi
CREATE OR REPLACE VIEW public.v_flood_reports_public AS
SELECT 
    id,
    report_code,
    CASE 
        WHEN reporter_name IS NULL OR TRIM(reporter_name) = '' THEN 'Warga Anonim'
        ELSE CONCAT(SUBSTRING(TRIM(reporter_name) FROM 1 FOR 2), '***')
    END AS reporter_name,
    area_id,
    gampong,
    location_detail,
    reported_location,
    event_time,
    water_depth_cm,
    description,
    photo_path,
    status,
    is_simulation,
    verified_by,
    verified_at,
    created_at
FROM public.flood_reports
WHERE status IN ('Diverifikasi', 'Ditindaklanjuti', 'Menunggu Verifikasi');

-- 2. Hak akses SELECT pada view publik untuk anon dan authenticated
GRANT SELECT ON public.v_flood_reports_public TO anon, authenticated;

COMMENT ON VIEW public.v_flood_reports_public IS 
'View terproteksi untuk konsumsi publik SIGAP yang mengisolasi nomor kontak dan identitas pelapor banjir Kabupaten Aceh Utara demi privasi warga.';
