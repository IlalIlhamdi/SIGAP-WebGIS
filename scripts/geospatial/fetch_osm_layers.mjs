import fs from 'fs';

// Bounding box of Aceh Utara: south: 4.75, west: 96.78, north: 5.25, east: 97.55
const BBOX = "4.75,96.78,5.25,97.55";

async function runOverpass(queryName, query) {
  console.log(`Fetching ${queryName}...`);
  const servers = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter"
  ];

  for (const server of servers) {
    try {
      const res = await fetch(server, {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: { "User-Agent": "SIGAP-Aceh-Utara/1.0" }
      });
      if (res.ok) {
        const json = await res.json();
        console.log(`Success from ${server}: ${json.elements?.length} elements for ${queryName}`);
        return json;
      }
    } catch (e) {
      console.log(`Failed on ${server}: ${e.message}`);
    }
  }
  return null;
}

async function main() {
  // 1. Fetch Rivers
  const riverQuery = `
    [out:json][timeout:35];
    (
      way["waterway"="river"](${BBOX});
    );
    out geom;
  `;
  const riverRes = await runOverpass("rivers", riverQuery);
  if (riverRes && riverRes.elements?.length > 0) {
    const features = riverRes.elements
      .filter(el => el.geometry && el.geometry.length > 1)
      .map(el => ({
        type: "Feature",
        id: `way/${el.id}`,
        properties: {
          id: el.id,
          name: el.tags?.name || "Sungai Tanpa Nama",
          waterway: el.tags?.waterway,
          source: "OpenStreetMap (ODbL)"
        },
        geometry: {
          type: "LineString",
          coordinates: el.geometry.map(p => [p.lon, p.lat])
        }
      }));
    fs.writeFileSync('public/data/rivers.geojson', JSON.stringify({
      type: "FeatureCollection",
      name: "Sungai Aceh Utara",
      features
    }, null, 2));
    console.log(`Saved public/data/rivers.geojson (${features.length} features)`);
  }

  // 2. Fetch Facilities (hospital, clinic, school, police, townhall, place_of_worship)
  const facilityQuery = `
    [out:json][timeout:35];
    (
      node["amenity"~"hospital|clinic|doctors|townhall|police|fire_station|community_centre"](${BBOX});
      node["amenity"="school"](${BBOX});
    );
    out tags center;
  `;
  const facRes = await runOverpass("facilities", facilityQuery);
  if (facRes && facRes.elements?.length > 0) {
    const features = facRes.elements
      .filter(el => el.lat && el.lon)
      .map(el => {
        const amenity = el.tags?.amenity;
        let category = "Fasilitas Umum";
        if (amenity === "hospital" || amenity === "clinic" || amenity === "doctors") category = "Kesehatan";
        else if (amenity === "school") category = "Pendidikan";
        else if (amenity === "townhall" || amenity === "police" || amenity === "fire_station") category = "Pemerintahan/Keamanan";
        else if (amenity === "community_centre") category = "Pusat Komunitas";

        return {
          type: "Feature",
          id: `node/${el.id}`,
          properties: {
            id: el.id,
            name: el.tags?.name || `${category} (${el.tags?.amenity})`,
            category,
            amenity,
            operator: el.tags?.operator || el.tags?.["operator:type"] || "Pemerintah / Publik",
            phone: el.tags?.phone || el.tags?.["contact:phone"] || null,
            address: [el.tags?.["addr:street"], el.tags?.["addr:village"], el.tags?.["addr:city"]].filter(Boolean).join(", ") || null,
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
      name: "Fasilitas Umum Aceh Utara",
      features
    }, null, 2));
    console.log(`Saved public/data/facilities.geojson (${features.length} features)`);
  }
}

main();
