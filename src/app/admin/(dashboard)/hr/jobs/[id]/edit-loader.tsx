"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, errorMessage } from "@/lib/admin/api";
import type { Job } from "@/lib/admin/types";
import { JobForm } from "../job-form";

export function JobEditLoader({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({ queryKey: ["hr-job", id], queryFn: () => api<{ data: Job }>(`/admin/hr/jobs/${id}`).then((r) => r.data) });
  if (isLoading) return <div className="grid gap-6 lg:grid-cols-[1fr_340px]"><Skeleton className="h-[600px] rounded-xl" /><Skeleton className="h-[420px] rounded-xl" /></div>;
  if (error || !data) return <Alert variant="destructive"><AlertTitle>The job opening could not be loaded</AlertTitle><AlertDescription>{errorMessage(error)}</AlertDescription></Alert>;
  return <JobForm job={data} />;
}
