"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Copy, Loader2, Lock, MoreHorizontal, Pencil, Plus, ShieldCheck, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { useAdminUser } from "@/components/admin/providers";
import { api, errorMessage } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import { ROLE_COLOR_CLASS, type PermissionCatalog, type Role, type RoleColor } from "@/lib/admin/types";
import { RoleDot, dependentsOf, describePermissions, expandPermissions, useRoleCatalog, useRoles } from "./role-shared";

const KEY_RE = /^[a-z][a-z0-9_]{1,39}$/;

export function slugifyRoleKey(name: string) {
  return name.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/^[^a-z]+/, "").slice(0, 40);
}

export function RolesView({ onShowMembers }: { onShowMembers: (roleId: string) => void }) {
  const qc = useQueryClient();
  const me = useAdminUser();
  const roles = useRoles();
  const catalog = useRoleCatalog();
  const [editing, setEditing] = useState<Role | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Role | null>(null);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["roles"] }); qc.invalidateQueries({ queryKey: ["users"] }); };
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/roles/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Role deleted"); setToDelete(null); invalidate(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const duplicate = useMutation({
    mutationFn: (id: string) => api<{ data: Role }>(`/admin/roles/${id}/duplicate`, { method: "POST", body: {} }).then((r) => r.data),
    onSuccess: (r) => { toast.success(`Created ${r.name}`); invalidate(); setEditing(r); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  if (roles.isLoading || catalog.isLoading) {
    return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}</div>;
  }
  if (!roles.data || !catalog.data) return <EmptyState icon={ShieldCheck} title="Roles could not be loaded" description={errorMessage(roles.error ?? catalog.error)} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {roles.data.length} role{roles.data.length === 1 ? "" : "s"} · a user has exactly one role. Permissions take effect immediately, no re-login needed.
        </p>
        <Button onClick={() => setEditing("new")}><Plus /> New role</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.data.map((role) => {
          const summary = describePermissions(role, catalog.data);
          const isMine = role.id === me.role.id;
          const color = role.color ? ROLE_COLOR_CLASS[role.color] : null;
          return (
            <div key={role.id} className={cn("group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-foreground/20")}>
              <div className="flex items-start gap-3">
                <span className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border", color?.badge ?? "bg-muted text-muted-foreground")}>
                  {role.isSystem ? <Lock className="size-4" /> : <ShieldCheck className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-bold tracking-tight">{role.name}</h3>
                    {role.isSystem && <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">Built-in</Badge>}
                    {isMine && <Badge variant="outline" className="text-[10px] uppercase tracking-wide">Your role</Badge>}
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground">{role.key}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="-mr-2 -mt-1 size-8" aria-label={`Actions for ${role.name}`}><MoreHorizontal /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setEditing(role)}>{role.isSystem ? <><ShieldCheck /> View permissions</> : <><Pencil /> Edit</>}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicate.mutate(role.id)}><Copy /> Duplicate</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShowMembers(role.id)}><Users /> Show members</DropdownMenuItem>
                    {!role.isSystem && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" disabled={role._count.users > 0} onClick={() => setToDelete(role)}>
                          <Trash2 /> Delete{role._count.users > 0 ? " (has members)" : ""}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {role.description && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{role.description}</p>}

              <ul className="mt-4 space-y-1.5 text-sm">
                {summary.length ? summary.map((s) => (
                  <li key={s.module} className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    <span className="min-w-0"><span className="font-medium">{s.module}</span> <span className="text-muted-foreground">· {s.detail}</span></span>
                  </li>
                )) : <li className="text-muted-foreground">No permissions yet — members can only open My Account.</li>}
              </ul>

              <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                <button type="button" onClick={() => onShowMembers(role.id)} className="flex items-center gap-1.5 rounded-md px-1.5 py-1 -ml-1.5 hover:bg-muted hover:text-foreground">
                  <Users className="size-3.5" /> {role._count.users} member{role._count.users === 1 ? "" : "s"}
                </button>
                <span>{role.permissions.includes("*") ? "All permissions" : `${role.permissions.length} permission${role.permissions.length === 1 ? "" : "s"}`}</span>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted"><Plus className="size-4" /></span>
          Create a role for a new division
        </button>
      </div>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {editing && <RoleEditor key={editing === "new" ? "new" : editing.id} role={editing === "new" ? null : editing} catalog={catalog.data} existing={roles.data} onDone={() => { setEditing(null); invalidate(); }} />}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete role ${toDelete?.name}?`}
        description="The role is removed permanently. Users cannot be assigned to it anymore."
        loading={remove.isPending}
        onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }}
      />
    </div>
  );
}

function RoleEditor({ role, catalog, existing, onDone }: { role: Role | null; catalog: PermissionCatalog; existing: Role[]; onDone: () => void }) {
  const readOnly = !!role?.isSystem;
  const [name, setName] = useState(role?.name ?? "");
  const [key, setKey] = useState(role?.key ?? "");
  const [keyTouched, setKeyTouched] = useState(!!role);
  const [description, setDescription] = useState(role?.description ?? "");
  const [color, setColor] = useState<RoleColor | null>(role?.color ?? "blue");
  const allKeys = useMemo(() => catalog.modules.flatMap((m) => m.permissions.map((p) => p.key)), [catalog]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(role?.permissions.includes("*") ? allKeys : (role?.permissions ?? [])));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { if (!keyTouched) setKey(slugifyRoleKey(name)); }, [name, keyTouched]);

  const nameClash = existing.some((r) => r.id !== role?.id && r.name.trim().toLowerCase() === name.trim().toLowerCase());
  const keyClash = !role && existing.some((r) => r.key === key);
  const errors = {
    name: name.trim().length < 2 ? "Name must be at least 2 characters" : nameClash ? "A role with this name already exists" : null,
    key: !role && !KEY_RE.test(key) ? "2–40 chars: lowercase letters, digits and underscores, starting with a letter" : keyClash ? "This key is already used" : null,
  };
  const valid = !errors.name && !errors.key;

  const save = useMutation({
    mutationFn: () => {
      const body = { name: name.trim(), description: description.trim() || null, color, permissions: [...selected] };
      return role
        ? api<{ data: Role }>(`/admin/roles/${role.id}`, { method: "PATCH", body }).then((r) => r.data)
        : api<{ data: Role }>("/admin/roles", { method: "POST", body: { ...body, key } }).then((r) => r.data);
    },
    onSuccess: (r) => { toast.success(role ? `Role ${r.name} updated` : `Role ${r.name} created`); onDone(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const toggle = (k: string, on: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) expandPermissions([k], catalog).forEach((x) => next.add(x));
      else { next.delete(k); dependentsOf(k, catalog).forEach((d) => next.delete(d)); }
      return next;
    });
  };
  const toggleModule = (keys: string[], on: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) expandPermissions(keys, catalog).forEach((x) => next.add(x));
      else keys.forEach((k) => { next.delete(k); dependentsOf(k, catalog).forEach((d) => next.delete(d)); });
      return next;
    });
  };
  /** Which selected permission requires `k` (shown as a hint). */
  const requiredBy = (k: string) => {
    for (const m of catalog.modules) for (const p of m.permissions) if (p.key !== k && selected.has(p.key) && expandPermissions([p.key], catalog).has(k)) return p.label;
    return null;
  };

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle className="font-display text-xl">{readOnly ? role!.name : role ? `Edit ${role.name}` : "New role"}</SheetTitle>
        <SheetDescription>
          {readOnly ? "The built-in Super Admin role has every permission and cannot be edited." : "Name the role after the division or job, then tick what its members may do. Required permissions are added automatically."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 px-4 pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Name</Label>
            <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Finance Team" disabled={readOnly} aria-invalid={submitted && !!errors.name} />
            {submitted && errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-key">Key</Label>
            <Input id="role-key" value={key} onChange={(e) => { setKeyTouched(true); setKey(e.target.value.toLowerCase()); }} placeholder="finance_team" disabled={readOnly || !!role} className="font-mono text-xs" aria-invalid={submitted && !!errors.key} />
            <p className="text-xs text-muted-foreground">{role ? "Keys cannot change after creation." : "Stable identifier used in logs; generated from the name."}</p>
            {submitted && errors.key && <p className="text-xs text-destructive">{errors.key}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role-desc">Description <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Textarea id="role-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} maxLength={300} placeholder="What this role is for, shown when assigning it to a user." disabled={readOnly} />
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {catalog.colors.map((c) => (
              <Tooltip key={c}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => setColor(c)}
                    aria-label={c}
                    aria-pressed={color === c}
                    className={cn("flex size-7 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100", ROLE_COLOR_CLASS[c].dot, color === c && "ring-2 ring-foreground/60")}
                  >
                    {color === c && <Check className="size-3.5 text-white" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="capitalize">{c}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label>Permissions</Label>
            <span className="text-xs text-muted-foreground">{readOnly ? "All" : `${selected.size} of ${allKeys.length}`} selected</span>
          </div>
          {catalog.modules.map((m) => {
            const keys = m.permissions.map((p) => p.key);
            const n = keys.filter((k) => selected.has(k)).length;
            const state: boolean | "indeterminate" = n === 0 ? false : n === keys.length ? true : "indeterminate";
            return (
              <div key={m.key} className={cn("rounded-xl border border-border", n > 0 && "border-primary/30 bg-primary/[0.03]")}>
                <label className="flex cursor-pointer items-start gap-3 px-4 py-3">
                  <Checkbox checked={state} disabled={readOnly} onCheckedChange={(v) => toggleModule(keys, v === true)} aria-label={`All ${m.label} permissions`} className="mt-0.5" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-semibold">{m.label}{n > 0 && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">{n}/{keys.length}</span>}</span>
                    <span className="block text-xs text-muted-foreground">{m.description}</span>
                  </span>
                </label>
                {m.permissions.length > 1 && (
                  <ul className="border-t border-border/70 px-4 py-2">
                    {m.permissions.map((p) => {
                      const on = selected.has(p.key);
                      const req = on ? requiredBy(p.key) : null;
                      return (
                        <li key={p.key}>
                          <label className="flex cursor-pointer items-start gap-3 rounded-md px-1 py-2 hover:bg-muted/50">
                            <Checkbox checked={on} disabled={readOnly} onCheckedChange={(v) => toggle(p.key, v === true)} aria-label={`${m.label}: ${p.label}`} className="mt-0.5" />
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-2 text-sm">{p.label}{req && <span className="text-[11px] text-muted-foreground">required by {req}</span>}</span>
                              <span className="block text-xs text-muted-foreground">{p.description}</span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SheetFooter className="sticky bottom-0 flex-row items-center justify-between border-t border-border bg-background">
        {readOnly ? (
          <Button type="button" variant="outline" className="ml-auto" onClick={onDone}>Close</Button>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><RoleDot role={{ color }} /> {name.trim() || "Untitled role"}</div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
              <Button type="button" disabled={save.isPending} onClick={() => { setSubmitted(true); if (valid) save.mutate(); }}>
                {save.isPending && <Loader2 className="animate-spin" />} {role ? "Save changes" : "Create role"}
              </Button>
            </div>
          </>
        )}
      </SheetFooter>
    </div>
  );
}
