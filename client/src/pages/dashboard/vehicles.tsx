import { useVehicles, useVehicleData, type Vehicle } from "@/hooks/use-vehicles";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Truck, Eye, Fuel, Activity, Info, Car, Calendar, MapPin, Battery, Gauge, Clock, AlertTriangle, Zap, Thermometer, Settings } from "lucide-react";

function VehicleDetailsDialog({ vehicle }: { vehicle: Vehicle }) {
  const { data: vehicleData, isLoading } = useVehicleData(vehicle.sensor_imei);
  const hasDetails = vehicle.vehicle_brand || vehicle.vehicle_model;

  // Parse faults if available
  let faults: Record<string, string> = {};
  if (vehicleData?.faults) {
    try {
      faults = JSON.parse(vehicleData.faults);
    } catch {
      // Ignore parse errors
    }
  }

  const isMoving = vehicleData?.vehicle_state === "MOVING" || vehicleData?.vehicle_state === "DRIVING";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border/50">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {hasDetails ? `${vehicle.vehicle_brand} ${vehicle.vehicle_model}` : 'Vehicle Details'}
                </DialogTitle>
                <DialogDescription className="text-sm mt-0.5">
                  {hasDetails
                    ? `${vehicle.vehicle_year || ''} ${vehicle.vehicle_color ? '· ' + vehicle.vehicle_color : ''}`
                    : `VIN: ${vehicle.vehicle_vin}`}
                </DialogDescription>
              </div>
            </div>
            {vehicleData?.vehicle_state && (
              <Badge
                variant="secondary"
                className={`text-sm px-3 py-1 ${
                  isMoving
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}
              >
                {vehicleData.vehicle_state}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Vehicle Information */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vehicle.vehicle_plate_number && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Plate Number</p>
                  <p className="font-semibold">{vehicle.vehicle_plate_number}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">VIN</p>
                <p className="font-mono text-sm">{vehicle.vehicle_vin}</p>
              </div>
              {vehicle.vehicle_year && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="font-medium">{vehicle.vehicle_year}</p>
                </div>
              )}
              {vehicle.vehicle_color && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Color</p>
                  <p className="font-medium">{vehicle.vehicle_color}</p>
                </div>
              )}
              {vehicle.vehicle_fuel_type && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fuel Type</p>
                  <p className="font-medium capitalize">{vehicle.vehicle_fuel_type}</p>
                </div>
              )}
              {vehicle.vehicle_transmission && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Transmission</p>
                  <p className="font-medium capitalize">{vehicle.vehicle_transmission}</p>
                </div>
              )}
              {vehicle.is_active !== undefined && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant="secondary"
                    className={`${
                      vehicle.is_active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {vehicle.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              )}
              {vehicle.created_at && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="font-medium">{new Date(vehicle.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                </div>
              )}
            </div>
          </div>

          {/* Live Telemetry */}
          <div className="pt-4 border-t border-border/50">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Telemetry
            </h3>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading telemetry data...
              </div>
            ) : vehicleData ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Fuel Level */}
                {vehicleData["can.fuel.level"] !== undefined && (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                        <Fuel className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel</p>
                        <p className="font-bold text-lg">{vehicleData["can.fuel.level"]}%</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mileage */}
                {vehicleData["can.vehicle.mileage"] !== undefined && (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Mileage</p>
                        <p className="font-bold">{vehicleData["can.vehicle.mileage"].toLocaleString()} km</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Battery */}
                {vehicleData.battery_health && (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        vehicleData.battery_health === 'GOOD'
                          ? 'bg-green-50 dark:bg-green-900/30'
                          : 'bg-amber-50 dark:bg-amber-900/30'
                      }`}>
                        <Battery className={`w-5 h-5 ${
                          vehicleData.battery_health === 'GOOD'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Battery</p>
                        <p className={`font-bold ${
                          vehicleData.battery_health === 'GOOD' ? 'text-green-600' : 'text-amber-600'
                        }`}>{vehicleData.battery_health}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Engine Load */}
                {vehicleData.engine_load && (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Engine</p>
                        <p className="font-bold">{vehicleData.engine_load}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Location */}
                {(vehicleData["position.latitude"] && vehicleData["position.longitude"]) && (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-mono text-xs">{vehicleData["position.latitude"]?.toFixed(4)}, {vehicleData["position.longitude"]?.toFixed(4)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* MIL Mileage */}
                {vehicleData["can.mil.mileage"] !== undefined && (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">MIL Mileage</p>
                        <p className="font-bold">{vehicleData["can.mil.mileage"].toLocaleString()} km</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No telemetry data available</p>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          {vehicleData && (
            <div className="pt-4 border-t border-border/50">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Status Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {vehicleData.speeding_status && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Speeding Status</span>
                    <Badge variant={vehicleData.speeding_status === 'BELOW LIMIT' ? 'default' : 'destructive'}>
                      {vehicleData.speeding_status}
                    </Badge>
                  </div>
                )}
                {vehicleData.ecu_status && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">ECU Status</span>
                    <Badge variant={vehicleData.ecu_status === 'STABLE' ? 'default' : 'secondary'}>
                      {vehicleData.ecu_status}
                    </Badge>
                  </div>
                )}
                {vehicleData.engine_stability && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Engine Stability</span>
                    <Badge variant={vehicleData.engine_stability === 'OK' ? 'default' : 'secondary'}>
                      {vehicleData.engine_stability}
                    </Badge>
                  </div>
                )}
                {vehicleData.overheating_risk && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Overheating Risk</span>
                    <Badge variant={vehicleData.overheating_risk === 'LOW' ? 'default' : 'destructive'}>
                      {vehicleData.overheating_risk}
                    </Badge>
                  </div>
                )}
                {vehicleData.charging_status && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Charging Status</span>
                    <Badge variant="secondary">{vehicleData.charging_status}</Badge>
                  </div>
                )}
                {vehicleData.intake_air_temperature && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">Intake Air Temp</span>
                    <Badge variant="secondary">{vehicleData.intake_air_temperature}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fault Codes */}
          {Object.keys(faults).length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Active Faults ({Object.keys(faults).length})
              </h3>
              <div className="space-y-2">
                {Object.entries(faults).map(([code, description]) => (
                  <div key={code} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-400">{code}</p>
                    <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Update */}
          {vehicleData?.timestamp && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Last Updated: {new Date(vehicleData.timestamp).toLocaleString()}
              </p>
            </div>
          )}
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

            {/* VIN and Actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
              <p className="text-[10px] text-muted-foreground/70 font-mono">
                VIN: {vehicle.vehicle_vin}
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
