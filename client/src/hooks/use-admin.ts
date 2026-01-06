import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/admin/users
export function useAdminUsers() {
  return useQuery({
    queryKey: [api.admin.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.admin.users.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      return api.admin.users.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/admin/users/:id
export function useAdminUser(id: number) {
  return useQuery({
    queryKey: [api.admin.users.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.admin.users.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.admin.users.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/admin/users/:id/reset-password
export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ id, password }: { id: number; password: string }) => {
      const url = buildUrl(api.admin.users.resetPassword.path, { id });
      const res = await fetch(url, {
        method: api.admin.users.resetPassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reset password");
      return api.admin.users.resetPassword.responses[200].parse(await res.json());
    },
  });
}
