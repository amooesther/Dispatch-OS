import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  period?: string;
  icon: ReactNode;
  iconColor?: string;
}

export function KpiCard({ title, value, change, period = "vs last week", icon, iconColor = "bg-[var(--primary-muted)]" }: KpiCardProps) {
  const positive = change >= 0;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] flex-shrink-0", iconColor)}>
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {positive
            ? <TrendingUp size={13} className="text-[var(--success)]" />
            : <TrendingDown size={13} className="text-[var(--danger)]" />
          }
          <span className={cn("text-xs font-medium", positive ? "text-[var(--success-text)]" : "text-[var(--danger-text)]")}>
            {positive ? "+" : ""}{change.toFixed(1)}%
          </span>
          <span className="text-xs text-[var(--muted)]">{period}</span>
        </div>
      </div>
    </Card>
  );
}
