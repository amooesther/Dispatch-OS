"use client";

import { useEffect, useState } from "react";
import { mockActivity } from "@/mocks";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { Package, Truck, Navigation, Settings } from "lucide-react";
import type { Activity } from "@/types";

const typeIcon = {
  order: <Package size={13} />,
  driver: <Truck size={13} />,
  delivery: <Navigation size={13} />,
  system: <Settings size={13} />,
};

const typeColor = {
  order: "bg-[var(--primary-muted)] text-[var(--primary)]",
  driver: "bg-[var(--success-bg)] text-[var(--success-text)]",
  delivery: "bg-[var(--info-bg)] text-[var(--info-text)]",
  system: "bg-[var(--muted-bg)] text-[var(--muted)]",
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(mockActivity.slice(0, 8));

  // Simulate real-time: prepend a new activity every 12s
  useEffect(() => {
    const messages = [
      { message: "Adaeze Nwosu completed delivery of ND-10044", type: "delivery" as const },
      { message: "New order ND-10130 received from Precious Pharmacy", type: "order" as const },
      { message: "Kolade Martins picked up order ND-10121", type: "driver" as const },
      { message: "Order ND-10088 status updated to in transit", type: "delivery" as const },
      { message: "Funmi Akintoye is now available", type: "driver" as const },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const item = messages[idx % messages.length];
      const newActivity: Activity = {
        id: `live-${Date.now()}`,
        message: item.message,
        type: item.type,
        createdAt: new Date().toISOString(),
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
      idx++;
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Live Activity</CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-[var(--success-text)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
          Live
        </span>
      </CardHeader>
      <ul role="list" className="space-y-0 divide-y divide-[var(--border)] -mx-5 overflow-y-auto max-h-72">
        {activities.map((a, i) => (
          <li
            key={a.id}
            className={cn(
              "flex items-start gap-3 px-5 py-3 transition-colors",
              i === 0 && "bg-[var(--muted-bg)]"
            )}
          >
            <span className={cn(
              "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
              typeColor[a.type]
            )}>
              {typeIcon[a.type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--foreground)] leading-snug">{a.message}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{formatRelativeTime(a.createdAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
