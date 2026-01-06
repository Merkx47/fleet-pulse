import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";

// Auth
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

// Dashboard
import DashboardHome from "@/pages/dashboard";

// Admin
import AdminUsersPage from "@/pages/admin/users";
import UserDetailsPage from "@/pages/admin/user-details";
import VehicleFormPage from "@/pages/admin/vehicle-form";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (adminOnly && user.role !== "admin") {
    setLocation("/dashboard");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      {/* Admin Routes */}
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminUsersPage} adminOnly />}
      </Route>
      <Route path="/admin/users/:id">
        {() => <ProtectedRoute component={UserDetailsPage} adminOnly />}
      </Route>
      <Route path="/admin/users/:id/vehicles/new">
        {() => <ProtectedRoute component={VehicleFormPage} adminOnly />}
      </Route>

      {/* User Routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={DashboardHome} />}
      </Route>

      {/* Redirect root based on auth is handled in login/hooks, defaulting to login */}
      <Route path="/">
        {() => <LoginPage />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
