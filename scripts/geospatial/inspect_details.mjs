async function inspectDetails() {
  const urls = [
    "https://gis.bnpb.go.id/server/rest/services/inarisk/layer_bahaya_banjir_30_sumatera/MapServer/0?f=json",
    "https://gis.bnpb.go.id/server/rest/services/inarisk/DIBI_Hidromet_2015_2024/MapServer/1?f=json",
    "https://gis.bnpb.go.id/server/rest/services/inarisk/Klasifikasi_DAS_KLHK/MapServer/0?f=json"
  ];

  for (const u of urls) {
    const res = await fetch(u);
    const data = await res.json();
    console.log(`\nLayer ${data.name}:`, data.type, "Fields:", data.fields?.map(f => f.name));
  }
}
inspectDetails();
