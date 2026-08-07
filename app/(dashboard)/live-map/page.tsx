"use client";

import { useEffect, useRef, useState } from "react";
import { mockDrivers, mockOrders } from "@/mocks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DRIVER_STATUS_LABELS, DRIVER_STATUS_COLORS } from "@/lib/constants";
import type { Driver, DriverStatus } from "@/types";
import { cn } from "@/lib/utils/cn";
import { Truck, X, Navigation, MapPin } from "lucide-react";

type BV = "success" | "warning" | "danger" | "info" | "primary" | "muted";

const STATUS_FILTERS: { label: string; value: DriverStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Busy", value: "busy" },
  { label: "On Break", value: "on_break" },
  { label: "Offline", value: "offline" },
];

const STATUS_MARKER_COLORS: Record<DriverStatus, string> = {
  available: "#16a34a",
  busy: "#2563eb",
  offline: "#6b7280",
  on_break: "#d97706",
};

// Nigeria bounding box for map simulation
const NIGERIA_BOUNDS = {
  minLat: 4.2,
  maxLat: 13.9,
  minLng: 2.7,
  maxLng: 14.7,
};

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - NIGERIA_BOUNDS.minLng) / (NIGERIA_BOUNDS.maxLng - NIGERIA_BOUNDS.minLng)) * 100;
  const y = ((NIGERIA_BOUNDS.maxLat - lat) / (NIGERIA_BOUNDS.maxLat - NIGERIA_BOUNDS.minLat)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

interface DriverPosition {
  driver: Driver;
  lat: number;
  lng: number;
}

export default function LiveMapPage() {
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "all">("all");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [positions, setPositions] = useState<DriverPosition[]>(
    mockDrivers.map((d) => ({ driver: d, lat: d.currentLocation.lat, lng: d.currentLocation.lng }))
  );

  // Simulate driver movement every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((p) => {
          if (p.driver.status === "offline") return p;
          return {
            ...p,
            lat: p.lat + (Math.random() - 0.5) * 0.015,
            lng: p.lng + (Math.random() - 0.5) * 0.015,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered = positions.filter(
    (p) => statusFilter === "all" || p.driver.status === statusFilter
  );

  const selectedOrder = selectedDriver
    ? mockOrders.find((o) => o.driverId === selectedDriver.id && (o.status === "in_transit" || o.status === "picked_up"))
    : null;

  const counts = {
    available: mockDrivers.filter((d) => d.status === "available").length,
    busy: mockDrivers.filter((d) => d.status === "busy").length,
    on_break: mockDrivers.filter((d) => d.status === "on_break").length,
    offline: mockDrivers.filter((d) => d.status === "offline").length,
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Live Map</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          Real-time driver and delivery locations across Nigeria.
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Available", count: counts.available, color: "text-[var(--success-text)]" },
          { label: "Busy", count: counts.busy, color: "text-[var(--primary)]" },
          { label: "On Break", count: counts.on_break, color: "text-[var(--warning-text)]" },
          { label: "Offline", count: counts.offline, color: "text-[var(--muted)]" },
        ].map(({ label, count, color }) => (
          <div key={label} className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs font-medium">
            <span className={cn("font-bold text-sm", color)}>{count}</span>
            <span className="text-[var(--muted)]">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-[var(--success-text)] bg-[var(--success-bg)] rounded-full px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
          Positions updating
        </div>
      </div>

      {/* Status filter */}
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
            {label}
          </button>
        ))}
      </div>

      {/* Map + sidebar */}
      <div className="flex gap-4">
        {/* Map */}
        <div
          className="relative flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] overflow-hidden"
          style={{ minHeight: 500 }}
          role="img"
          aria-label="Live driver map showing Nigeria"
        >
          {/* Map background grid */}
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(var(--border) 1px, transparent 1px),
                linear-gradient(90deg, var(--border) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Nigeria outline label */}
          <div className="absolute top-3 left-3 bg-[var(--surface)]/90 backdrop-blur-sm border border-[var(--border)] rounded-[var(--radius-md)] px-3 py-1.5">
            <p className="text-xs font-semibold text-[var(--foreground)]">Nigeria</p>
            <p className="text-[10px] text-[var(--muted)]">Simulated GPS positions</p>
          </div>

          {/* Driver markers */}
          {filtered.map(({ driver, lat, lng }) => {
            const { x, y } = latLngToPercent(lat, lng);
            const color = STATUS_MARKER_COLORS[driver.status];
            const isSelected = selectedDriver?.id === driver.id;
            return (
              <button
                key={driver.id}
                onClick={() => setSelectedDriver(isSelected ? null : driver)}
                aria-label={`${driver.name} — ${DRIVER_STATUS_LABELS[driver.status]}`}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                )}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform",
                    isSelected && "scale-125 ring-2 ring-[var(--primary)] ring-offset-1"
                  )}
                  style={{ backgroundColor: color }}
                >
                  <Truck size={13} className="text-white" />
                </div>
                {isSelected && (
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] px-2 py-1 shadow-md whitespace-nowrap z-10">
                    <p className="text-[10px] font-semibold text-[var(--foreground)]">{driver.name.split(" ")[0]}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info panel */}
        {selectedDriver && (
          <div className="w-72 flex-shrink-0 animate-fade-in">
            <Card className="sticky top-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">Driver Details</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1" onClick={() => setSelectedDriver(null)} aria-label="Close panel">
                  <X size={13} />
                </Button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={selectedDriver.name} size="md" />
                <div>
                  <p className="font-semibold text-[var(--foreground)] text-sm leading-snug">{selectedDriver.name}</p>
                  <Badge variant={DRIVER_STATUS_COLORS[selectedDriver.status] as BV} dot className="mt-1">
                    {DRIVER_STATUS_LABELS[selectedDriver.status]}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-xs text-[var(--muted)]">
                <div className="flex justify-between">
                  <span>Vehicle</span>
                  <span className="text-[var(--foreground)] capitalize">{selectedDriver.vehicleType} · {selectedDriver.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating</span>
                  <span className="text-[var(--foreground)]">★ {selectedDriver.rating.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>City</span>
                  <span className="text-[var(--foreground)]">{selectedDriver.city}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span className="text-[var(--foreground)]">{selectedDriver.completedDeliveries}</span>
                </div>
              </div>

              {selectedOrder && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs font-semibold text-[var(--foreground)] mb-2">Current Order</p>
                  <div className="space-y-1.5 text-xs text-[var(--muted)]">
                    <p className="font-mono font-semibold text-[var(--primary)]">{selectedOrder.id}</p>
                    <p>{selectedOrder.customerName}</p>
                    <p className="flex items-center gap-1"><Navigation size={10} /> {selectedOrder.pickupCity} → {selectedOrder.deliveryCity}</p>
                  </div>
                </div>
              )}

              <a href={`/drivers/${selectedDriver.id}`} className="inline-flex items-center justify-center w-full h-9 px-4 text-sm font-medium rounded-[var(--radius-md)] border border-[var(--border)] hover:bg-[var(--muted-bg)] transition-colors mt-4">
                View Profile
              </a>
            </Card>
          </div>
        )}
      </div>

      {/* Driver list */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">All Drivers ({filtered.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map(({ driver }) => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-[var(--radius-md)] text-left transition-colors",
                selectedDriver?.id === driver.id
                  ? "bg-[var(--primary-muted)] border border-[var(--primary)]/30"
                  : "hover:bg-[var(--muted-bg)]"
              )}
            >
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_MARKER_COLORS[driver.status] }}
              />
              <span className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">{driver.name}</p>
                <p className="text-xs text-[var(--muted)]">{driver.city}</p>
              </span>
              <Badge variant={DRIVER_STATUS_COLORS[driver.status] as BV} className="text-[10px]">
                {DRIVER_STATUS_LABELS[driver.status]}
              </Badge>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
