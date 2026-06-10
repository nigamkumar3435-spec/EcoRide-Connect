import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically pan/zoom map on selection, filter change, or fit bounds of all active stations
function ChangeMapView({ stations, selectedStation, defaultCenter, defaultZoom }) {
  const map = useMap();

  useEffect(() => {
    // If a specific station is selected, zoom directly to it
    if (selectedStation && selectedStation.latitude && selectedStation.longitude) {
      map.setView([selectedStation.latitude, selectedStation.longitude], 13, {
        animate: true,
        duration: 0.8
      });
      return;
    }

    // Filter stations with valid coordinates
    const validStations = stations.filter(s => s.latitude && s.longitude);

    if (validStations.length > 0) {
      // Create bounds containing all valid stations
      const bounds = L.latLngBounds(validStations.map(s => [s.latitude, s.longitude]));
      
      // If there's only one station, focus on it
      if (validStations.length === 1) {
        map.setView([validStations[0].latitude, validStations[0].longitude], 12, {
          animate: true,
          duration: 0.8
        });
      } else {
        // Fit bounds of all stations with padding
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12,
          animate: true,
          duration: 0.8
        });
      }
    } else {
      // Fallback to default India view
      map.setView(defaultCenter, defaultZoom, {
        animate: true,
        duration: 0.8
      });
    }
  }, [stations, selectedStation, map, defaultCenter, defaultZoom]);

  return null;
}

const StationMap = ({ stations, selectedStation, onSelectStation }) => {
  // Center map on India by default, or focus on selected station
  const defaultCenter = [21.0000, 78.0000]; // Map center of India
  const defaultZoom = 5;

  const getMapCenter = () => {
    if (selectedStation && selectedStation.latitude && selectedStation.longitude) {
      return [selectedStation.latitude, selectedStation.longitude];
    }
    // If we have filtered stations, center on the first one
    const validStations = stations.filter(s => s.latitude && s.longitude);
    if (validStations.length > 0) {
      return [validStations[0].latitude, validStations[0].longitude];
    }
    return defaultCenter;
  };

  const getMapZoom = () => {
    if (selectedStation) return 13;
    // If stations are in the same city, zoom in closer
    const cities = new Set(stations.map(s => s.city.toLowerCase()));
    if (cities.size === 1 && stations.length > 0) return 11;
    return defaultZoom;
  };

  // Create custom premium pulsing marker icon
  const createCustomIcon = (station, isSelected) => {
    const isAvailable = station.availableSlots > 0;
    
    // Pulse animation ring color
    let ringColor = 'border-rose-500/50';
    let dotColor = 'bg-rose-500';
    let pulseClass = '';

    if (isSelected) {
      ringColor = 'border-emerald-400';
      dotColor = 'bg-emerald-400';
      pulseClass = 'animate-ping duration-1000';
    } else if (isAvailable) {
      ringColor = 'border-emerald-500/50';
      dotColor = 'bg-emerald-500';
      pulseClass = 'animate-pulse';
    }

    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-full h-full rounded-full border-2 ${ringColor} ${pulseClass} opacity-80"></div>
          <div class="w-3.5 h-3.5 rounded-full ${dotColor} border-2 border-slate-950 shadow-lg transition-transform duration-300 hover:scale-125"></div>
        </div>
      `,
      className: 'custom-station-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -10]
    });
  };

  const activeCenter = getMapCenter();
  const activeZoom = getMapZoom();

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl glass-panel group">
      {/* Dynamic inline styles to apply dark mode overlay to Leaflet OpenStreetMap tiles */}
      <style>{`
        .leaflet-container {
          background: #f1f5f9 !important;
        }
        .dark .leaflet-container {
          background: #020617 !important;
        }
        .dark .dark-leaflet-tiles {
          filter: invert(96%) hue-rotate(180deg) brightness(85%) contrast(90%) saturate(120%) !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
          backdrop-filter: blur(12px) !important;
          color: #0f172a !important;
          border-radius: 1rem !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08) !important;
        }
        .dark .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(51, 65, 85, 0.5) !important;
          color: #f1f5f9 !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
        }
        .dark .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(51, 65, 85, 0.5) !important;
        }
        .leaflet-bar a {
          background: rgba(255, 255, 255, 0.8) !important;
          color: #0f172a !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
          backdrop-filter: blur(12px) !important;
        }
        .dark .leaflet-bar a {
          background: rgba(15, 23, 42, 0.8) !important;
          color: #f1f5f9 !important;
          border: 1px solid rgba(51, 65, 85, 0.5) !important;
          border-bottom: 1px solid rgba(51, 65, 85, 0.5) !important;
        }
        .leaflet-bar a:hover {
          background: rgba(16, 185, 129, 0.1) !important;
          color: #10b981 !important;
        }
        .dark .leaflet-bar a:hover {
          background: rgba(16, 185, 129, 0.2) !important;
          color: #10b981 !important;
        }
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
        }
        .dark .leaflet-bar {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3) !important;
        }
      `}</style>

      {/* Map Explorer UI Overlay */}
      <div className="absolute top-4 right-4 z-[999] bg-slate-100/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-[10px] text-slate-600 dark:text-slate-400 select-none shadow-md font-semibold pointer-events-none">
        Map View: <span className="text-emerald-500 dark:text-emerald-400 font-bold">{stations.length}</span> active stations
      </div>

      <MapContainer
        center={activeCenter}
        zoom={activeZoom}
        className="w-full h-full z-10"
        zoomControl={true}
        attributionControl={false}
      >
        <ChangeMapView
          stations={stations}
          selectedStation={selectedStation}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        />
        
        {/* OpenStreetMap Tile Layer with dark themed filter class */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-leaflet-tiles"
        />

        {stations
          .filter(station => station.latitude && station.longitude)
          .map((station) => {
            const isSelected = selectedStation && selectedStation._id === station._id;
            return (
              <Marker
                key={station._id}
                position={[station.latitude, station.longitude]}
                icon={createCustomIcon(station, isSelected)}
                eventHandlers={{
                  click: () => onSelectStation(station)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[210px] text-slate-200">
                    <h3 className="font-bold text-sm text-white leading-tight mb-1">{station.name}</h3>
                    <p className="text-[11px] text-slate-400 mb-2 flex items-start gap-1">
                      <span className="text-emerald-500 mt-0.5">📍</span>
                      <span>{station.address}, {station.city}</span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 mb-2.5">
                      <div>
                        <div className="text-slate-500 uppercase tracking-wider text-[8px]">Cost</div>
                        <div className="text-emerald-400 font-bold">₹{station.chargingCost}/hr</div>
                      </div>
                      <div>
                        <div className="text-slate-500 uppercase tracking-wider text-[8px]">Slots</div>
                        <div className={`font-bold ${station.availableSlots > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {station.availableSlots > 0 ? `${station.availableSlots} Left` : 'Full'}
                        </div>
                      </div>
                      <div className="col-span-2 border-t border-slate-800/60 pt-1 mt-0.5">
                        <div className="text-slate-500 uppercase tracking-wider text-[8px]">Type</div>
                        <div className="text-slate-300 font-medium">{station.chargerType}</div>
                      </div>
                    </div>

                    <a
                      href={`/stations/${station._id}`}
                      className="block text-center w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      Book Charging Slot
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default StationMap;
