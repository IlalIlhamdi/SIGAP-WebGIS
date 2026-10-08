import fs from 'fs';

async function fetchDisasterAndDAS() {
  console.log("Querying DIBI Hidromet for Aceh Utara...");
  const dibiUrl = "https://gis.bnpb.go.id/server/rest/services/inarisk/DIBI_Hidromet_2015_2024/MapServer/1/query?where=UPPER(KABKOTA)%20LIKE%20'%25ACEH%20UTARA%25'&outFields=*&f=json";
  const dibiRes = await fetch(dibiUrl);
  const dibiData = await dibiRes.json();
  console.log("DIBI Aceh Utara:", dibiData.features?.[0]?.attributes);

  console.log("\nQuerying DAS KLHK for Aceh Utara...");
  // Using bounding box of Aceh Utara: [96.78, 4.75, 97.52, 5.23] in EPSG:4326
  const dasUrl = `https://gis.bnpb.go.id/server/rest/services/inarisk/Klasifikasi_DAS_KLHK/MapServer/0/query?geometry=96.78,4.75,97.52,5.23&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=4326&f=geojson`;
  const dasRes = await fetch(dasUrl);
  const dasData = await dasRes.json();
  console.log(`DAS in Aceh Utara region found: ${dasData.features?.length}`);
  if (dasData.features?.length) {
    console.log("Sample DAS:", dasData.features.map(f => ({
      nama: f.properties.NAMA_DAS,
      luas_ha: f.properties.LUAS_HA,
      kriteria: f.properties.KRITERIA,
      bpdas: f.properties.BPDASHL
    })));
    fs.writeFileSync("public/data/watersheds-das.geojson", JSON.stringify(dasData, null, 2));
    console.log("Saved public/data/watersheds-das.geojson");
  }
}
fetchDisasterAndDAS();
