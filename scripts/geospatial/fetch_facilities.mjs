import fs from 'fs';

const BBOX = "4.75,96.78,5.25,97.55";

async function fetchFacilities() {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"hospital|clinic|townhall|police"](${BBOX});
    );
    out tags center 50;
  `;

  console.log("Querying health and government facilities in Aceh Utara...");
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Received ${data.elements?.length} facility points.`);
      const features = (data.elements || [])
        .filter(el => el.lat && el.lon)
        .map(el => {
          const amenity = el.tags?.amenity;
          let category = "Pemerintahan";
          if (amenity === "hospital" || amenity === "clinic") category = "Kesehatan";
          else if (amenity === "police") category = "Keamanan";

          return {
            type: "Feature",
            id: `node/${el.id}`,
            properties: {
              id: el.id,
              name: el.tags?.name || (amenity === "hospital" ? "Puskesmas / Rumah Sakit" : "Kantor Pelayanan"),
              category,
              amenity,
              operator: el.tags?.operator || "Dinas Kesehatan / Pemkab Aceh Utara",
              phone: el.tags?.phone || null,
              address: [el.tags?.["addr:street"], el.tags?.["addr:village"]].filter(Boolean).join(", ") || "Kabupaten Aceh Utara",
              source: "OpenStreetMap (ODbL)"
            },
            geometry: {
              type: "Point",
              coordinates: [el.lon, el.lat]
            }
          };
        });

      fs.writeFileSync('public/data/facilities.geojson', JSON.stringify({
        type: "FeatureCollection",
        name: "Fasilitas Publik Aceh Utara",
        features
      }, null, 2));
      console.log(`Saved public/data/facilities.geojson with ${features.length} points.`);
    } else {
      console.log("Overpass status:", res.status);
    }
  } catch (err) {
    console.error("Facility fetch error:", err.message);
  }
}

fetchFacilities();
