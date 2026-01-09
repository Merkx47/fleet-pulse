import { useVehicles, useSyncVehicles, type Vehicle } from "@/hooks/use-vehicles";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Car, Activity, MapPin, RefreshCw, Fuel, ArrowRight, Truck } from "lucide-react";
import { Link } from "wouter";

function StatCard({
  label,
  value,
  icon: Icon,
  color = "default"
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: "default" | "success" | "warning" | "muted";
}) {
  const colorClasses = {
    default: "text-foreground",
    success: "text-emerald-600",
    warning: "text-amber-600",
    muted: "text-muted-foreground"
  };

  const iconBgClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    muted: "bg-muted text-muted-foreground"
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className={`text-2xl font-semibold mt-1 ${colorClasses[color]}`}>{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
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
            </div>

            {/* IMEI */}
            <p className="text-[10px] text-muted-foreground/70 mt-2 font-mono">
              IMEI: {vehicle.sensor_imei}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardHome() {
  const { data: vehicles, isLoading, error } = useVehicles();
  const { mutate: syncVehicles, isPending: isSyncing } = useSyncVehicles();

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
            <p className="text-muted-foreground mt-1">Monitor your fleet performance</p>
          </div>
          <Button
            onClick={() => syncVehicles()}
            disabled={isSyncing}
            size="sm"
            className="w-fit bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync data'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total vehicles"
            value={totalCount}
            icon={Truck}
            color="default"
          />
          <StatCard
            label="Active"
            value={activeCount}
            icon={Activity}
            color="success"
          />
          <StatCard
            label="Inactive"
            value={totalCount - activeCount}
            icon={MapPin}
            color="warning"
          />
          <StatCard
            label="Tracked"
            value={totalCount}
            icon={MapPin}
            color="muted"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/map">
            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Live Map</p>
                    <p className="text-xs text-muted-foreground">Track vehicles in real-time</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/vehicles">
            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">All Vehicles</p>
                    <p className="text-xs text-muted-foreground">View and manage your fleet</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">
              Failed to load vehicles. Please try again.
            </CardContent>
          </Card>
        )}

        {/* Vehicles Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Your Vehicles
            </h2>
            {vehicles && vehicles.length > 0 && (
              <Link href="/dashboard/vehicles">
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  View all
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>

          {vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {vehicles.slice(0, 6).map((vehicle, index) => (
                <VehicleCard key={vehicle.id || vehicle.sensor_imei || index} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-border/50">
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium text-foreground mb-1">No vehicles yet</h3>
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
