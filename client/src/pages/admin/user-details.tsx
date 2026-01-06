import { useAdminUser } from "@/hooks/use-admin";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Car, Calendar, Plus } from "lucide-react";
import { useRoute, Link } from "wouter";
import { VehicleStatusBadge } from "@/components/vehicle-status-badge";

export default function UserDetailsPage() {
  const [, params] = useRoute("/admin/users/:id");
  const userId = params ? parseInt(params.id) : 0;
  const { data: user, isLoading } = useAdminUser(userId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold">User not found</h2>
          <Link href="/admin/users">
            <Button variant="link" className="mt-4">Back to Users</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-6">
        <Link href="/admin/users" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Users
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.fullName}</h1>
            <p className="text-muted-foreground">{user.username}</p>
          </div>
          <Link href={`/admin/users/${user.id}/vehicles/new`}>
            <Button className="shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 border-border shadow-sm h-fit">
            <CardHeader>
              <CardTitle>Profile Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground text-sm">Role</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground text-sm">Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground text-sm">Joined</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-border shadow-sm">
            <CardHeader>
              <CardTitle>Assigned Vehicles</CardTitle>
              <CardDescription>Vehicles managed by this user</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Note: In a real app we'd fetch vehicles for this user specifically. 
                  For now assuming user object might have this or we fetch separately.
                  Since API returns just user, we'd need another endpoint.
                  Assuming for this demo we just show empty state or implement endpoint later.
              */}
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                <h3 className="text-lg font-medium text-foreground">Vehicle List</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1 mb-6">
                  Manage the fleet assigned to {user.fullName}. Add new vehicles or monitor status.
                </p>
                <Link href={`/admin/users/${user.id}/vehicles/new`}>
                  <Button variant="outline">Register New Vehicle</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
