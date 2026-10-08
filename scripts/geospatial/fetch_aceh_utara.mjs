import fs from 'fs';
import path from 'path';

async function fetchAcehUtara() {
  const outputDir = path.resolve('public/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Fetching Kabupaten Aceh Utara boundary from InaRISK...");
  // Query Layer 2: Batas Kabupaten
  const kabUrl = `https://gis.bnpb.go.id/server/rest/services/inarisk/batas_administrasi/MapServer/2/query?where=UPPER(WADMKK)%20LIKE%20'%25ACEH%20UTARA%25'&outFields=*&outSR=4326&f=geojson`;
  
  const kabRes = await fetch(kabUrl, {
    headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
  });
  
  if (!kabRes.ok) {
    console.error("Failed to fetch Kabupaten boundary:", kabRes.statusText);
    return;
  }
  
  const kabData = await kabRes.json();
  console.log(`Kabupaten features found: ${kabData.features?.length}`);
  if (kabData.features?.length > 0) {
    console.log("Kabupaten feature attributes:", kabData.features[0].properties);
    fs.writeFileSync(path.join(outputDir, 'aceh-utara-boundary.geojson'), JSON.stringify(kabData, null, 2));
    console.log("Saved public/data/aceh-utara-boundary.geojson");
  }

  console.log("\nFetching Kecamatan boundaries for Aceh Utara from InaRISK...");
  // Query Layer 3: Batas Kecamatan
  const kecUrl = `https://gis.bnpb.go.id/server/rest/services/inarisk/batas_administrasi/MapServer/3/query?where=UPPER(WADMKK)%20LIKE%20'%25ACEH%20UTARA%25'&outFields=*&outSR=4326&f=geojson`;
  
  const kecRes = await fetch(kecUrl, {
    headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
  });
  
  if (!kecRes.ok) {
    console.error("Failed to fetch Kecamatan boundaries:", kecRes.statusText);
    return;
  }
  
  const kecData = await kecRes.json();
  console.log(`Kecamatan features found: ${kecData.features?.length}`);
  if (kecData.features?.length > 0) {
    console.log("Sample Kecamatan:", kecData.features.slice(0, 5).map(f => f.properties.WADMKC));
    fs.writeFileSync(path.join(outputDir, 'kecamatan.geojson'), JSON.stringify(kecData, null, 2));
    console.log("Saved public/data/kecamatan.geojson");
  }
}

fetchAcehUtara();
