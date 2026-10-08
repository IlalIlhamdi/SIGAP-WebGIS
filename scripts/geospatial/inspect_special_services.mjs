async function inspectSpecialServices() {
  const targets = [
    "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_banjir_30_sumatera/MapServer?f=json",
    "https://gis.bnpb.go.id/server/rest/services/inarisk/DIBI_Hidromet_2015_2024/MapServer?f=json",
    "https://gis.bnpb.go.id/server/rest/services/inarisk/Klasifikasi_DAS_KLHK/MapServer?f=json",
    "https://gis.bnpb.go.id/server/rest/services/inarisk/Jalur_evakuasi/MapServer?f=json"
  ];

  for (const url of targets) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(`\nURL: ${url}`);
      console.log(`Service: ${data.mapName || data.name || "Unknown"}`);
      console.log(`Layers:`, data.layers?.map(l => `${l.id}: ${l.name}`));
    } catch (e) {
      console.log(`Error ${url}:`, e.message);
    }
  }
}
inspectSpecialServices();
