"use client";

import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { AuthUser } from "@/lib/admin/types";
import { canAccess, canDelete, type Module } from "@/lib/admin/permissions";

const AdminUserContext = createContext<AuthUser | null>(null);

export function useAdminUser() {
  const u = useContext(AdminUserContext);
  if (!u) throw new Error("useAdminUser must be used inside AdminProviders");
  return u;
}

/**
 * Permissions of the current user, optionally inside a module (mirrors the backend's
 * requireWrite / requireDelete in server/src/lib/permissions.ts).
 */
export function useCan(module?: Module) {
  const user = useAdminUser();
  const isSuper = user.role === "SUPER_ADMIN";
  const isAdmin = isSuper || user.role === "ADMIN";
  return {
    write: module ? canAccess(user.role, module) : true,
    deleteHard: module ? canDelete(user.role, module) : isAdmin,
    manageUsers: isSuper,
    viewActivity: isAdmin,
    isSuper,
    isAdmin,
  };
}

export function AdminProviders({ user, children }: { user: AuthUser | null; children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 15_000, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <AdminUserContext.Provider value={user}>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </AdminUserContext.Provider>
    </QueryClientProvider>
  );
}
