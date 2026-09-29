import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminProviders } from "@/components/admin/providers";
import { getSessionUser } from "@/lib/admin/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Verifikasi sesi ke backend (middleware hanya cek keberadaan cookie).
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminProviders user={user}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <AdminHeader />
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminProviders>
  );
}
