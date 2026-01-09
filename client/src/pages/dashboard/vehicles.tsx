import { useVehicles, useVehicleData, type Vehicle } from "@/hooks/use-vehicles";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Truck, Eye, Fuel, Activity, Info, Car, Calendar, MapPin, Battery, Gauge, Clock } from "lucide-react";

function VehicleDetailsDialog({ vehicle }: { vehicle: Vehicle }) {
  const { data: vehicleData, isLoading } = useVehicleData(vehicle.sensor_imei);
  const hasDetails = vehicle.vehicle_brand || vehicle.vehicle_model;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-border/50">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">
                {hasDetails ? `${vehicle.vehicle_brand} ${vehicle.vehicle_model}` : 'Vehicle Details'}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {hasDetails
                  ? `${vehicle.vehicle_year || ''} ${vehicle.vehicle_color ? '· ' + vehicle.vehicle_color : ''}`
                  : vehicle.vehicle_vin?.slice(-8)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">VIN</p>
              <p className="font-mono text-xs">{vehicle.vehicle_vin}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">IMEI</p>
              <p className="font-mono text-xs">{vehicle.sensor_imei}</p>
            </div>
            {vehicle.vehicle_plate_number && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Plate</p>
                <p className="text-sm font-medium">{vehicle.vehicle_plate_number}</p>
              </div>
            )}
            {vehicle.vehicle_fuel_type && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Fuel</p>
                <p className="text-sm capitalize">{vehicle.vehicle_fuel_type}</p>
              </div>
            )}
            {vehicle.vehicle_transmission && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Transmission</p>
                <p className="text-sm capitalize">{vehicle.vehicle_transmission}</p>
              </div>
            )}
            {vehicle.is_active !== undefined && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Status</p>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    vehicle.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {vehicle.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            )}
            {vehicle.created_at && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Registered</p>
                <p className="text-sm">{new Date(vehicle.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
              </div>
            )}
          </div>

          {/* Sensor Data Section */}
          <div className="pt-4 border-t border-border/50">
            <h4 className="text-xs font-medium mb-3 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              Live Data
            </h4>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Loading...
              </div>
            ) : vehicleData ? (
              <div className="space-y-3">
                {/* Location */}
                {(vehicleData["position.latitude"] || vehicleData["position.longitude"]) && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 rounded-md bg-sky-50 flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Location</p>
                      <p className="text-xs font-mono">{vehicleData["position.latitude"]?.toFixed(4)}, {vehicleData["position.longitude"]?.toFixed(4)}</p>
                    </div>
                  </div>
                )}

                {/* Vehicle State */}
                {vehicleData.vehicle_state && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      vehicleData.vehicle_state === 'MOVING' ? 'bg-amber-50' : 'bg-emerald-50'
                    }`}>
                      <Car className={`w-3.5 h-3.5 ${
                        vehicleData.vehicle_state === 'MOVING' ? 'text-amber-600' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">State</p>
                      <p className="text-xs font-medium">{vehicleData.vehicle_state}</p>
                    </div>
                  </div>
                )}

                {/* Battery Health */}
                {vehicleData.battery_health && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      vehicleData.battery_health === 'GOOD' ? 'bg-emerald-50' : 'bg-amber-50'
                    }`}>
                      <Battery className={`w-3.5 h-3.5 ${
                        vehicleData.battery_health === 'GOOD' ? 'text-emerald-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Battery</p>
                      <p className="text-xs font-medium">{vehicleData.battery_health}</p>
                    </div>
                  </div>
                )}

                {/* Last Update */}
                {vehicleData.timestamp && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Last Update</p>
                      <p className="text-xs">{new Date(vehicleData.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Charging Status */}
                {vehicleData.charging_status && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center">
                      <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Charging</p>
                      <p className="text-xs">{vehicleData.charging_status}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                No sensor data available
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const hasDetails = vehicle.vehicle_brand || vehicle.vehicle_model;

  return (
    <Card className="border-border/50 hover:border-border transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Truck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {hasDetails ? `${vehicle.vehicle_brand} ${vehicle.vehicle_model}` : 'Vehicle'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {vehicle.vehicle_year && vehicle.vehicle_color
                    ? `${vehicle.vehicle_year} · ${vehicle.vehicle_color}`
                    : vehicle.vehicle_vin?.slice(-8)}
                </p>
              </div>
              {vehicle.is_active !== undefined && (
                <Badge
                  variant="secondary"
                  className={`text-[10px] shrink-0 ${
                    vehicle.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {vehicle.is_active ? "Active" : "Inactive"}
                </Badge>
              )}
            </div>

            {/* Details row */}
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              {vehicle.vehicle_plate_number && (
                <span className="flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  {vehicle.vehicle_plate_number}
                </span>
              )}
              {vehicle.vehicle_fuel_type && (
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3" />
                  {vehicle.vehicle_fuel_type}
                </span>
              )}
              {vehicle.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(vehicle.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>

            {/* IMEI and Actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
              <p className="text-[10px] text-muted-foreground/70 font-mono">
                IMEI: {vehicle.sensor_imei}
              </p>
              <VehicleDetailsDialog vehicle={vehicle} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VehiclesPage() {
  const { data: vehicles, isLoading, error } = useVehicles();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const activeCount = vehicles?.filter(v => v.is_active === true).length || 0;
  const totalCount = vehicles?.length || 0;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Vehicles</h1>
          <p className="text-muted-foreground mt-1">View and manage your fleet</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium">Total</p>
              <p className="text-xl font-semibold mt-0.5">{totalCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium">Active</p>
              <p className="text-xl font-semibold mt-0.5 text-emerald-600">{activeCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium">Inactive</p>
              <p className="text-xl font-semibold mt-0.5 text-amber-600">{totalCount - activeCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">
              Failed to load vehicles. Please try again.
            </CardContent>
          </Card>
        )}

        {/* Vehicles Grid */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            All Vehicles
          </h2>

          {vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {vehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id || vehicle.sensor_imei || index} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-border/50">
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium text-foreground mb-1">No vehicles</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Contact your administrator to register vehicles to your account.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
