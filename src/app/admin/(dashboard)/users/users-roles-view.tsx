"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/admin/page-header";
import { UsersView } from "./users-view";
import { RolesView } from "./roles-view";

export function UsersRolesView({ initialTab, initialRoleId }: { initialTab: "users" | "roles"; initialRoleId?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "roles">(initialTab);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(initialRoleId);

  const change = (v: string) => {
    const next = v === "roles" ? "roles" : "users";
    setTab(next);
    router.replace(next === "roles" ? "/admin/users?tab=roles" : "/admin/users", { scroll: false });
  };

  return (
    <>
      <PageHeader
        title="Users & Roles"
        description="Team accounts and what each role may open, change or delete. Roles are fully custom: build one per division and assign it to its members."
      />
      <Tabs value={tab} onValueChange={change}>
        <TabsList>
          <TabsTrigger value="users"><Users className="size-4" /> Users</TabsTrigger>
          <TabsTrigger value="roles"><ShieldCheck className="size-4" /> Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4 space-y-4">
          <UsersView roleFilter={roleFilter} onRoleFilterChange={setRoleFilter} />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <RolesView onShowMembers={(roleId) => { setRoleFilter(roleId); change("users"); }} />
        </TabsContent>
      </Tabs>
    </>
  );
}
