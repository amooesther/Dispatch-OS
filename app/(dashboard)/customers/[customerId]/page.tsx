import { notFound } from "next/navigation";
import Link from "next/link";
import { mockCustomers, mockOrders } from "@/mocks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatNaira, formatDate } from "@/lib/utils/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { ArrowLeft, Phone, Mail, MapPin, Package, ShoppingBag } from "lucide-react";

type BV = "success" | "warning" | "danger" | "info" | "primary" | "muted";

export default async function CustomerDetailPage({ params }: PageProps<"/customers/[customerId]">) {
  const { customerId } = await params;
  const customer = mockCustomers.find((c) => c.id === customerId);
  if (!customer) notFound();

  const orders = mockOrders
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-5 max-w-4xl">
      <Link href="/customers">
        <Button variant="ghost" size="sm" className="gap-2 -ml-1">
          <ArrowLeft size={14} /> Back to Customers
        </Button>
      </Link>

      <Card>
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={customer.name} size="lg" className="h-16 w-16 text-xl" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[var(--foreground)]">{customer.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-1.5"><Phone size={13} />{customer.phone}</span>
              <span className="flex items-center gap-1.5"><Mail size={13} />{customer.email}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} />{customer.address}, {customer.city}, {customer.state}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card padding="sm" className="flex items-center gap-3">
          <span className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-muted)]">
            <Package size={16} className="text-[var(--primary)]" />
          </span>
          <div>
            <p className="text-lg font-bold text-[var(--foreground)] leading-none">{customer.totalOrders}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">Total Orders</p>
          </div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <span className="h-9 w-9 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--success-bg)]">
            <ShoppingBag size={16} className="text-[var(--success)]" />
          </span>
          <div>
            <p className="text-sm font-bold text-[var(--foreground)] leading-none">{formatNaira(customer.totalSpent)}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">Total Spent</p>
          </div>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-[var(--muted)]">Customer since</p>
          <p className="font-semibold text-[var(--foreground)] mt-0.5">{formatDate(customer.createdAt)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Order History ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--muted)] py-4 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  {["Order", "Driver", "Route", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-[var(--muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[var(--muted-bg)] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">
                      <Link href={`/orders/${o.id}`} className="text-[var(--primary)] hover:underline">{o.id}</Link>
                    </td>
                    <td className="px-5 py-3 text-[var(--muted)]">{o.driverName ?? "—"}</td>
                    <td className="px-5 py-3 text-[var(--muted)] text-xs">{o.pickupCity} → {o.deliveryCity}</td>
                    <td className="px-5 py-3 font-medium">{formatNaira(o.amount)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={ORDER_STATUS_COLORS[o.status] as BV} dot>
                        {ORDER_STATUS_LABELS[o.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-[var(--muted)] text-xs">{formatDate(o.createdAt)}</td>
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
