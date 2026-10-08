async function listServices() {
  const root = await fetch("https://gis.bnpb.go.id/server/rest/services?f=json");
  const data = await root.json();
  console.log("Root folders:", data.folders);
  console.log("Root services:", data.services?.map(s => s.name));

  const inarisk = await fetch("https://gis.bnpb.go.id/server/rest/services/inarisk?f=json");
  const inariskData = await inarisk.json();
  console.log("InaRISK services:", inariskData.services?.map(s => `${s.name} (${s.type})`));
}
listServices();
