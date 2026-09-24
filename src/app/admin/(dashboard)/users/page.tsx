import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin/server";
import { UsersView } from "./users-view";

export const metadata = { title: "Pengguna" };

export default async function UsersPage() {
  const user = await getSessionUser();
  if (user?.role !== "SUPER_ADMIN") redirect("/admin");
  return <UsersView />;
}
