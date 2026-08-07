import { notFound } from "next/navigation";
import Link from "next/link";
import { mockDrivers, mockOrders } from "@/mocks";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, formatNaira } from "@/lib/utils/format";
import { DRIVER_STATUS_LABELS, DRIVER_STATUS_COLORS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { ArrowLeft, Phone, Mail, MapPin, Truck, Star, Package, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type BV = "success" | "warning" | "danger" | "info" | "primary" | "muted";

export default async function DriverDetailPage({ params }: PageProps<"/drivers/[driverId]">) {
  const { driverId } = await params;
  const driver = mockDrivers.find((d) => d.id === driverId);
  if (!driver) notFound();

  const driverOrders = mockOrders
    .filter((o) => o.driverId === driverId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const completionRate = driver.totalDeliveries > 0
    ? ((driver.completedDeliveries / driver.totalDeliveries) * 100).toFixed(1)
    : "0.0";

  const statusColor = DRIVER_STATUS_COLORS[driver.status] as BV;

  return (
    <div className="space-y-5 max-w-4xl">
      <Link href="/drivers">
        <Button variant="ghost" size="sm" className="gap-2 -ml-1">
          <ArrowLeft size={14} /> Back to Drivers
        </Button>
      </Link>

      {/* Profile header */}
      <Card>
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={driver.name} size="lg" className="h-16 w-16 text-xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-[var(--foreground)]">{driver.name}</h1>
              <Badge variant={statusColor} dot>{DRIVER_STATUS_LABELS[driver.status]}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1.5"><Phone size={13} />{driver.phone}</span>
              <span className="flex items-center gap-1.5"><Mail size={13} />{driver.email}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} />{driver.city}</span>
              <span className="flex items-center gap-1.5 capitalize"><Truck size={13} />{driver.vehicleType} · {driver.vehicleNumber}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Deliveries", value: driver.totalDeliveries, icon: <Package size={16} className="text-[var(--primary)]" />, bg: "bg-[var(--primary-muted)]" },
          { label: "Completed", value: driver.completedDeliveries, icon: <CheckCircle size={16} className="text-[var(--success)]" />, bg: "bg-[var(--success-bg)]" },
          { label: "Cancelled", value: driver.cancelledDeliveries, icon: <XCircle size={16} className="text-[var(--danger)]" />, bg: "bg-[var(--danger-bg)]" },
          { label: "Rating", value: `${driver.rating.toFixed(1)} ★`, icon: <Star size={16} className="text-amber-400" />, bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(({ label, value, icon, bg }) => (
          <Card key={label} padding="sm">
            <div className="flex items-center gap-3">
              <span className={cn("h-9 w-9 flex items-center justify-center rounded-[var(--radius-md)] flex-shrink-0", bg)}>
                {icon}
              </span>
              <div>
                <p className="text-lg font-bold text-[var(--foreground)] leading-none">{value}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Completion rate */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Completion Rate</h2>
          <span className="text-sm font-bold text-[var(--success-text)]">{completionRate}%</span>
        </div>
        <div className="h-2 bg-[var(--muted-bg)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--success)] rounded-full transition-all duration-700"
            style={{ width: `${completionRate}%` }}
            role="progressbar"
            aria-valuenow={parseFloat(completionRate)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-xs text-[var(--muted)] mt-1.5">
          {driver.completedDeliveries} completed of {driver.totalDeliveries} total
        </p>
      </Card>

      {/* Recent orders */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Recent Deliveries</h2>
        {driverOrders.length === 0 ? (
          <p className="text-sm text-[var(--muted)] py-4 text-center">No deliveries found for this driver.</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  {["Order", "Customer", "Route", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-[var(--muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {driverOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--muted-bg)] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">
                      <Link href={`/orders/${order.id}`} className="text-[var(--primary)] hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-[var(--foreground)] max-w-[130px] truncate">{order.customerName}</td>
                    <td className="px-5 py-3 text-[var(--muted)] text-xs whitespace-nowrap">{order.pickupCity} → {order.deliveryCity}</td>
                    <td className="px-5 py-3 font-medium">{formatNaira(order.amount)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={ORDER_STATUS_COLORS[order.status] as BV} dot>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-[var(--muted)] text-xs">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
