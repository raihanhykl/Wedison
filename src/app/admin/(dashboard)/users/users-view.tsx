"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MoreHorizontal, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { initials } from "@/components/admin/nav-user";
import { useAdminUser } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { formatDateTime } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { ROLE_LABEL, type Paginated, type User, type UserRole } from "@/lib/admin/types";

const schema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(80),
  email: z.string().email("Invalid email address"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
  password: z.string().max(128).optional(),
  isActive: z.boolean(),
});
type Values = z.infer<typeof schema>;

export function UsersView() {
  const qc = useQueryClient();
  const me = useAdminUser();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<User | "new" | null>(null);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const dq = useDebounce(q);

  const { data, isLoading } = useQuery({
    queryKey: ["users", { page, q: dq }],
    queryFn: () => api<Paginated<User>>("/admin/users", { query: { page, limit: 20, q: dq } }),
    placeholderData: keepPreviousData,
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["users"] });
  const toggle = useMutation({
    mutationFn: (v: { id: string; isActive: boolean }) => api(`/admin/users/${v.id}`, { method: "PATCH", body: { isActive: v.isActive } }),
    onSuccess: invalidate,
    onError: (e) => toast.error(errorMessage(e)),
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
              <p className="font-medium">{u.name} {u.id === me.id && <span className="text-xs text-muted-foreground">(you)</span>}</p>
              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    { id: "role", header: "Role", size: 130, cell: ({ row }) => <Badge variant={row.original.role === "SUPER_ADMIN" ? "default" : "outline"}>{ROLE_LABEL[row.original.role]}</Badge> },
    { id: "articles", header: "Articles", size: 80, cell: ({ row }) => <span className="font-mono text-xs">{row.original._count?.articles ?? 0}</span> },
    { id: "lastLogin", header: "Last sign-in", size: 160, cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDateTime(row.original.lastLoginAt)}</span> },
    {
      id: "active", header: "Active", size: 80,
      cell: ({ row }) => <Switch checked={row.original.isActive} disabled={row.original.id === me.id} onCheckedChange={(v) => toggle.mutate({ id: row.original.id, isActive: v })} aria-label="Active" />,
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

  return (
    <>
      <PageHeader
        title="Users"
        description="Super Admin: manage users and every module. Admin: all content. Editor: write/edit, no permanent deletes."
        actions={<Button onClick={() => setEditing("new")}><Plus /> Add user</Button>}
      />
      <Input placeholder="Search name / email…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
      <DataTable columns={columns} data={data?.items ?? []} loading={isLoading} meta={data?.meta} onPageChange={setPage} emptyState={<EmptyState icon={Users} title="No users" />} />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          {editing && <UserForm key={editing === "new" ? "new" : editing.id} user={editing === "new" ? null : editing} isSelf={editing !== "new" && editing.id === me.id} onDone={() => { setEditing(null); invalidate(); }} />}
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title={`Delete ${toDelete?.name}?`} description="Their articles are kept (author becomes empty)." loading={remove.isPending} onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }} />
    </>
  );
}

function UserForm({ user, isSelf, onDone }: { user: User | null; isSelf: boolean; onDone: () => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema.refine((v) => user || (v.password && v.password.length >= 8), { message: "Password must be at least 8 characters", path: ["password"] })),
    defaultValues: user ? { name: user.name, email: user.email, role: user.role, password: "", isActive: user.isActive } : { name: "", email: "", role: "EDITOR", password: "", isActive: true },
  });
  const save = useMutation({
    mutationFn: (v: Values) => {
      const body = { ...v, password: v.password || undefined };
      return user ? api(`/admin/users/${user.id}`, { method: "PATCH", body }) : api("/admin/users", { method: "POST", body });
    },
    onSuccess: () => { toast.success("User saved"); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{user ? "Edit user" : "New user"}</DialogTitle>
          <DialogDescription>Share the password with the user directly; they can change it under My Account.</DialogDescription>
        </DialogHeader>
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={isSelf}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>{(Object.keys(ROLE_LABEL) as UserRole[]).map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}</SelectContent>
              </Select>
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
          <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" />} Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
