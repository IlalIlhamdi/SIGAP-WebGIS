import React, { useEffect, useState, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  Marker, 
  Popup, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Maximize2, 
  RotateCcw, 
  Navigation, 
  Info, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle,
  Building2,
  Waves,
  CloudRain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { MapLegend } from './MapLegend';
import { MapLegendBar } from './MapLegendBar';
import { LayerControls } from './LayerControls';
import { useNavigate } from 'react-router-dom';

// Center of Kabupaten Aceh Utara
const ACEH_UTARA_CENTER: [number, number] = [5.044, 97.22];
const DEFAULT_ZOOM = 10;

// Fix standard Leaflet default marker icons issue in Vite bundlers
const createCustomIcon = (bgColor: string, text: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25);
      ">${text}</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const evacIcon = createCustomIcon('#059669', 'E');
const facilityIcon = createCustomIcon('#2563EB', 'F');
const reportIcon = createCustomIcon('#E11D48', '!');

// Controller helper component inside MapContainer
const MapController: React.FC<{
  targetCoord: [number, number] | null;
  resetTrigger: number;
}> = ({ targetCoord, resetTrigger }) => {
  const map = useMap();

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(ACEH_UTARA_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
    }
  }, [resetTrigger, map]);

  useEffect(() => {
    if (targetCoord) {
      map.flyTo(targetCoord, 12, { duration: 1.2 });
    }
  }, [targetCoord, map]);

  return null;
};

interface FloodMapProps {
  initialKecamatanId?: string;
  onSelectKecamatan?: (k: any) => void;
  heightClass?: string;
  showLegendBelow?: boolean;
}

export const FloodMap: React.FC<FloodMapProps> = ({ 
  initialKecamatanId, 
  onSelectKecamatan,
  heightClass = "h-[calc(100vh-140px)]",
  showLegendBelow = true
}) => {
  const { 
    layers, 
    layerOpacity, 
    setLayerOpacity, 
    allKecamatan, 
    selectedKecamatan, 
    setSelectedKecamatan 
  } = useApp();

  const [boundaryGeo, setBoundaryGeo] = useState<any>(null);
  const [kecamatanGeo, setKecamatanGeo] = useState<any>(null);
  const [riversGeo, setRiversGeo] = useState<any>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [evacuations, setEvacuations] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [resetCount, setResetCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapTarget, setMapTarget] = useState<[number, number] | null>(null);
  const [weatherEffect, setWeatherEffect] = useState<'none' | 'rain' | 'storm'>('none');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load geospatial datasets
  useEffect(() => {
    async function loadGIS() {
      try {
        const [boundary, kec, rivers, fac, evac] = await Promise.all([
          dataService.getBoundaryGeoJSON(),
          dataService.getKecamatanGeoJSON(),
          dataService.getRiversGeoJSON(),
          dataService.getFacilitiesGeoJSON(),
          dataService.getEvacuationPointsGeoJSON()
        ]);

        setBoundaryGeo(boundary);
        setKecamatanGeo(kec);
        setRiversGeo(rivers);
        if (fac?.features) setFacilities(fac.features);
        if (evac?.features) setEvacuations(evac.features);
        setReports(dataService.getReports());
      } catch (e) {
        console.error("Error loading map layers:", e);
      }
    }
    loadGIS();
  }, []);

  // Sync initial kecamatan selection if provided
  useEffect(() => {
    if (initialKecamatanId && allKecamatan.length > 0) {
      const match = allKecamatan.find(k => k.id === initialKecamatanId || k.name.toLowerCase() === initialKecamatanId.toLowerCase());
      if (match) setSelectedKecamatan(match);
    }
  }, [initialKecamatanId, allKecamatan, setSelectedKecamatan]);

  // Polygon styling based on hazard level
  const getFeatureStyle = (feature: any) => {
    const kecName = feature.properties?.WADMKC || '';
    const match = allKecamatan.find(k => k.name.toLowerCase() === kecName.toLowerCase());
    
    let fillColor = '#16834B'; // Low
    if (match) {
      if (match.hazard_level === 'Tinggi') fillColor = '#DC2626';
      else if (match.hazard_level === 'Sedang') fillColor = '#F59E0B';
      else if (match.hazard_level === 'Rendah') fillColor = '#16834B';
    }

    const isSelected = selectedKecamatan && selectedKecamatan.name.toLowerCase() === kecName.toLowerCase();

    return {
      fillColor,
      fillOpacity: layers.hazard ? layerOpacity : 0.05,
      weight: isSelected ? 3.5 : 1.5,
      color: isSelected ? '#0D653A' : '#ffffff',
      dashArray: isSelected ? '' : '3',
      opacity: 0.9,
    };
  };

  const onEachKecamatanFeature = (feature: any, layer: L.Layer) => {
    const kecName = feature.properties?.WADMKC || 'Kecamatan';
    const match = allKecamatan.find(k => k.name.toLowerCase() === kecName.toLowerCase());

    layer.on({
      click: () => {
        if (match) {
          setSelectedKecamatan(match);
          if (onSelectKecamatan) onSelectKecamatan(match);
        }
      },
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          color: '#0D653A',
          fillOpacity: Math.min(layerOpacity + 0.2, 0.9),
        });
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle(getFeatureStyle(feature));
      }
    });

    // Custom popup with rich card layout
    if (match) {
      const popupHtml = `
        <div style="font-family: inherit; width: 230px; padding: 12px; background: white; border-radius: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
            <div>
              <p style="font-size: 10px; color: #66766C; font-weight: 600; text-transform: uppercase; margin: 0;">Kecamatan</p>
              <h4 style="font-size: 15px; font-weight: 800; color: #0D653A; margin: 0;">${match.name}</h4>
            </div>
            <span style="
              font-size: 10px; 
              font-weight: 700; 
              padding: 2px 7px; 
              border-radius: 9999px;
              background-color: ${match.hazard_level === 'Tinggi' ? '#FEE2E2' : match.hazard_level === 'Sedang' ? '#FEF3C7' : '#DCFCE7'};
              color: ${match.hazard_level === 'Tinggi' ? '#DC2626' : match.hazard_level === 'Sedang' ? '#D97706' : '#16834B'};
            ">
              ${match.hazard_level}
            </span>
          </div>

          <div style="font-size: 11px; color: #25352D; line-height: 1.5; margin-bottom: 8px;">
            <p style="margin: 2px 0;"><strong>Elevasi:</strong> ${match.elevation_range}</p>
            <p style="margin: 2px 0;"><strong>Kemiringan:</strong> ${match.slope_class}</p>
            <p style="margin: 2px 0;"><strong>Penduduk:</strong> ${match.population_total.toLocaleString()} jiwa</p>
            <p style="margin: 2px 0;"><strong>Sungai:</strong> ${match.primary_rivers.join(', ')}</p>
          </div>

          <div style="border-top: 1px solid #E3EAE5; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 9px; color: #66766C;">Sumber: InaRISK BNPB</span>
            <a href="/areas/${match.id}" style="
              font-size: 10px; 
              font-weight: 700; 
              color: #16834B; 
              text-decoration: none; 
              background: #E8F5E9; 
              padding: 3px 8px; 
              border-radius: 9999px;
            ">
              Lihat Detail →
            </a>
          </div>
        </div>
      `;
      layer.bindPopup(popupHtml);
    }
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-3.5">
      <div 
        ref={mapContainerRef} 
        className={`relative w-full ${isFullscreen ? 'h-screen' : heightClass} rounded-2xl overflow-hidden border border-[#E3EAE5] shadow-xs bg-[#e5e7eb]`}
      >
      <MapContainer
        center={ACEH_UTARA_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        attributionControl={false}
        className="w-full h-full"
      >
        <MapController targetCoord={mapTarget} resetTrigger={resetCount} />

        {/* High performance OpenStreetMap Basemap without attribution text */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />

        {/* Boundary of Kabupaten Aceh Utara */}
        {layers.boundary && boundaryGeo && (
          <GeoJSON
            data={boundaryGeo}
            style={{
              color: '#0D653A',
              weight: 2.5,
              fillColor: '#16834B',
              fillOpacity: 0.02,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* 27 Kecamatan with InaRISK Hazard Styling */}
        {kecamatanGeo && (
          <GeoJSON
            key={`kec-${layerOpacity}-${layers.hazard}-${selectedKecamatan?.id}`}
            data={kecamatanGeo}
            style={getFeatureStyle}
            onEachFeature={onEachKecamatanFeature}
          />
        )}

        {/* OSM Rivers Layer */}
        {layers.rivers && riversGeo && (
          <GeoJSON
            data={riversGeo}
            style={{
              color: '#0284C7',
              weight: 2.2,
              opacity: 0.85,
            }}
            onEachFeature={(feat, layer) => {
              const name = feat.properties?.name || 'Sungai Tanpa Nama';
              layer.bindPopup(`
                <div style="padding: 8px; font-size: 11px;">
                  <strong style="color: #0284C7;">${name}</strong>
                  <p style="margin: 2px 0; color: #66766C;">Jaringan Aliran Air Aceh Utara</p>
                  <p style="margin: 2px 0; font-size: 9px; color: #94A3B8;">Sumber: OSM (ODbL)</p>
                </div>
              `);
            }}
          />
        )}

        {/* Public Facilities Markers */}
        {layers.facilities && facilities.map((fac, idx) => (
          <Marker 
            key={`fac-${idx}`} 
            position={[fac.geometry.coordinates[1], fac.geometry.coordinates[0]]}
            icon={facilityIcon}
          >
            <Popup>
              <div style={{ padding: '8px', width: '200px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#2563EB', textTransform: 'uppercase' }}>
                  {fac.properties.category}
                </span>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '2px 0', color: '#1E293B' }}>
                  {fac.properties.name}
                </h4>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0' }}>{fac.properties.address}</p>
                {fac.properties.phone && (
                  <p style={{ fontSize: '10px', color: '#2563EB', margin: '2px 0' }}>Telp: {fac.properties.phone}</p>
                )}
                <p style={{ fontSize: '9px', color: '#94A3B8', marginTop: '4px' }}>
                  Kecamatan: {fac.properties.kecamatan}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Evacuation Point Markers */}
        {layers.evacuation && evacuations.map((evac, idx) => (
          <Marker
            key={`evac-${idx}`}
            position={[evac.geometry.coordinates[1], evac.geometry.coordinates[0]]}
            icon={evacIcon}
          >
            <Popup>
              <div style={{ padding: '8px', width: '220px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase' }}>
                  Titik Evakuasi Terverifikasi
                </span>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '2px 0', color: '#064E3B' }}>
                  {evac.properties.name}
                </h4>
                <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0' }}>{evac.properties.address}</p>
                <div style={{ fontSize: '10px', color: '#065F46', margin: '4px 0', fontWeight: '600' }}>
                  Kapasitas: {evac.properties.capacity_persons} Jiwa • Elevasi: {evac.properties.elevation_m} mdpl
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                  {(evac.properties.facilities_available || []).map((f: string, fi: number) => (
                    <span key={fi} style={{ fontSize: '8px', background: '#DCFCE7', color: '#166534', padding: '1px 5px', borderRadius: '4px' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Public Flood Reports Markers */}
        {layers.reports && reports.map((rep) => (
          <Marker
            key={rep.id}
            position={rep.coord}
            icon={reportIcon}
          >
            <Popup>
              <div style={{ padding: '8px', width: '220px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#E11D48', textTransform: 'uppercase' }}>
                  Laporan Masyarakat ({rep.status})
                </span>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '2px 0', color: '#881337' }}>
                  Kecamatan {rep.kecamatan} — Gampong {rep.gampong}
                </h4>
                <p style={{ fontSize: '10px', color: '#4C0519', margin: '2px 0' }}>
                  Tinggi Genangan: <strong>{rep.water_depth_cm} cm</strong>
                </p>
                <p style={{ fontSize: '10px', color: '#64748B', margin: '4px 0' }}>
                  {rep.description}
                </p>
                {rep.photo_url && (
                  <img 
                    src={rep.photo_url} 
                    alt="Foto Laporan" 
                    style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', marginTop: '4px' }} 
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Controls Top-Right */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={() => setResetCount(c => c + 1)}
          title="Reset Tampilan Peta Aceh Utara"
          className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-[#E3EAE5] shadow-md flex items-center justify-center text-[#25352D] hover:text-[#16834B] transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setWeatherEffect(curr => curr === 'none' ? 'rain' : curr === 'rain' ? 'storm' : 'none');
          }}
          title={weatherEffect === 'none' ? 'Aktifkan Simulasi Efek Cuaca Hujan' : 'Ganti/Matikan Efek Cuaca'}
          className={`w-9 h-9 rounded-xl border shadow-md flex items-center justify-center transition ${
            weatherEffect !== 'none' 
              ? 'bg-[#0D653A] text-white border-[#0D653A]' 
              : 'bg-white/95 hover:bg-white border-[#E3EAE5] text-[#25352D] hover:text-[#16834B]'
          }`}
        >
          <CloudRain className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title="Mode Layar Penuh"
          className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white border border-[#E3EAE5] shadow-md flex items-center justify-center text-[#25352D] hover:text-[#16834B] transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Atmospheric Weather Rain & Storm Simulation Overlay on Map */}
      {weatherEffect !== 'none' && (
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {/* Ambient tint */}
          <div className={`absolute inset-0 ${weatherEffect === 'storm' ? 'bg-slate-900/25' : 'bg-sky-950/15'} transition-colors duration-500`} />

          {/* Rain streaks */}
          {Array.from({ length: weatherEffect === 'storm' ? 45 : 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-100 to-white rounded-full animate-rain-drop"
              style={{
                left: `${(i * 100) / (weatherEffect === 'storm' ? 45 : 24) + ((i * 11) % 6)}%`,
                top: '-20px',
                height: `${14 + ((i * 4) % 12)}px`,
                opacity: 0.4 + ((i * 3) % 4) * 0.15,
                animationDuration: `${0.45 + ((i * 2) % 4) * 0.1}s`,
                animationDelay: `${((i * 4) % 7) * 0.08}s`,
                animationIterationCount: 'infinite',
              }}
            />
          ))}

          {/* Storm lightning flash */}
          {weatherEffect === 'storm' && (
            <div className="absolute inset-0 bg-white/20 animate-lightning-flash" />
          )}

          {/* Active Weather Status Pill on Map */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-auto bg-[#0D653A]/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-emerald-400/40">
            <CloudRain className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>
              {weatherEffect === 'storm' ? '⚡ Efek Cuaca: Badai & Hujan Petir (Awas DAS)' : '🌧️ Efek Cuaca: Hujan Sedang (38 mm/jam)'}
            </span>
            <button
              onClick={() => setWeatherEffect('none')}
              className="text-white/80 hover:text-white text-xs ml-1 font-extrabold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating Layer Controls (Top-Left) */}
      <div className="absolute top-3 left-3 z-20 hidden sm:block max-w-[200px]">
        <LayerControls />
      </div>

      {/* Floating Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-3 z-20 hidden md:block">
        <MapLegend 
          opacity={layerOpacity} 
          onOpacityChange={setLayerOpacity} 
        />
      </div>

      {/* Selected Kecamatan Bottom Floater (Mobile & Quick Summary) */}
      {selectedKecamatan && (
        <div className="absolute bottom-3 right-3 left-3 md:left-auto md:max-w-sm z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#B9DFC5] shadow-xl animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] text-[#66766C] uppercase font-bold">Kecamatan Terpilih</p>
              <h4 className="text-base font-extrabold text-[#0D653A]">{selectedKecamatan.name}</h4>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
              selectedKecamatan.hazard_level === 'Tinggi' ? 'bg-red-100 text-red-700' :
              selectedKecamatan.hazard_level === 'Sedang' ? 'bg-amber-100 text-amber-700' :
              'bg-green-100 text-green-700'
            }`}>
              Bahaya {selectedKecamatan.hazard_level}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#66766C] pt-2 border-t border-[#E3EAE5]">
            <span>{selectedKecamatan.population_total.toLocaleString()} Jiwa • {selectedKecamatan.elevation_range}</span>
            <button
              onClick={() => navigate(`/areas/${selectedKecamatan.id}`)}
              className="text-[#16834B] font-bold hover:underline flex items-center gap-0.5"
            >
              Detail <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Komponen Keterangan Peta (Map Legend) Tepat di Bawah Peta Interaktif SIGAP */}
    {showLegendBelow && !isFullscreen && (
      <MapLegendBar />
    )}
  </div>
  );
};
