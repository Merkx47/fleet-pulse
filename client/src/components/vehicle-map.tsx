import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not loading in webpack/vite environments
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Vehicle data from the API (matches /api/vehicle/:imei/data response)
export interface VehicleWithLocation {
  id?: number;
  sensor_imei: string;
  vehicle_vin: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_color?: string;
  vehicle_plate_number?: string;
  is_active?: boolean;
  timestamp?: string;
  vehicle_state?: string;
  "position.latitude"?: number;
  "position.longitude"?: number;
}

interface VehicleMapProps {
  vehicles: VehicleWithLocation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
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

export function VehicleMap({
  vehicles,
  center = [6.5244, 3.3792], // Default to Lagos, Nigeria
  zoom = 12,
  className,
  height = "400px"
}: VehicleMapProps) {
  // Filter only vehicles with valid coordinates
  const activeVehicles = vehicles.filter(v =>
    v["position.latitude"] !== null &&
    v["position.latitude"] !== undefined &&
    v["position.longitude"] !== null &&
    v["position.longitude"] !== undefined
  );

  // Auto-center on first vehicle if vehicles exist
  const effectiveCenter: [number, number] = activeVehicles.length > 0
    ? [activeVehicles[0]["position.latitude"]!, activeVehicles[0]["position.longitude"]!]
    : center;

  return (
    <div className={`rounded-xl overflow-hidden border border-border shadow-md ${className || ''}`} style={{ height }}>
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
            key={vehicle.sensor_imei}
            position={[vehicle["position.latitude"]!, vehicle["position.longitude"]!]}
          >
            <Popup className="font-sans">
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">
                  {vehicle.vehicle_brand && vehicle.vehicle_model
                    ? `${vehicle.vehicle_brand} ${vehicle.vehicle_model}`
                    : 'Vehicle'}
                </h3>
                {vehicle.vehicle_plate_number && (
                  <p className="text-xs text-gray-600 mb-1">Plate: {vehicle.vehicle_plate_number}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${vehicle.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-xs capitalize">{vehicle.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                {vehicle.vehicle_state && (
                  <p className="text-xs text-gray-500 mt-1">
                    State: <span className="capitalize">{vehicle.vehicle_state.toLowerCase()}</span>
                  </p>
                )}
                {vehicle.timestamp && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Last update: {new Date(vehicle.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
