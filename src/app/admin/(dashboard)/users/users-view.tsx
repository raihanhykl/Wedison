"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MoreHorizontal, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { initials } from "@/components/admin/nav-user";
import { useAdminUser } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { formatDateTime } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Paginated, Role, User } from "@/lib/admin/types";
import { RoleBadge, RoleDot, useRoles } from "./role-shared";

const schema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(80),
  email: z.string().email("Invalid email address"),
  roleId: z.string().min(1, "Choose a role"),
  password: z.string().max(128).optional(),
  isActive: z.boolean(),
});
type Values = z.infer<typeof schema>;

export function UsersView({ roleFilter, onRoleFilterChange }: { roleFilter?: string; onRoleFilterChange: (id: string | undefined) => void }) {
  const qc = useQueryClient();
  const me = useAdminUser();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<"all" | "true" | "false">("all");
  const [editing, setEditing] = useState<User | "new" | null>(null);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const dq = useDebounce(q);
  const roles = useRoles();

  const query = { page, limit: 20, q: dq, roleId: roleFilter, active: active === "all" ? undefined : active };
  const { data, isLoading } = useQuery({
    queryKey: ["users", query],
    queryFn: () => api<Paginated<User>>("/admin/users", { query }),
    placeholderData: keepPreviousData,
  });
  const invalidate = () => { qc.invalidateQueries({ queryKey: ["users"] }); qc.invalidateQueries({ queryKey: ["roles"] }); };
  const toggle = useMutation({
    mutationFn: (v: { id: string; isActive: boolean }) => api(`/admin/users/${v.id}`, { method: "PATCH", body: { isActive: v.isActive } }),
    onSuccess: (_r, v) => { toast.success(v.isActive ? "User activated" : "User deactivated"); invalidate(); },
    onError: (e) => { toast.error(errorMessage(e)); invalidate(); },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/users/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("User deleted"); setToDelete(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const columns = useMemo<ColumnDef<User, unknown>[]>(() => [
    {
      id: "user", header: "User",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9"><AvatarImage src={u.avatarUrl ?? undefined} /><AvatarFallback className="text-xs">{initials(u.name)}</AvatarFallback></Avatar>
            <div className="min-w-0">
              <p className={cn("font-medium", !u.isActive && "text-muted-foreground line-through decoration-muted-foreground/50")}>{u.name} {u.id === me.id && <span className="text-xs font-normal text-muted-foreground">(you)</span>}</p>
              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    { id: "role", header: "Role", size: 170, cell: ({ row }) => <RoleBadge role={row.original.role} /> },
    { id: "articles", header: "Articles", size: 80, cell: ({ row }) => <span className="font-mono text-xs">{row.original._count?.articles ?? 0}</span> },
    { id: "lastLogin", header: "Last sign-in", size: 160, cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.lastLoginAt)}</span> },
    {
      id: "active", header: "Active", size: 80,
      cell: ({ row }) => <Switch checked={row.original.isActive} disabled={row.original.id === me.id || toggle.isPending} onCheckedChange={(v) => toggle.mutate({ id: row.original.id, isActive: v })} aria-label="Active" />,
    },
    {
      id: "actions", size: 48,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(row.original)}><Pencil /> Edit</DropdownMenuItem>
            {row.original.id !== me.id && (<><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setToDelete(row.original)}><Trash2 /> Delete</DropdownMenuItem></>)}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [me.id, toggle]);

  const filterRole = roles.data?.find((r) => r.id === roleFilter);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Search name / email…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={roleFilter ?? "all"} onValueChange={(v) => { onRoleFilterChange(v === "all" ? undefined : v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-52" aria-label="Filter by role"><SelectValue placeholder="All roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.data?.map((r) => (
              <SelectItem key={r.id} value={r.id}><span className="flex items-center gap-2"><RoleDot role={r} /> {r.name} <span className="text-muted-foreground">· {r._count.users}</span></span></SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={active} onValueChange={(v) => { setActive(v as typeof active); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Active & inactive</SelectItem>
            <SelectItem value="true">Active only</SelectItem>
            <SelectItem value="false">Inactive only</SelectItem>
          </SelectContent>
        </Select>
        {filterRole && (
          <Button variant="ghost" size="sm" onClick={() => onRoleFilterChange(undefined)}><X /> Clear role filter</Button>
        )}
        <div className="sm:ml-auto"><Button onClick={() => setEditing("new")}><Plus /> Add user</Button></div>
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        emptyState={<EmptyState icon={Users} title={filterRole ? `No members in ${filterRole.name}` : "No users"} description={filterRole ? "Assign this role to a user from the Edit dialog." : undefined} />}
      />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          {editing && (
            <UserForm
              key={editing === "new" ? "new" : editing.id}
              user={editing === "new" ? null : editing}
              isSelf={editing !== "new" && editing.id === me.id}
              roles={roles.data ?? []}
              defaultRoleId={roleFilter}
              onDone={() => { setEditing(null); invalidate(); }}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.name}?`}
        description="Their articles and uploads are kept (author becomes empty). This cannot be undone."
        loading={remove.isPending}
        onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }}
      />
    </>
  );
}

function UserForm({ user, isSelf, roles, defaultRoleId, onDone }: { user: User | null; isSelf: boolean; roles: Role[]; defaultRoleId?: string; onDone: () => void }) {
  const fallbackRole = roles.find((r) => r.key === "editor")?.id ?? roles.find((r) => !r.isSystem)?.id ?? "";
  const form = useForm<Values>({
    resolver: zodResolver(schema.refine((v) => user || (v.password && v.password.length >= 8), { message: "Password must be at least 8 characters", path: ["password"] })),
    defaultValues: user
      ? { name: user.name, email: user.email, roleId: user.role.id, password: "", isActive: user.isActive }
      : { name: "", email: "", roleId: defaultRoleId ?? fallbackRole, password: "", isActive: true },
  });
  const save = useMutation({
    mutationFn: (v: Values) => {
      const body = { ...v, password: v.password || undefined };
      return user ? api(`/admin/users/${user.id}`, { method: "PATCH", body }) : api("/admin/users", { method: "POST", body });
    },
    onSuccess: () => { toast.success(user ? "User updated" : "User added"); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const selectedRole = roles.find((r) => r.id === form.watch("roleId"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{user ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>{user ? "Change the name, email, role or password." : "The new user can sign in right away with this password."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="roleId" render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isSelf}>
                <FormControl><SelectTrigger><SelectValue placeholder="Choose a role" /></SelectTrigger></FormControl>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      <span className="flex items-center gap-2"><RoleDot role={r} /> {r.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{isSelf ? "You cannot change your own role." : selectedRole?.description || (selectedRole ? `${selectedRole.permissions.includes("*") ? "Every" : selectedRole.permissions.length} permission${selectedRole.permissions.length === 1 ? "" : "s"}` : "Roles are managed in the Roles tab.")}</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>{user ? "New password" : "Password"}</FormLabel>
              <FormControl><Input type="password" autoComplete="new-password" placeholder={user ? "leave blank to keep" : "min. 8 characters"} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
            <div><FormLabel className="font-normal">Active account</FormLabel><FormDescription>Inactive users cannot sign in.</FormDescription></div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSelf} /></FormControl>
          </FormItem>
        )} />
        <DialogFooter>
          <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} {user ? "Save changes" : "Add user"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
