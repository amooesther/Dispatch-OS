"use client";

import { useState } from "react";
import type { NotificationType } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import {
  Bell, Package, Truck, AlertTriangle, CheckCircle,
  Info, CheckCheck, ChevronDown, MailOpen, Mail,
} from "lucide-react";

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  new_order:          <Package size={15} />,
  delivery_completed: <CheckCircle size={15} />,
  delivery_delayed:   <AlertTriangle size={15} />,
  driver_unavailable: <Truck size={15} />,
  system_update:      <Info size={15} />,
  driver_assigned:    <Truck size={15} />,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  new_order:          "bg-[var(--primary-muted)] text-[var(--primary)]",
  delivery_completed: "bg-[var(--success-bg)] text-[var(--success-text)]",
  delivery_delayed:   "bg-[var(--warning-bg)] text-[var(--warning-text)]",
  driver_unavailable: "bg-[var(--danger-bg)] text-[var(--danger-text)]",
  system_update:      "bg-[var(--muted-bg)] text-[var(--muted)]",
  driver_assigned:    "bg-[var(--info-bg)] text-[var(--info-text)]",
};

const TYPE_LABEL: Record<NotificationType, string> = {
  new_order:          "New Order",
  delivery_completed: "Completed",
  delivery_delayed:   "Delayed",
  driver_unavailable: "Driver Alert",
  system_update:      "System",
  driver_assigned:    "Assigned",
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    toggleNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();

  const [filter, setFilter]   = useState<"all" | "unread">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const unread    = notifications.filter((n) => !n.read);
  const displayed = filter === "unread" ? unread : notifications;

  function handleRowClick(id: string) {
    const isExpanding = expanded !== id;
    // Expand the row
    setExpanded(isExpanding ? id : null);
    // Auto-mark as read when opened
    if (isExpanding) {
      markNotificationRead(id);
    }
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Notifications</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Filter tabs */}
          <div className="flex gap-0.5 bg-[var(--muted-bg)] p-0.5 rounded-[var(--radius-md)]">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all",
                  filter === f
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {f === "unread" ? `Unread (${unread.length})` : `All (${notifications.length})`}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllNotificationsRead}
              className="gap-1.5"
            >
              <CheckCheck size={13} /> Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 text-xs text-[var(--success-text)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
        Live — new notifications arrive automatically every 15 s
      </div>

      {/* Empty state */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Bell className="h-12 w-12 text-[var(--muted)] opacity-30 mb-4" />
          <p className="font-semibold text-[var(--foreground)]">No notifications</p>
          <p className="text-sm text-[var(--muted)] mt-1">
            {filter === "unread"
              ? "You have no unread notifications."
              : "Nothing here yet."}
          </p>
          {filter === "unread" && (
            <button
              onClick={() => setFilter("all")}
              className="mt-3 text-sm text-[var(--primary)] hover:underline"
            >
              View all notifications
            </button>
          )}
        </div>
      ) : (
        <Card padding="none">
          <ul
            role="list"
            aria-live="polite"
            aria-atomic="false"
            className="divide-y divide-[var(--border)]"
          >
            {displayed.map((n) => {
              const isExpanded = expanded === n.id;
              return (
                <li key={n.id} className={cn(!n.read && "bg-[var(--primary-muted)]/20")}>
                  {/* ── Clickable row header ─────────────────────────── */}
                  <button
                    onClick={() => handleRowClick(n.id)}
                    aria-expanded={isExpanded}
                    className={cn(
                      "w-full flex items-start gap-4 px-5 py-4 text-left",
                      "transition-colors hover:bg-[var(--muted-bg)]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-[-2px]"
                    )}
                  >
                    {/* Type icon */}
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                        TYPE_COLORS[n.type]
                      )}
                      aria-hidden="true"
                    >
                      {TYPE_ICON[n.type]}
                    </span>

                    {/* Title + preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "text-sm font-semibold leading-snug",
                            n.read ? "text-[var(--muted)]" : "text-[var(--foreground)]"
                          )}
                        >
                          {n.title}
                        </span>
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          TYPE_COLORS[n.type]
                        )}>
                          {TYPE_LABEL[n.type]}
                        </span>
                        {!n.read && (
                          <span
                            className="h-2 w-2 rounded-full bg-[var(--primary)] flex-shrink-0"
                            aria-label="Unread"
                          />
                        )}
                      </div>
                      {/* Show message preview when collapsed */}
                      {!isExpanded && (
                        <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
                          {n.message}
                        </p>
                      )}
                      <p className="text-xs text-[var(--muted)] mt-1">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                      size={15}
                      className={cn(
                        "flex-shrink-0 text-[var(--muted)] mt-1 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {/* ── Expanded body ────────────────────────────────── */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-0 ml-12 animate-fade-in">
                      {/* Full message */}
                      <p className="text-sm text-[var(--foreground)] leading-relaxed bg-[var(--muted-bg)] rounded-[var(--radius-md)] px-4 py-3">
                        {n.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNotificationRead(n.id);
                          }}
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-[var(--radius-md)] transition-colors",
                            n.read
                              ? "text-[var(--primary)] hover:bg-[var(--primary-muted)]"
                              : "text-[var(--muted)] hover:bg-[var(--muted-bg)]"
                          )}
                        >
                          {n.read
                            ? <><Mail size={12} /> Mark as unread</>
                            : <><MailOpen size={12} /> Mark as read</>
                          }
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(null);
                          }}
                          className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--muted-bg)] transition-colors"
                        >
                          Collapse
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
