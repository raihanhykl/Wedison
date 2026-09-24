import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, STATION_STATUS_LABEL, type ContentStatus, type StationStatus } from "@/lib/admin/types";

const STYLE: Record<ContentStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground border-transparent",
  SCHEDULED: "bg-chart-4/15 text-foreground border-chart-4/40",
  PUBLISHED: "bg-primary/10 text-primary border-primary/20",
  ARCHIVED: "bg-secondary text-secondary-foreground border-transparent",
};

export function StatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STYLE[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

const STATION_STYLE: Record<StationStatus, string> = {
  OPERATIONAL: "bg-primary/10 text-primary border-primary/20",
  COMING_SOON: "bg-chart-4/15 text-foreground border-chart-4/40",
  MAINTENANCE: "bg-secondary text-secondary-foreground border-transparent",
  CLOSED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StationStatusBadge({ status }: { status: StationStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATION_STYLE[status])}>
      {STATION_STATUS_LABEL[status]}
    </Badge>
  );
}
