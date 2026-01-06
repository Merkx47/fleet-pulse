import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { type Vehicle } from '@shared/schema';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not loading in webpack/vite environments
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface VehicleMapProps {
  vehicles: Vehicle[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

function MapUpdater({ center, zoom }: { center?: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export function VehicleMap({ vehicles, center = [51.505, -0.09], zoom = 13, className }: VehicleMapProps) {
  // Filter only vehicles with valid coordinates
  const activeVehicles = vehicles.filter(v => v.currentLat !== null && v.currentLng !== null);

  // Auto-center on first vehicle if no center provided but vehicles exist
  const effectiveCenter: [number, number] = activeVehicles.length > 0 && center[0] === 51.505 
    ? [activeVehicles[0].currentLat!, activeVehicles[0].currentLng!] 
    : center;

  return (
    <div className={`rounded-xl overflow-hidden border border-border shadow-md ${className}`}>
      <MapContainer 
        center={effectiveCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={effectiveCenter} zoom={zoom} />
        
        {activeVehicles.map((vehicle) => (
          <Marker 
            key={vehicle.id} 
            position={[vehicle.currentLat!, vehicle.currentLng!]}
          >
            <Popup className="font-sans">
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">{vehicle.brand} {vehicle.model}</h3>
                <p className="text-xs text-muted-foreground mb-1">Plate: {vehicle.plateNumber}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${vehicle.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-xs capitalize">{vehicle.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Last synced: {vehicle.lastSync ? new Date(vehicle.lastSync).toLocaleTimeString() : 'Never'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
