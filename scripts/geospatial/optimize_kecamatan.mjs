import fs from 'fs';
import * as turf from '@turf/turf';

const original = JSON.parse(fs.readFileSync('public/data/kecamatan.geojson', 'utf8'));

// Simplify with tolerance 0.0008 (approx 80-90 meters accuracy, great for subdistrict level view)
const simplified = turf.simplify(original, {
  tolerance: 0.0008,
  highQuality: true,
  mutate: false
});

// Also optimize property payloads
simplified.features.forEach(f => {
  const p = f.properties;
  f.properties = {
    OBJECTID: p.OBJECTID,
    KDCBPS: p.KDCBPS,
    WADMKC: p.WADMKC,
    WADMKK: p.WADMKK,
    WADMPR: p.WADMPR,
    ID_KEC: p.ID_KEC,
    KDPKAB: p.KDPKAB,
    area_km2: Math.round(turf.area(f) / 10000) / 100
  };
});

const outPath = 'public/data/kecamatan.geojson';
const fullPath = 'public/data/kecamatan-full.geojson';
fs.writeFileSync(fullPath, JSON.stringify(original));
fs.writeFileSync(outPath, JSON.stringify(simplified));

console.log(`Original size: ${(fs.statSync(fullPath).size / 1024).toFixed(1)} KB`);
console.log(`Optimized size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
console.log(`Features retained: ${simplified.features.length}`);
