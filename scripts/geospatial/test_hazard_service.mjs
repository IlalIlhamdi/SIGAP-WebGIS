async function testHazardImageServer() {
  try {
    const url = "https://gis.bnpb.go.id/server/rest/services/inarisk/INDEKS_BAHAYA_BANJIR/ImageServer?f=json";
    const res = await fetch(url, { headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" } });
    console.log("ImageServer status:", res.status);
    if (res.ok) {
      const data = await res.json();
      console.log("ImageServer service info:", {
        name: data.name,
        description: data.description,
        extent: data.extent,
        spatialReference: data.spatialReference,
        pixelSizeX: data.pixelSizeX,
        pixelSizeY: data.pixelSizeY
      });
    }
  } catch (err) {
    console.log("Hazard ImageServer error:", err.message);
  }
}
testHazardImageServer();
