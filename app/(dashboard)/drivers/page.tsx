"use client";

import { useState } from "react";
import Link from "next/link";
import { mockDrivers } from "@/mocks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { DRIVER_STATUS_LABELS, DRIVER_STATUS_COLORS } from "@/lib/constants";
import type { DriverStatus } from "@/types";
import { Search, Truck, Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type BV = "success" | "warning" | "danger" | "info" | "primary" | "muted";

const STATUS_FILTERS: { label: string; value: DriverStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Busy", value: "busy" },
  { label: "On Break", value: "on_break" },
  { label: "Offline", value: "offline" },
];

export default function DriversPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "all">("all");

  const filtered = mockDrivers.filter((d) => {
    const matchQ = !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.city.toLowerCase().includes(q.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchQ && matchStatus;
  });

  const counts = {
    all: mockDrivers.length,
    available: mockDrivers.filter((d) => d.status === "available").length,
    busy: mockDrivers.filter((d) => d.status === "busy").length,
    on_break: mockDrivers.filter((d) => d.status === "on_break").length,
    offline: mockDrivers.filter((d) => d.status === "offline").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Drivers</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Manage and monitor your delivery fleet.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Available", count: counts.available, color: "text-[var(--success-text)]", bg: "bg-[var(--success-bg)]" },
          { label: "Busy", count: counts.busy, color: "text-[var(--primary)]", bg: "bg-[var(--primary-muted)]" },
          { label: "On Break", count: counts.on_break, color: "text-[var(--warning-text)]", bg: "bg-[var(--warning-bg)]" },
          { label: "Offline", count: counts.offline, color: "text-[var(--muted)]", bg: "bg-[var(--muted-bg)]" },
        ].map(({ label, count, color, bg }) => (
          <Card key={label} padding="sm" className="flex items-center gap-3">
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]", bg)}>
              <Truck size={16} className={color} />
            </span>
            <div>
              <p className="text-lg font-bold text-[var(--foreground)] leading-none">{count}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            leftIcon={<Search size={14} />}
            placeholder="Search drivers or city…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                statusFilter === value
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted-bg)] text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {label} ({counts[value as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Truck />}
          title="No drivers found"
          description="Try adjusting your search or filters."
          action={{ label: "Clear search", onClick: () => { setQ(""); setStatusFilter("all"); } }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((driver) => (
            <Link key={driver.id} href={`/drivers/${driver.id}`}>
              <Card hover className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={driver.name} size="lg" />
                    <div>
                      <p className="font-semibold text-[var(--foreground)] leading-snug">{driver.name}</p>
                      <p className="text-xs text-[var(--muted)]">{driver.city}</p>
                    </div>
                  </div>
                  <Badge variant={DRIVER_STATUS_COLORS[driver.status] as BV} dot>
                    {DRIVER_STATUS_LABELS[driver.status]}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-base font-bold text-[var(--foreground)]">{driver.completedDeliveries}</p>
                    <p className="text-[10px] text-[var(--muted)]">Completed</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-0.5">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <p className="text-base font-bold text-[var(--foreground)]">{driver.rating.toFixed(1)}</p>
                    </div>
                    <p className="text-[10px] text-[var(--muted)]">Rating</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[var(--foreground)] capitalize">{driver.vehicleType}</p>
                    <p className="text-[10px] text-[var(--muted)]">Vehicle</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--muted)]">{driver.vehicleNumber}</span>
                  <span className="text-xs text-[var(--muted)]">{driver.phone}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
