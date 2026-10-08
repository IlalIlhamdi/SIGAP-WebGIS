import fs from 'fs';
import * as turf from '@turf/turf';

const original = JSON.parse(fs.readFileSync('public/data/aceh-utara-boundary.geojson', 'utf8'));

const simplified = turf.simplify(original, {
  tolerance: 0.0008,
  highQuality: true,
  mutate: false
});

simplified.features.forEach(f => {
  const p = f.properties;
  f.properties = {
    OBJECTID: p.OBJECTID,
    KDPKAB: p.KDPKAB,
    WADMKK: p.WADMKK,
    WADMPR: p.WADMPR,
    ID_KAB: p.ID_KAB,
    area_km2: Math.round(turf.area(f) / 10000) / 100
  };
});

fs.writeFileSync('public/data/aceh-utara-boundary-full.geojson', JSON.stringify(original));
fs.writeFileSync('public/data/aceh-utara-boundary.geojson', JSON.stringify(simplified));

console.log(`Kabupaten boundary optimized to ${(fs.statSync('public/data/aceh-utara-boundary.geojson').size / 1024).toFixed(1)} KB`);
