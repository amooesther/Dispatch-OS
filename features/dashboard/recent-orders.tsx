"use client";

import Link from "next/link";
import { mockOrders } from "@/mocks";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira, formatRelativeTime } from "@/lib/utils/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const recentOrders = [...mockOrders]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 7);

export function RecentOrders() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="gap-1 text-[var(--primary)]">
            View all <ArrowRight size={13} />
          </Button>
        </Link>
      </CardHeader>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Order", "Customer", "Driver", "Amount", "Status", "Created"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-2.5 text-left text-xs font-medium text-[var(--muted)] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--muted-bg)] transition-colors">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-[var(--primary)]">
                  <Link href={`/orders/${order.id}`}>{order.id}</Link>
                </td>
                <td className="px-5 py-3 text-[var(--foreground)] whitespace-nowrap max-w-[140px] truncate">
                  {order.customerName}
                </td>
                <td className="px-5 py-3 text-[var(--muted)] whitespace-nowrap">
                  {order.driverName ?? "—"}
                </td>
                <td className="px-5 py-3 font-medium text-[var(--foreground)] whitespace-nowrap">
                  {formatNaira(order.amount)}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={ORDER_STATUS_COLORS[order.status] as BadgeVariant} dot>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-[var(--muted)] whitespace-nowrap text-xs">
                  {formatRelativeTime(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
