import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertVehicle } from "@shared/routes";

// GET /api/vehicles - List user's vehicles
export function useVehicles() {
  return useQuery({
    queryKey: [api.vehicles.list.path],
    queryFn: async () => {
      const res = await fetch(api.vehicles.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return api.vehicles.list.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Real-time ish updates every 10s
  });
}

// GET /api/vehicles/:id
export function useVehicle(id: number) {
  return useQuery({
    queryKey: [api.vehicles.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.vehicles.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch vehicle");
      return api.vehicles.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: 5000, // Faster updates for single vehicle view
  });
}

// POST /api/admin/users/:id/vehicles - Admin registers vehicle
export function useRegisterVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: number; data: Omit<InsertVehicle, 'userId'> }) => {
      const url = buildUrl(api.admin.users.registerVehicle.path, { id: userId });
      const res = await fetch(url, {
        method: api.admin.users.registerVehicle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to register vehicle");
      return api.admin.users.registerVehicle.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.list.path] });
    },
  });
}

// PUT /api/vehicles/:id - Update vehicle details
export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertVehicle> }) => {
      const url = buildUrl(api.vehicles.update.path, { id });
      const res = await fetch(url, {
        method: api.vehicles.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update vehicle");
      return api.vehicles.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.vehicles.list.path] });
    },
  });
}

// Simulation hook: POST /api/vehicles/:id/telemetry
export function useUpdateTelemetry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, lat, lng }: { id: number; lat: number; lng: number }) => {
      const url = buildUrl(api.vehicles.updateTelemetry.path, { id });
      const res = await fetch(url, {
        method: api.vehicles.updateTelemetry.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Telemetry update failed");
      return api.vehicles.updateTelemetry.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.vehicles.list.path] });
    },
  });
}
