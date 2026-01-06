import { useVehicles } from "@/hooks/use-vehicles";
import { DashboardLayout } from "@/components/layout";
import { VehicleMap } from "@/components/vehicle-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleStatusBadge } from "@/components/vehicle-status-badge";
import { Loader2, Car, Activity, MapPin } from "lucide-react";

export default function DashboardHome() {
  const { data: vehicles, isLoading } = useVehicles();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const activeCount = vehicles?.filter(v => v.isActive).length || 0;
  const totalCount = vehicles?.length || 0;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 h-full flex flex-col gap-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">Registered in fleet</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              <p className="text-xs text-muted-foreground">Sending telemetry</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Live</div>
              <p className="text-xs text-muted-foreground">Real-time updates enabled</p>
            </CardContent>
          </Card>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-card rounded-xl border shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[500px]">
          {/* Vehicle List Sidebar */}
          <div className="w-full md:w-80 border-r bg-background flex flex-col">
            <div className="p-4 border-b font-medium bg-muted/30">
              Fleet Status
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {vehicles && vehicles.length > 0 ? (
                vehicles.map(vehicle => (
                  <div key={vehicle.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{vehicle.brand} {vehicle.model}</span>
                      <VehicleStatusBadge isActive={vehicle.isActive} lastSync={vehicle.lastSync} />
                    </div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>{vehicle.plateNumber}</span>
                      <span>VIN: {vehicle.vin.substring(0, 6)}...</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No vehicles assigned yet.
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative z-0">
            {vehicles && <VehicleMap vehicles={vehicles} className="h-full w-full border-none rounded-none" />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
