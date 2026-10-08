async function inspectInariskLayers() {
  console.log("Querying layer fields...");
  for (const layerId of [2, 3]) {
    const res = await fetch(`https://gis.bnpb.go.id/server/rest/services/inarisk/batas_administrasi/MapServer/${layerId}?f=json`, {
      headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Layer ${layerId} (${data.name}) fields:`, data.fields?.map(f => f.name));
    }
  }
}
inspectInariskLayers();
