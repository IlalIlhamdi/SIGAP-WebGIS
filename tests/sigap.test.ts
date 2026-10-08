import { describe, it, expect, beforeEach } from 'vitest';
import * as turf from '@turf/turf';
import fs from 'fs';
import path from 'path';

describe('SIGAP 1.0 Geospatial & Core Logic Tests', () => {
  const boundaryPath = path.resolve('public/data/aceh-utara-boundary.geojson');
  const kecPath = path.resolve('public/data/kecamatan.geojson');
  const indicatorsPath = path.resolve('public/data/kecamatan-indicators.json');
  const sourcesPath = path.resolve('public/data/data-sources-meta.json');
  const evacPath = path.resolve('public/data/evacuation-points.geojson');

  const boundaryGeo = JSON.parse(fs.readFileSync(boundaryPath, 'utf8'));
  const kecGeo = JSON.parse(fs.readFileSync(kecPath, 'utf8'));
  const indicators = JSON.parse(fs.readFileSync(indicatorsPath, 'utf8'));
  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  const evacGeo = JSON.parse(fs.readFileSync(evacPath, 'utf8'));

  it('Boundary contains exactly 1 official Aceh Utara polygon', () => {
    expect(boundaryGeo.type).toBe('FeatureCollection');
    expect(boundaryGeo.features.length).toBe(1);
    expect(boundaryGeo.features[0].properties.WADMKK).toBe('Aceh Utara');
    expect(boundaryGeo.features[0].properties.KDPKAB).toBe('11.08');
  });

  it('Kecamatan dataset contains exactly 27 subdistricts matching Aceh Utara', () => {
    expect(kecGeo.features.length).toBe(27);
    const names = kecGeo.features.map((f: any) => f.properties.WADMKC);
    expect(names).toContain('Lhoksukon');
    expect(names).toContain('Matangkuli');
    expect(names).toContain('Pirak Timur');
    expect(names).toContain('Samudera');
    expect(names).toContain('Dewantara');
    expect(names).toContain('Sawang');
  });

  it('Indicators dataset matches 27 subdistricts with valid hazard classifications', () => {
    expect(indicators.length).toBe(27);
    const validHazards = ['Tinggi', 'Sedang', 'Rendah'];
    indicators.forEach((item: any) => {
      expect(validHazards).toContain(item.hazard_level);
      expect(item.hazard_score).toBeGreaterThanOrEqual(0);
      expect(item.hazard_score).toBeLessThanOrEqual(1.0);
      expect(item.population_total).toBeGreaterThan(0);
      expect(item.sources.demography).toBeTruthy();
      expect(item.sources.hazard).toBeTruthy();
    });
  });

  it('Point-in-polygon correctly validates internal coordinates in Aceh Utara', () => {
    // Coordinates inside Lhoksukon
    const lhoksukonPt = turf.point([97.3188, 5.0441]);
    const isInside = turf.booleanPointInPolygon(lhoksukonPt, boundaryGeo.features[0]);
    expect(isInside).toBe(true);

    // Coordinates inside Matangkuli
    const matangkuliPt = turf.point([97.2621, 5.0064]);
    expect(turf.booleanPointInPolygon(matangkuliPt, boundaryGeo.features[0])).toBe(true);

    // Coordinates in Banda Aceh (far outside Aceh Utara)
    const outsidePt = turf.point([95.3238, 5.5483]);
    expect(turf.booleanPointInPolygon(outsidePt, boundaryGeo.features[0])).toBe(false);
  });

  it('Evacuation shelters are all georeferenced and verified', () => {
    expect(evacGeo.features.length).toBeGreaterThanOrEqual(10);
    evacGeo.features.forEach((f: any) => {
      expect(f.properties.verification_status).toBe('TERVERIFIKASI');
      expect(f.properties.capacity_persons).toBeGreaterThan(0);
      expect(f.geometry.coordinates.length).toBe(2);
    });
  });

  it('Data Sources metadata contains required official authorities', () => {
    expect(sources.length).toBe(6);
    const institutions = sources.map((s: any) => s.institution);
    expect(institutions.some((i: string) => i.includes('BNPB'))).toBe(true);
    expect(institutions.some((i: string) => i.includes('BMKG'))).toBe(true);
    expect(institutions.some((i: string) => i.includes('BPS'))).toBe(true);
    expect(institutions.some((i: string) => i.includes('OpenStreetMap'))).toBe(true);
  });
});
