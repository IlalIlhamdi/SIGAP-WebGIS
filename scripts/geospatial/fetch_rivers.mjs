import fs from 'fs';

async function fetchRivers() {
  console.log("Fetching rivers for Aceh Utara...");
  // Overpass query for major rivers in Aceh Utara bbox: 4.75, 96.78, 5.25, 97.55
  const query = `
    [out:json][timeout:60];
    (
      way["waterway"="river"](4.75, 96.78, 5.25, 97.55);
    );
    out geom;
  `;

  // We can try kumi systems or overpass main
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
  ];

  for (const ep of endpoints) {
    try {
      console.log(`Trying ${ep}...`);
      const res = await fetch(ep, {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`Found ${data.elements?.length} river ways!`);
        
        // Convert OSM ways to GeoJSON FeatureCollection
        const features = data.elements
          .filter(el => el.type === "way" && el.geometry && el.geometry.length > 1)
          .map(el => ({
            type: "Feature",
            id: el.id,
            properties: {
              id: el.id,
              name: el.tags?.name || "Sungai Tanpa Nama",
              waterway: el.tags?.waterway,
              source: "OpenStreetMap (ODbL)"
            },
            geometry: {
              type: "LineString",
              coordinates: el.geometry.map(pt => [pt.lon, pt.lat])
            }
          }));

        const geojson = {
          type: "FeatureCollection",
          name: "Sungai dan Jaringan Air Aceh Utara",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          features
        };

        fs.writeFileSync("public/data/rivers.geojson", JSON.stringify(geojson, null, 2));
        console.log(`Saved public/data/rivers.geojson with ${features.length} river segments!`);
        return;
      }
    } catch (err) {
      console.log(`Error on ${ep}:`, err.message);
    }
  }
}

fetchRivers();
