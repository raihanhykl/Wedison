"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, errorMessage } from "@/lib/admin/api";
import type { Article } from "@/lib/admin/types";
import { ArticleForm } from "../article-form";

export function ArticleEditLoader({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["article", id],
    queryFn: () => api<{ data: Article }>(`/admin/articles/${id}`).then((r) => r.data),
  });
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-[560px] rounded-xl" />
          <Skeleton className="h-[420px] rounded-xl" />
        </div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Artikel tidak dapat dimuat</AlertTitle>
        <AlertDescription>{errorMessage(error)}</AlertDescription>
      </Alert>
    );
  }
  return <ArticleForm article={data} />;
}
