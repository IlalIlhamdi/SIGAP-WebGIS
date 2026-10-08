import fs from 'fs';
import * as turf from '@turf/turf';

const kecData = JSON.parse(fs.readFileSync('public/data/kecamatan.geojson', 'utf8'));
console.log(`Total Kecamatan in Aceh Utara: ${kecData.features.length}`);

const list = kecData.features.map(f => {
  const p = f.properties;
  const bbox = turf.bbox(f);
  const areaSqKm = turf.area(f) / 1000000;
  return {
    nama: p.WADMKC,
    id_kec: p.ID_KEC,
    kdbbps: p.KDBBPS,
    areaSqKm: Math.round(areaSqKm * 10) / 10,
    bbox: bbox.map(n => Math.round(n * 1000) / 1000)
  };
});

list.sort((a, b) => a.nama.localeCompare(b.nama));
console.table(list);
