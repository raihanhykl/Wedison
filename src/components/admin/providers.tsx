"use client";

import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { AuthUser } from "@/lib/admin/types";

const AdminUserContext = createContext<AuthUser | null>(null);

export function useAdminUser() {
  const u = useContext(AdminUserContext);
  if (!u) throw new Error("useAdminUser must be used inside AdminProviders");
  return u;
}

/** Permissions derived from role (mirrors requireRole rules in the backend). */
export function useCan() {
  const user = useAdminUser();
  const isSuper = user.role === "SUPER_ADMIN";
  const isAdmin = isSuper || user.role === "ADMIN";
  return {
    write: true, // EDITOR ke atas
    deleteHard: isAdmin,
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
