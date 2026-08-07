import { notFound } from "next/navigation";
import Link from "next/link";
import { mockOrders, mockDrivers, mockCustomers } from "@/mocks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatNaira, formatDateTime } from "@/lib/utils/format";
import {
  ORDER_STATUS_LABELS, ORDER_STATUS_COLORS,
  ORDER_PRIORITY_LABELS, ORDER_PRIORITY_COLORS,
} from "@/lib/constants";
import type { OrderStatus } from "@/types";
import {
  ArrowLeft, MapPin, User, Truck, Clock,
  CheckCircle, Circle, Package,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type BV = "success" | "warning" | "danger" | "info" | "primary" | "muted";

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending",    label: "Order Created" },
  { status: "assigned",   label: "Driver Assigned" },
  { status: "picked_up",  label: "Package Picked Up" },
  { status: "in_transit", label: "In Transit" },
  { status: "delivered",  label: "Delivered" },
];

function getStepIndex(status: OrderStatus): number {
  const idx = TIMELINE_STEPS.findIndex((s) => s.status === status);
  if (status === "cancelled" || status === "failed") return -1;
  return idx;
}

export default async function OrderDetailPage({ params }: PageProps<"/orders/[orderId]">) {
  const { orderId } = await params;
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) notFound();

  const driver = order.driverId ? mockDrivers.find((d) => d.id === order.driverId) : null;
  const customer = mockCustomers.find((c) => c.id === order.customerId);
  const stepIdx = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "failed";

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back */}
      <Link href="/orders">
        <Button variant="ghost" size="sm" className="gap-2 -ml-1">
          <ArrowLeft size={14} /> Back to Orders
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold font-mono text-[var(--foreground)]">{order.id}</h1>
            <Badge variant={ORDER_STATUS_COLORS[order.status] as BV} dot>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
            <Badge variant={ORDER_PRIORITY_COLORS[order.priority] as BV}>
              {ORDER_PRIORITY_LABELS[order.priority]} Priority
            </Badge>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1">
            Created {formatDateTime(order.createdAt)}
          </p>
        </div>
        <p className="text-2xl font-bold text-[var(--foreground)]">{formatNaira(order.amount)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
            <User size={14} /> Customer
          </h2>
          {customer ? (
            <div className="flex items-start gap-3">
              <Avatar name={customer.name} size="md" />
              <div>
                <p className="font-semibold text-[var(--foreground)]">{customer.name}</p>
                <p className="text-sm text-[var(--muted)]">{customer.phone}</p>
                <p className="text-sm text-[var(--muted)]">{customer.email}</p>
                <p className="text-sm text-[var(--muted)] mt-1">{customer.address}, {customer.city}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">{order.customerName}</p>
          )}
        </Card>

        {/* Driver */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
            <Truck size={14} /> Driver
          </h2>
          {driver ? (
            <div className="flex items-start gap-3">
              <Avatar name={driver.name} size="md" />
              <div>
                <p className="font-semibold text-[var(--foreground)]">{driver.name}</p>
                <p className="text-sm text-[var(--muted)]">{driver.phone}</p>
                <p className="text-sm text-[var(--muted)] capitalize">
                  {driver.vehicleType} · {driver.vehicleNumber}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-sm text-[var(--foreground)]">{driver.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <span className="h-9 w-9 rounded-full bg-[var(--muted-bg)] flex items-center justify-center">
                <Truck size={16} className="text-[var(--muted)]" />
              </span>
              No driver assigned yet
            </div>
          )}
        </Card>

        {/* Route */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
            <MapPin size={14} /> Route
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)] flex-shrink-0" />
                <span className="w-0.5 h-8 bg-[var(--border)]" />
                <MapPin size={12} className="text-[var(--danger)] flex-shrink-0" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--muted)] font-medium">Pickup</p>
                  <p className="text-sm text-[var(--foreground)]">{order.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] font-medium">Delivery</p>
                  <p className="text-sm text-[var(--foreground)]">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Timing */}
        <Card>
          <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
            <Clock size={14} /> Timing
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Created</span>
              <span className="text-[var(--foreground)]">{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Updated</span>
              <span className="text-[var(--foreground)]">{formatDateTime(order.updatedAt)}</span>
            </div>
            {order.estimatedDeliveryTime && (
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Estimated delivery</span>
                <span className="text-[var(--foreground)]">{formatDateTime(order.estimatedDeliveryTime)}</span>
              </div>
            )}
            {order.actualDeliveryTime && (
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Actual delivery</span>
                <span className="text-[var(--success-text)] font-medium">{formatDateTime(order.actualDeliveryTime)}</span>
              </div>
            )}
            {order.notes && (
              <div className="pt-2 border-t border-[var(--border)]">
                <span className="text-[var(--muted)] text-xs">Notes: </span>
                <span className="text-[var(--foreground)]">{order.notes}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-5 flex items-center gap-2">
          <Package size={14} /> Delivery Timeline
        </h2>
        {isCancelled ? (
          <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--danger-bg)]">
            <span className="h-3 w-3 rounded-full bg-[var(--danger)]" />
            <span className="text-sm font-medium text-[var(--danger-text)]">
              Order was {order.status === "cancelled" ? "cancelled" : "failed"}
            </span>
          </div>
        ) : (
          <ol aria-label="Order timeline" className="flex flex-col gap-0">
            {TIMELINE_STEPS.map((step, i) => {
              const done = i <= stepIdx;
              const active = i === stepIdx;
              return (
                <li key={step.status} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border-2 flex-shrink-0",
                        done
                          ? "border-[var(--primary)] bg-[var(--primary)]"
                          : "border-[var(--border)] bg-[var(--surface)]"
                      )}
                      aria-hidden="true"
                    >
                      {done
                        ? <CheckCircle size={14} className="text-white" />
                        : <Circle size={10} className="text-[var(--border)]" />
                      }
                    </span>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <span
                        className={cn(
                          "w-0.5 h-8",
                          done && i < stepIdx ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                        )}
                      />
                    )}
                  </div>
                  <div className="pb-2 pt-0.5">
                    <p className={cn(
                      "text-sm font-medium",
                      active ? "text-[var(--primary)]" : done ? "text-[var(--foreground)]" : "text-[var(--muted)]"
                    )}>
                      {step.label}
                    </p>
                    {active && (
                      <p className="text-xs text-[var(--muted)] mt-0.5">Current status</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </div>
  );
}
