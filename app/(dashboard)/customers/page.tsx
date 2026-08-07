"use client";

import { useState } from "react";
import Link from "next/link";
import { mockCustomers } from "@/mocks";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatNaira, formatDate } from "@/lib/utils/format";
import { Search, Users } from "lucide-react";

export default function CustomersPage() {
  const [q, setQ] = useState("");

  const filtered = mockCustomers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.city.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Customers</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          {mockCustomers.length} customers · {mockCustomers.reduce((s, c) => s + c.totalOrders, 0)} total orders
        </p>
      </div>

      <div className="max-w-sm">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Search by name, city or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No customers found"
          description="Try adjusting your search."
          action={{ label: "Clear search", onClick: () => setQ("") }}
        />
      ) : (
        <>
          <p className="text-xs text-[var(--muted)]">{filtered.length} customers</p>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--muted-bg)]">
                  <tr>
                    {["Customer", "Phone", "City", "Orders", "Total Spent", "Since"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-[var(--muted)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((customer) => (
                    <tr key={customer.id} className="hover:bg-[var(--muted-bg)] transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/customers/${customer.id}`} className="flex items-center gap-3 group">
                          <Avatar name={customer.name} size="sm" />
                          <div>
                            <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                              {customer.name}
                            </p>
                            <p className="text-xs text-[var(--muted)]">{customer.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-[var(--muted)] whitespace-nowrap">{customer.phone}</td>
                      <td className="px-5 py-3 text-[var(--muted)] whitespace-nowrap">{customer.city}, {customer.state}</td>
                      <td className="px-5 py-3 font-medium text-[var(--foreground)]">{customer.totalOrders}</td>
                      <td className="px-5 py-3 font-medium text-[var(--foreground)] whitespace-nowrap">{formatNaira(customer.totalSpent)}</td>
                      <td className="px-5 py-3 text-[var(--muted)] text-xs whitespace-nowrap">{formatDate(customer.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
