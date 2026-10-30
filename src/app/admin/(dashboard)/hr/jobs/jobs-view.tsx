"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Archive, ArrowDown, ArrowUp, ArrowUpDown, Briefcase, Copy, ExternalLink, Lock, MoreHorizontal, Pencil, Plus, RotateCcw, Send, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { AuditStamp, JobStatusBadge, jobTitle, locationLabel, useDepartments, useHrPermissions, useLocations } from "@/components/admin/hr/shared";
import { DateRangeFilter, presetRange, rangeQuery, type DateTimeRange } from "@/components/admin/date-range-filter";
import { cn } from "@/lib/utils";
import { api, errorMessage } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import { EMPLOYMENT_LABEL, WORKPLACE_LABEL, type EmploymentType, type Job, type JobStatus, type Paginated, type WorkplaceType } from "@/lib/admin/types";

type Tab = "all" | JobStatus;
type JobsPage = Paginated<Job> & { counts: Partial<Record<JobStatus, number>> };
type Transition = "submit" | "return" | "publish" | "close" | "reopen" | "archive" | "unarchive";
type SortKey = "createdAt" | "updatedAt" | "publishedAt" | "closesAt" | "viewCount" | "applyClicks" | "openings";
type Sort = { key: SortKey; dir: "asc" | "desc" } | null;
type DateField = "createdAt" | "updatedAt" | "publishedAt" | "closesAt";
const DATE_FIELD_LABEL: Record<DateField, string> = { createdAt: "Created", updatedAt: "Updated", publishedAt: "Published", closesAt: "Closes" };

/** Header button cycling desc → asc → default order (server-side sort). */
function SortButton({ label, k, sort, onSort, align }: { label: string; k: SortKey; sort: Sort; onSort: (s: Sort) => void; align?: "right" }) {
  const active = sort?.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  const next: Sort = !active ? { key: k, dir: k === "closesAt" ? "asc" : "desc" } : sort.dir === (k === "closesAt" ? "asc" : "desc") ? { key: k, dir: k === "closesAt" ? "desc" : "asc" } : null;
  return (
    <button
      type="button"
      onClick={() => onSort(next)}
      aria-label={`Sort by ${label}`}
      className={cn("-ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider hover:bg-muted hover:text-foreground", active && "text-foreground", align === "right" && "ml-auto")}
    >
      {label} <Icon className={cn("size-3.5", !active && "opacity-40")} />
    </button>
  );
}

export function JobsView() {
  const qc = useQueryClient();
  const sp = useSearchParams();
  const perm = useHrPermissions();
  const { data: departments } = useDepartments();
  const { data: locations } = useLocations();
  const [tab, setTab] = useState<Tab>((sp.get("status") as Tab) || "all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [departmentId, setDepartmentId] = useState("all");
  const [locationId, setLocationId] = useState("all");
  const [employmentType, setEmploymentType] = useState<"all" | EmploymentType>("all");
  const [workplaceType, setWorkplaceType] = useState<"all" | WorkplaceType>("all");
  const [sort, setSort] = useState<Sort>(null);
  const [dateField, setDateField] = useState<DateField>("createdAt");
  const [range, setRange] = useState<DateTimeRange>(() => presetRange("all"));
  const [toDelete, setToDelete] = useState<Job | null>(null);
  const dq = useDebounce(q);

  const params = {
    page, limit, q: dq,
    status: tab === "all" ? undefined : tab,
    departmentId: departmentId === "all" ? undefined : departmentId,
    locationId: locationId === "all" ? undefined : locationId,
    employmentType: employmentType === "all" ? undefined : employmentType,
    workplaceType: workplaceType === "all" ? undefined : workplaceType,
    sort: sort?.key,
    order: sort?.dir,
    ...(range.from || range.to ? { dateField, ...rangeQuery(range) } : {}),
  };
  const onSort = (s: Sort) => { setSort(s); setPage(1); };
  const { data, isLoading } = useQuery({ queryKey: ["hr-jobs", params], queryFn: () => api<JobsPage>("/admin/hr/jobs", { query: params }), placeholderData: keepPreviousData });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["hr-jobs"] });
    qc.invalidateQueries({ queryKey: ["hr-overview"] });
  };
  const transition = useMutation({
    mutationFn: (v: { id: string; action: Transition }) => api<{ data: Job }>(`/admin/hr/jobs/${v.id}/transition`, { method: "POST", body: { action: v.action } }),
    onSuccess: (_r, v) => { toast.success({ submit: "Submitted for review", return: "Returned to draft", publish: "Job published", close: "Job closed", reopen: "Job reopened", archive: "Job archived", unarchive: "Moved back to drafts" }[v.action]); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const duplicate = useMutation({
    mutationFn: (id: string) => api<{ data: Job }>(`/admin/hr/jobs/${id}/duplicate`, { method: "POST" }),
    onSuccess: () => { toast.success("Copy created as draft"); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/hr/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Job deleted"); setToDelete(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const p = perm.data;
  const columns = useMemo<ColumnDef<Job, unknown>[]>(() => [
    {
      id: "title", header: "Position",
      cell: ({ row }) => {
        const j = row.original;
        const langs = j.translations.map((t) => t.locale);
        return (
          <div className="min-w-[200px] whitespace-normal">
            <Link href={`/admin/hr/jobs/${j.id}`} className="font-medium hover:text-primary">{jobTitle(j)}</Link>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {langs.map((l) => <Badge key={l} variant="outline" className="h-4 px-1 font-mono text-[10px] uppercase">{l}</Badge>)}
              {j.isUrgent && <Badge className="h-4 px-1.5 text-[10px]">Urgent</Badge>}
              <span>{EMPLOYMENT_LABEL[j.employmentType]} · {WORKPLACE_LABEL[j.workplaceType]}</span>
              {j.openings > 1 && <span>· {j.openings} positions</span>}
            </div>
          </div>
        );
      },
    },
    { id: "department", header: "Division", size: 140, cell: ({ row }) => <span className="text-sm">{row.original.department?.nameId ?? <span className="text-muted-foreground">—</span>}</span> },
    { id: "locations", header: "Location", size: 160, cell: ({ row }) => <span className="block min-w-[110px] whitespace-normal text-sm">{row.original.locations.map(locationLabel).join(", ") || <span className="text-muted-foreground">—</span>}</span> },
    { id: "status", header: "Status", size: 130, cell: ({ row }) => <JobStatusBadge status={row.original.status} /> },
    { id: "created", header: () => <SortButton label="Created" k="createdAt" sort={sort} onSort={onSort} />, size: 150, cell: ({ row }) => <div className="text-xs"><AuditStamp stacked user={row.original.createdBy} at={row.original.createdAt} /></div> },
    { id: "updated", header: () => <SortButton label="Updated" k="updatedAt" sort={sort} onSort={onSort} />, size: 150, cell: ({ row }) => <div className="text-xs"><AuditStamp stacked user={row.original.updatedBy} at={row.original.updatedAt} /></div> },
    { id: "closes", header: () => <SortButton label="Closes" k="closesAt" sort={sort} onSort={onSort} />, size: 110, cell: ({ row }) => <span className="whitespace-nowrap text-xs">{row.original.closesAt ? formatDate(row.original.closesAt) : <span className="text-muted-foreground">—</span>}</span> },
    {
      id: "metrics", size: 130,
      header: () => <span className="inline-flex items-center whitespace-nowrap"><SortButton label="Views" k="viewCount" sort={sort} onSort={onSort} /><span aria-hidden className="pl-0.5 pr-2.5">·</span><SortButton label="Apply" k="applyClicks" sort={sort} onSort={onSort} /></span>,
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.viewCount} · {row.original._count?.applyClicks ?? 0}</span>,
    },
    {
      id: "actions", size: 48,
      cell: ({ row }) => {
        const j = row.original;
        const live = j.status === "PUBLISHED" || j.status === "CLOSED";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href={`/admin/hr/jobs/${j.id}`}>{live && !p?.publish ? <><Lock /> View</> : <><Pencil /> Edit</>}</Link></DropdownMenuItem>
              {live && <DropdownMenuItem asChild><a href={`/id/career/${j.slug}/`} target="_blank" rel="noreferrer"><ExternalLink /> View on site</a></DropdownMenuItem>}
              {p?.write && <DropdownMenuItem onClick={() => duplicate.mutate(j.id)}><Copy /> Duplicate</DropdownMenuItem>}
              <DropdownMenuSeparator />
              {j.status === "DRAFT" && p?.write && !p.publish && <DropdownMenuItem onClick={() => transition.mutate({ id: j.id, action: "submit" })}><Send /> Submit for review</DropdownMenuItem>}
              {(j.status === "DRAFT" || j.status === "PENDING_REVIEW") && p?.publish && <DropdownMenuItem onClick={() => transition.mutate({ id: j.id, action: "publish" })}><Send /> Publish</DropdownMenuItem>}
              {j.status === "PENDING_REVIEW" && p?.publish && <DropdownMenuItem onClick={() => transition.mutate({ id: j.id, action: "return" })}><Undo2 /> Return to draft</DropdownMenuItem>}
              {j.status === "PUBLISHED" && p?.publish && <DropdownMenuItem onClick={() => transition.mutate({ id: j.id, action: "close" })}><Lock /> Close</DropdownMenuItem>}
              {j.status === "CLOSED" && p?.publish && <DropdownMenuItem onClick={() => transition.mutate({ id: j.id, action: "reopen" })}><RotateCcw /> Reopen</DropdownMenuItem>}
              {j.status !== "ARCHIVED" && p?.publish && <DropdownMenuItem onClick={() => transition.mutate({ id: j.id, action: "archive" })}><Archive /> Archive</DropdownMenuItem>}
              {j.status === "ARCHIVED" && p?.publish && <DropdownMenuItem onClick={() => transition.mutate({ id: j.id, action: "unarchive" })}><RotateCcw /> Move to drafts</DropdownMenuItem>}
              {p?.delete && (<><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setToDelete(j)}><Trash2 /> Delete</DropdownMenuItem></>)}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [p, duplicate, transition, sort]);

  const counts = data?.counts ?? {};
  const tabLabel = (label: string, n?: number) => <>{label}{n ? <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">{n}</span> : null}</>;

  return (
    <>
      <PageHeader
        title="Job Openings"
        description="Openings shown on the careers page. Published openings close automatically on their closing date."
        actions={p?.write && <Button asChild><Link href="/admin/hr/jobs/new"><Plus /> New job opening</Link></Button>}
      />
      <Tabs value={tab} onValueChange={(v) => { setTab(v as Tab); setPage(1); }}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="PUBLISHED">{tabLabel("Published", counts.PUBLISHED)}</TabsTrigger>
          <TabsTrigger value="PENDING_REVIEW">{tabLabel("Pending review", counts.PENDING_REVIEW)}</TabsTrigger>
          <TabsTrigger value="DRAFT">{tabLabel("Drafts", counts.DRAFT)}</TabsTrigger>
          <TabsTrigger value="CLOSED">{tabLabel("Closed", counts.CLOSED)}</TabsTrigger>
          <TabsTrigger value="ARCHIVED">{tabLabel("Archived", counts.ARCHIVED)}</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-2 lg:flex-row">
        <Input placeholder="Search position…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="lg:max-w-xs" />
        <Select value={departmentId} onValueChange={(v) => { setDepartmentId(v); setPage(1); }}>
          <SelectTrigger className="lg:w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All divisions</SelectItem>
            {departments?.map((d) => <SelectItem key={d.id} value={d.id}>{d.nameId}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={locationId} onValueChange={(v) => { setLocationId(v); setPage(1); }}>
          <SelectTrigger className="lg:w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations?.map((l) => <SelectItem key={l.id} value={l.id}>{locationLabel(l)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={employmentType} onValueChange={(v) => { setEmploymentType(v as typeof employmentType); setPage(1); }}>
          <SelectTrigger className="lg:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(Object.keys(EMPLOYMENT_LABEL) as EmploymentType[]).map((t) => <SelectItem key={t} value={t}>{EMPLOYMENT_LABEL[t]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={workplaceType} onValueChange={(v) => { setWorkplaceType(v as typeof workplaceType); setPage(1); }}>
          <SelectTrigger className="lg:w-[150px]" aria-label="Workplace"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any workplace</SelectItem>
            {(Object.keys(WORKPLACE_LABEL) as WorkplaceType[]).map((t) => <SelectItem key={t} value={t}>{WORKPLACE_LABEL[t]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={dateField} onValueChange={(v) => { setDateField(v as DateField); setPage(1); }}>
          <SelectTrigger className="sm:w-[150px]" aria-label="Date field"><SelectValue /></SelectTrigger>
          <SelectContent>{(Object.keys(DATE_FIELD_LABEL) as DateField[]).map((f) => <SelectItem key={f} value={f}>{DATE_FIELD_LABEL[f]} date</SelectItem>)}</SelectContent>
        </Select>
        <DateRangeFilter value={range} onChange={(r) => { setRange(r); setPage(1); }} align="start" className="sm:w-[280px]" />
        {(sort || range.from || range.to) && (
          <Button variant="ghost" size="sm" onClick={() => { setSort(null); setRange(presetRange("all")); setPage(1); }}><RotateCcw /> Reset sort &amp; dates</Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        emptyState={<EmptyState icon={Briefcase} title="No job openings here" description="Create an opening, then publish it to show it on the careers page." action={p?.write ? <Button asChild><Link href="/admin/hr/jobs/new"><Plus /> New job opening</Link></Button> : undefined} />}
      />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this job opening?"
        description={<>“{toDelete ? jobTitle(toDelete) : ""}” and its view and apply-click history will be deleted permanently. To hide it but keep the history, use <b>Close</b> or <b>Archive</b> instead.</>}
        loading={remove.isPending}
        onConfirm={() => { if (toDelete) remove.mutate(toDelete.id); }}
      />
    </>
  );
}
