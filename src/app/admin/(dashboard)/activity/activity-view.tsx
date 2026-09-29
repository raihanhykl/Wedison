"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ScrollText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { api } from "@/lib/admin/api";
import { formatDateTime } from "@/lib/admin/format";
import { useDebounce } from "@/hooks/use-debounce";
import type { ActivityLog, Paginated } from "@/lib/admin/types";

const ENTITIES = ["article", "press", "social", "media", "topic", "user", "station", "auth"];

const columns: ColumnDef<ActivityLog, unknown>[] = [
  { accessorKey: "createdAt", header: "Time", cell: ({ row }) => <span className="font-mono text-xs whitespace-nowrap">{formatDateTime(row.original.createdAt)}</span>, size: 160 },
  { accessorKey: "user", header: "User", cell: ({ row }) => <span className="font-medium">{row.original.user?.name ?? "System"}</span> },
  { accessorKey: "action", header: "Action", cell: ({ row }) => <Badge variant="outline" className="font-mono text-[11px]">{row.original.action}</Badge>, size: 110 },
  { accessorKey: "entity", header: "Entity", cell: ({ row }) => <span className="text-muted-foreground">{row.original.entity}</span>, size: 110 },
  { accessorKey: "summary", header: "Summary", cell: ({ row }) => <span>{row.original.summary ?? "—"}</span> },
  { accessorKey: "ip", header: "IP", cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.ip ?? "—"}</span>, size: 120 },
];

export function ActivityView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [q, setQ] = useState("");
  const [entity, setEntity] = useState<string>("all");
  const dq = useDebounce(q);

  const { data, isLoading } = useQuery({
    queryKey: ["activity", { page, limit, q: dq, entity }],
    queryFn: () => api<Paginated<ActivityLog>>("/admin/activity", { query: { page, limit, q: dq, entity: entity === "all" ? undefined : entity } }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <PageHeader title="Activity Log" description="Audit trail of changes made by every admin user." />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search summary…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="sm:max-w-xs" />
        <Select value={entity} onValueChange={(v) => { setEntity(v); setPage(1); }}>
          <SelectTrigger className="sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            {ENTITIES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        meta={data?.meta}
        onPageChange={setPage}
        onLimitChange={(l) => { setLimit(l); setPage(1); }}
        emptyState={<EmptyState icon={ScrollText} title="No activity yet" />}
      />
    </>
  );
}
