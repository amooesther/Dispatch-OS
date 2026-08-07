"use client";

import { useState } from "react";
import { mockNotifications } from "@/mocks";
import type { Notification, NotificationType } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import {
  Bell, Package, Truck, AlertTriangle, CheckCircle,
  Info, CheckCheck,
} from "lucide-react";

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  new_order:           <Package size={14} />,
  delivery_completed:  <CheckCircle size={14} />,
  delivery_delayed:    <AlertTriangle size={14} />,
  driver_unavailable:  <Truck size={14} />,
  system_update:       <Info size={14} />,
  driver_assigned:     <Truck size={14} />,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  new_order:           "bg-[var(--primary-muted)] text-[var(--primary)]",
  delivery_completed:  "bg-[var(--success-bg)] text-[var(--success-text)]",
  delivery_delayed:    "bg-[var(--warning-bg)] text-[var(--warning-text)]",
  driver_unavailable:  "bg-[var(--danger-bg)] text-[var(--danger-text)]",
  system_update:       "bg-[var(--muted-bg)] text-[var(--muted)]",
  driver_assigned:     "bg-[var(--info-bg)] text-[var(--info-text)]",
};

export default function NotificationsPage() {
  const { setUnreadCount } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unread = notifications.filter((n) => !n.read);
  const displayed = filter === "unread" ? unread : notifications;

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(Math.max(0, unread.length - 1));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {unread.length > 0 ? `${unread.length} unread notification${unread.length !== 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-0.5 bg-[var(--muted-bg)] p-0.5 rounded-[var(--radius-md)]">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all capitalize",
                  filter === f
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {f === "unread" ? `Unread (${unread.length})` : "All"}
              </button>
            ))}
          </div>
          {unread.length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck size={13} /> Mark all read
            </Button>
          )}
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Bell className="h-12 w-12 text-[var(--muted)] opacity-30 mb-4" />
          <p className="font-semibold text-[var(--foreground)]">No notifications</p>
          <p className="text-sm text-[var(--muted)] mt-1">
            {filter === "unread" ? "You have no unread notifications." : "Nothing here yet."}
          </p>
        </div>
      ) : (
        <Card padding="none">
          <ul role="list" className="divide-y divide-[var(--border)]">
            {displayed.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "flex items-start gap-4 px-5 py-4 transition-colors",
                  !n.read && "bg-[var(--primary-muted)]/30"
                )}
              >
                <span className={cn(
                  "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                  TYPE_COLORS[n.type]
                )}>
                  {TYPE_ICON[n.type]}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium", !n.read ? "text-[var(--foreground)]" : "text-[var(--muted)]")}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--primary)] flex-shrink-0 mt-1.5" aria-label="Unread" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-0.5">{n.message}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>

                {!n.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markRead(n.id)}
                    className="flex-shrink-0 text-xs"
                  >
                    Mark read
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
