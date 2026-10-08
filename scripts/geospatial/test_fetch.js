async function testAPIs() {
  console.log("Testing API connectivity...");

  // 1. Test BMKG weather API for Aceh Utara (kode wilayah Aceh Utara / Lhoksukon or Banda Aceh)
  // Aceh Utara kecamatan: Lhoksukon adm4 code or general weather
  try {
    console.log("Checking BMKG API...");
    // BMKG API adm4 for Aceh Utara (11.08.04 - Lhoksukon or general)
    const bmkgRes = await fetch("https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=11.08.04.2001", {
      headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
    });
    console.log("BMKG status:", bmkgRes.status);
    if (bmkgRes.ok) {
      const data = await bmkgRes.json();
      console.log("BMKG data sample:", JSON.stringify(data).slice(0, 150));
    }
  } catch (err) {
    console.log("BMKG fetch error:", err.message);
  }

  // 2. Test BNPB InaRISK GIS server
  try {
    console.log("Checking BNPB InaRISK GIS server...");
    const inariskRes = await fetch("https://gis.bnpb.go.id/server/rest/services/inarisk/batas_administrasi/MapServer?f=json", {
      headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
    });
    console.log("InaRISK MapServer status:", inariskRes.status);
    if (inariskRes.ok) {
      const json = await inariskRes.json();
      console.log("InaRISK layers:", json.layers ? json.layers.map(l => `${l.id}: ${l.name}`) : "No layers info");
    }
  } catch (err) {
    console.log("InaRISK fetch error:", err.message);
  }

  // 3. Test Overpass API for Aceh Utara boundary
  try {
    console.log("Checking Overpass API...");
    // Query Aceh Utara relation (relation["boundary"="administrative"]["admin_level"="5"]["name"~"Aceh Utara",i])
    const query = `[out:json][timeout:25];
      relation["boundary"="administrative"]["admin_level"="5"]["name"~"Aceh Utara",i];
      out tags center;`;
    const osmRes = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: { "User-Agent": "SIGAP-Aceh-Utara-LKTI/1.0" }
    });
    console.log("Overpass status:", osmRes.status);
    if (osmRes.ok) {
      const osmData = await osmRes.json();
      console.log("OSM elements found:", osmData.elements?.length, osmData.elements?.[0]?.tags);
    }
  } catch (err) {
    console.log("OSM fetch error:", err.message);
  }
}

testAPIs();
