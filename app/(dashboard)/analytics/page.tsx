"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { mockRevenueData, mockDriverPerformance, mockStatusBreakdown } from "@/mocks";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type Range = "7d" | "14d" | "30d";
const RANGES: { label: string; value: Range }[] = [
  { label: "7 days", value: "7d" },
  { label: "14 days", value: "14d" },
  { label: "30 days", value: "30d" },
];

const PIE_COLORS = ["#16a34a","#2563eb","#d97706","#0891b2","#dc2626","#8b5cf6"];

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("14d");

  const days = range === "7d" ? 7 : range === "14d" ? 14 : 30;
  const chartData = mockRevenueData.slice(-days).map((d) => ({
    ...d,
    label: formatShortDate(d.date),
  }));

  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders  = chartData.reduce((s, d) => s + d.orders, 0);
  const avgRevenue   = totalRevenue / chartData.length;
  const avgOrders    = totalOrders / chartData.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Analytics</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Performance metrics and business insights.</p>
        </div>
        <div className="flex gap-1 bg-[var(--muted-bg)] p-0.5 rounded-[var(--radius-md)]">
          {RANGES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={cn(
                "px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all",
                range === value
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatNaira(totalRevenue) },
          { label: "Total Orders", value: formatNumber(totalOrders) },
          { label: "Avg Daily Revenue", value: formatNaira(Math.round(avgRevenue)) },
          { label: "Avg Daily Orders", value: avgOrders.toFixed(1) },
        ].map(({ label, value }) => (
          <Card key={label} padding="sm">
            <p className="text-xs text-[var(--muted)] mb-1">{label}</p>
            <p className="text-lg font-bold text-[var(--foreground)]">{value}</p>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={52} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }}
                formatter={(v) => [formatNaira(v as number), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Orders + Status side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Daily Orders</CardTitle></CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }}
                formatter={(v) => [v as number, "Orders"]}
                />
                <Bar dataKey="orders" fill="var(--primary)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Delivery Status Distribution</CardTitle></CardHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockStatusBreakdown} cx="50%" cy="50%" innerRadius={44} outerRadius={66} dataKey="count" nameKey="status" paddingAngle={2}>
                  {mockStatusBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }}
                  formatter={(v, name) => [`${v as number} orders (${mockStatusBreakdown.find(s=>s.status===name)?.percentage ?? 0}%)`, name as string]}
                />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "var(--muted)", fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Driver performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Driver Performance</CardTitle>
          <p className="text-xs text-[var(--muted)]">Ranked by completed deliveries</p>
        </CardHeader>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mockDriverPerformance.slice(0, 6).map((d) => ({
                name: d.driverName.split(" ")[0],
                completed: d.completedDeliveries,
                onTime: d.onTimeRate,
              }))}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 12 }}
              />
              <Legend formatter={(v) => <span style={{ color: "var(--muted)", fontSize: 11 }}>{v}</span>} />
              <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Driver performance table */}
      <Card>
        <CardHeader><CardTitle>Driver Performance Detail</CardTitle></CardHeader>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr>
                {["Driver", "Completed", "On-Time Rate", "Avg Time (min)", "Rating"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-[var(--muted)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {mockDriverPerformance.map((d) => (
                <tr key={d.driverId} className="hover:bg-[var(--muted-bg)] transition-colors">
                  <td className="px-5 py-3 font-medium text-[var(--foreground)]">{d.driverName}</td>
                  <td className="px-5 py-3 text-[var(--foreground)]">{formatNumber(d.completedDeliveries)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[var(--muted-bg)] rounded-full w-16 overflow-hidden">
                        <div className="h-full bg-[var(--success)] rounded-full" style={{ width: `${d.onTimeRate}%` }} />
                      </div>
                      <span className="text-[var(--success-text)] font-medium text-xs">{d.onTimeRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--foreground)]">{d.avgDeliveryTime} min</td>
                  <td className="px-5 py-3 text-[var(--foreground)]">★ {d.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
