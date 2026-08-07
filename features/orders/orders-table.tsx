"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { mockOrders } from "@/mocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatNaira, formatDate } from "@/lib/utils/format";
import {
  ORDER_STATUS_LABELS, ORDER_STATUS_COLORS,
  ORDER_PRIORITY_LABELS, ORDER_PRIORITY_COLORS, PAGE_SIZE,
} from "@/lib/constants";
import type { OrderStatus, OrderPriority } from "@/types";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Package, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SortKey = "createdAt" | "amount" | "status" | "customerName";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
];
const PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  ...Object.entries(ORDER_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

type BV = "success" | "warning" | "danger" | "info" | "primary" | "muted";

export function OrdersTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q       = searchParams.get("q") ?? "";
  const status  = searchParams.get("status") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const page    = Number(searchParams.get("page") ?? "1");
  const sortKey = (searchParams.get("sort") ?? "createdAt") as SortKey;
  const sortDir = (searchParams.get("dir") ?? "desc") as SortDir;

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setSort(key: SortKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (sortKey === key) {
      params.set("dir", sortDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", key);
      params.set("dir", "desc");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    router.push(pathname, { scroll: false });
  }

  const filtered = useMemo(() => {
    let rows = [...mockOrders];
    if (q) {
      const lq = q.toLowerCase();
      rows = rows.filter(
        (o) =>
          o.id.toLowerCase().includes(lq) ||
          o.customerName.toLowerCase().includes(lq) ||
          (o.driverName ?? "").toLowerCase().includes(lq) ||
          o.deliveryCity.toLowerCase().includes(lq)
      );
    }
    if (status) rows = rows.filter((o) => o.status === status);
    if (priority) rows = rows.filter((o) => o.priority === priority);
    rows.sort((a, b) => {
      let diff = 0;
      if (sortKey === "amount") diff = a.amount - b.amount;
      else if (sortKey === "status") diff = a.status.localeCompare(b.status);
      else if (sortKey === "customerName") diff = a.customerName.localeCompare(b.customerName);
      else diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? diff : -diff;
    });
    return rows;
  }, [q, status, priority, sortKey, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const hasFilters = !!(q || status || priority);

  const SortTh = ({ label, k }: { label: string; k: SortKey }) => (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => setSort(k)}
        className="flex items-center gap-1 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap"
      >
        {label}
        <ArrowUpDown
          size={11}
          className={cn(sortKey === k ? "text-[var(--primary)]" : "opacity-40")}
        />
      </button>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <Input
            leftIcon={<Search size={14} />}
            placeholder="Search orders, customers, drivers…"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
          className="w-40"
          aria-label="Filter by status"
        />
        <Select
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={(e) => setParam("priority", e.target.value)}
          className="w-40"
          aria-label="Filter by priority"
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X size={13} /> Clear filters
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-[var(--muted)]">
        {hasFilters
          ? `${total} order${total !== 1 ? "s" : ""} match your filters`
          : `${total} orders total`}
        {total > PAGE_SIZE && ` — showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)}`}
      </p>

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)]">
        {pageRows.length === 0 ? (
          <EmptyState
            icon={<Package />}
            title={hasFilters ? "No orders match your filters" : "No orders yet"}
            description={hasFilters ? "Try removing one or more filters." : undefined}
            action={hasFilters ? { label: "Clear filters", onClick: clearFilters } : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--muted-bg)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)]">Order</th>
                    <SortTh label="Customer" k="customerName" />
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)]">Driver</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)]">Route</th>
                    <SortTh label="Amount" k="amount" />
                    <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)]">Priority</th>
                    <SortTh label="Status" k="status" />
                    <SortTh label="Created" k="createdAt" />
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {pageRows.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--muted-bg)] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold">
                        <Link href={`/orders/${order.id}`} className="text-[var(--primary)] hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[var(--foreground)] max-w-[140px] truncate">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)] max-w-[130px] truncate">
                        {order.driverName ?? <span className="text-[var(--border-strong)]">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)] text-xs whitespace-nowrap">
                        {order.pickupCity} → {order.deliveryCity}
                      </td>
                      <td className="px-4 py-3 font-medium text-[var(--foreground)] whitespace-nowrap">
                        {formatNaira(order.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ORDER_PRIORITY_COLORS[order.priority] as BV}>
                          {ORDER_PRIORITY_LABELS[order.priority]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ORDER_STATUS_COLORS[order.status] as BV} dot>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)] text-xs whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--muted)]">
                  Showing {start + 1}–{Math.min(start + PAGE_SIZE, total)} of {total} orders
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage <= 1}
                    onClick={() => setParam("page", String(currentPage - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                    return (
                      <Button
                        key={p}
                        variant={p === currentPage ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setParam("page", String(p))}
                        className="w-8 px-0"
                        aria-label={`Page ${p}`}
                        aria-current={p === currentPage ? "page" : undefined}
                      >
                        {p}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage >= totalPages}
                    onClick={() => setParam("page", String(currentPage + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
