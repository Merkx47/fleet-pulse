import { useVehicles } from "@/hooks/use-vehicles";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Truck, Navigation, Clock, Activity, Circle } from "lucide-react";
import { VehicleMap, type VehicleWithLocation } from "@/components/vehicle-map";
import { useState, useEffect } from "react";
import { api, buildUrl } from "@shared/routes";

// Hook to fetch location data for all vehicles
function useVehiclesWithLocation(vehicles: { sensor_imei: string; vehicle_vin: string }[] | undefined) {
  const [vehiclesWithLocation, setVehiclesWithLocation] = useState<VehicleWithLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0) {
      setVehiclesWithLocation([]);
      return;
    }

    const fetchAllVehicleData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("fleetpulse_token");
        const results = await Promise.all(
          vehicles.map(async (vehicle) => {
            try {
              const url = buildUrl(api.vehicles.getData.path, { vehicle_sensor_imei: vehicle.sensor_imei });
              const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) return null;
              const response = await res.json();
              if (response.responseCode === "00" && response.data) {
                return response.data as VehicleWithLocation;
              }
              return null;
            } catch {
              return null;
            }
          })
        );
        setVehiclesWithLocation(results.filter((v): v is VehicleWithLocation => v !== null));
      } catch (error) {
        console.error("Error fetching vehicle locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllVehicleData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAllVehicleData, 30000);
    return () => clearInterval(interval);
  }, [vehicles]);

  return { vehiclesWithLocation, isLoading };
}

function VehicleListItem({ vehicle }: { vehicle: VehicleWithLocation }) {
  const hasLocation = vehicle["position.latitude"] && vehicle["position.longitude"];
  const isMoving = vehicle.vehicle_state === "MOVING";

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:border-border transition-colors group">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
        hasLocation
          ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
          : 'bg-muted/50 text-muted-foreground'
      }`}>
        <Truck className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {vehicle.vehicle_brand && vehicle.vehicle_model
            ? `${vehicle.vehicle_brand} ${vehicle.vehicle_model}`
            : 'Vehicle'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[11px] text-muted-foreground truncate">
            {vehicle.vehicle_plate_number || vehicle.sensor_imei?.slice(-8)}
          </p>
          {vehicle.vehicle_state && (
            <Badge
              variant="secondary"
              className={`text-[9px] px-1.5 py-0 h-4 ${
                isMoving
                  ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                  : 'bg-sky-50 text-sky-700 border-sky-200/50'
              }`}
            >
              {vehicle.vehicle_state}
            </Badge>
          )}
        </div>
      </div>
      <div className="shrink-0">
        {hasLocation ? (
          <div className="flex items-center gap-1 text-emerald-600">
            <Circle className="w-2 h-2 fill-current animate-pulse" />
          </div>
        ) : (
          <span className="text-[10px] text-muted-foreground">No GPS</span>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  const { data: vehicles, isLoading: isLoadingVehicles } = useVehicles();
  const { vehiclesWithLocation, isLoading: isLoadingLocations } = useVehiclesWithLocation(vehicles);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (vehiclesWithLocation.length > 0) {
      setLastUpdate(new Date());
    }
  }, [vehiclesWithLocation]);

  const isLoading = isLoadingVehicles || isLoadingLocations;
  const vehiclesWithGPS = vehiclesWithLocation.filter(
    v => v["position.latitude"] && v["position.longitude"]
  );
  const parkedCount = vehiclesWithLocation.filter(v => v.vehicle_state === "PARKED").length;
  const movingCount = vehiclesWithLocation.filter(v => v.vehicle_state === "MOVING").length;

  if (isLoadingVehicles) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Live Map</h1>
            <p className="text-muted-foreground mt-1">Track your fleet in real-time</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
            {isLoadingLocations && (
              <Loader2 className="w-3 h-3 animate-spin ml-1" />
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-muted/50 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Total</span>
              </div>
              <p className="text-xl font-semibold">{vehicles?.length || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Tracking</span>
              </div>
              <p className="text-xl font-semibold text-emerald-600">{vehiclesWithGPS.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-sky-50 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Parked</span>
              </div>
              <p className="text-xl font-semibold text-sky-600">{parkedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Moving</span>
              </div>
              <p className="text-xl font-semibold text-amber-600">{movingCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Map and Vehicle List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-0">
                {vehiclesWithGPS.length > 0 ? (
                  <VehicleMap
                    vehicles={vehiclesWithLocation}
                    height="calc(100vh - 340px)"
                    zoom={13}
                  />
                ) : (
                  <div className="h-[calc(100vh-340px)] min-h-[400px] flex items-center justify-center bg-muted/20">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-7 h-7 text-muted-foreground/50" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">No GPS Data</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        {isLoading
                          ? "Loading vehicle locations..."
                          : "None of your vehicles have GPS data available yet."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Vehicle List */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Vehicles
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {vehiclesWithLocation.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-[calc(100vh-420px)] min-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                  {vehiclesWithLocation.length > 0 ? (
                    vehiclesWithLocation.map((vehicle) => (
                      <VehicleListItem key={vehicle.sensor_imei} vehicle={vehicle} />
                    ))
                  ) : isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Truck className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">No vehicles found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
