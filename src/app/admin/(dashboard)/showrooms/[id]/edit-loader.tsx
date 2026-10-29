"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, errorMessage } from "@/lib/admin/api";
import type { AdminShowroomDetail } from "@/lib/admin/types";
import { ShowroomForm } from "../showroom-form";

export function ShowroomEditLoader({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({ queryKey: ["showroom", id], queryFn: () => api<{ data: AdminShowroomDetail }>(`/admin/showrooms/${id}`).then((r) => r.data) });
  if (isLoading) return <div className="grid gap-6 lg:grid-cols-[1fr_320px]"><Skeleton className="h-[640px] rounded-xl" /><Skeleton className="h-[360px] rounded-xl" /></div>;
  if (error || !data) return <Alert variant="destructive"><AlertTitle>The showroom could not be loaded</AlertTitle><AlertDescription>{errorMessage(error)}</AlertDescription></Alert>;
  return <ShowroomForm key={data.id} showroom={data} />;
}
