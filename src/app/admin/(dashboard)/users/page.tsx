import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin/server";
import { hasPermission } from "@/lib/admin/permissions";
import { UsersRolesView } from "./users-roles-view";

export const metadata = { title: "Users & Roles" };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ tab?: string; role?: string }> }) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user, "users.manage")) redirect("/admin");
  const sp = await searchParams;
  return <UsersRolesView initialTab={sp.tab === "roles" ? "roles" : "users"} initialRoleId={sp.role} />;
}
