"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, errorMessage } from "@/lib/admin/api";
import type { AdminTeaser } from "@/lib/admin/types";
import { TeaserForm } from "../teaser-form";

export function TeaserEditLoader({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({ queryKey: ["teaser", id], queryFn: () => api<{ data: AdminTeaser }>(`/admin/teasers/${id}`).then((r) => r.data) });
  if (isLoading) return <div className="grid gap-6 lg:grid-cols-[1fr_320px]"><Skeleton className="h-[640px] rounded-xl" /><Skeleton className="h-[420px] rounded-xl" /></div>;
  if (error || !data) return <Alert variant="destructive"><AlertTitle>The teaser could not be loaded</AlertTitle><AlertDescription>{errorMessage(error)}</AlertDescription></Alert>;
  return <TeaserForm key={data.id} teaser={data} />;
}
