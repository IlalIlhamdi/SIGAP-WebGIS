async function testIdentify() {
  const geom = JSON.stringify({ x: 97.292, y: 5.03, spatialReference: { wkid: 4326 } });
  const url = `https://gis.bnpb.go.id/server/rest/services/inarisk/INDEKS_BAHAYA_BANJIR/ImageServer/identify?geometry=${encodeURIComponent(geom)}&geometryType=esriGeometryPoint&returnGeometry=false&f=json`;
  
  console.log("Testing identify at Lhoksukon (97.292, 5.03)...");
  const res = await fetch(url, { headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" } });
  console.log("Status:", res.status);
  if (res.ok) {
    const data = await res.json();
    console.log("Identify response:", data);
  }
}
testIdentify();
