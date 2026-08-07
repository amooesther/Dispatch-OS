"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, Truck, CheckCircle } from "lucide-react";
import { KpiCard } from "@/features/dashboard/kpi-card";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { StatusChart } from "@/features/dashboard/status-chart";
import { ActivityFeed } from "@/features/dashboard/activity-feed";
import { RecentOrders } from "@/features/dashboard/recent-orders";
import { mockKpi } from "@/mocks";
import { formatNaira, formatNumber } from "@/lib/utils/format";
import { useAppStore } from "@/stores/app-store";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const [activeDeliveries, setActiveDeliveries] = useState(mockKpi.activeDeliveries);

  // Simulate real-time KPI change
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDeliveries((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return Math.max(0, prev + delta);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">
          Good morning, {user?.name?.split(" ")[0] ?? "Manager"} 👋
        </h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          Here's what's happening with your deliveries today.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={formatNaira(mockKpi.totalRevenue)}
          change={mockKpi.revenueChange}
          icon={<DollarSign size={18} className="text-[var(--primary)]" />}
          iconColor="bg-[var(--primary-muted)]"
        />
        <KpiCard
          title="Total Orders"
          value={formatNumber(mockKpi.totalOrders)}
          change={mockKpi.ordersChange}
          icon={<Package size={18} className="text-[var(--info)]" />}
          iconColor="bg-[var(--info-bg)]"
        />
        <KpiCard
          title="Active Deliveries"
          value={formatNumber(activeDeliveries)}
          change={mockKpi.activeChange}
          icon={<Truck size={18} className="text-[var(--warning)]" />}
          iconColor="bg-[var(--warning-bg)]"
        />
        <KpiCard
          title="Completed Today"
          value={formatNumber(mockKpi.completedToday)}
          change={mockKpi.completedChange}
          icon={<CheckCircle size={18} className="text-[var(--success)]" />}
          iconColor="bg-[var(--success-bg)]"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChart />
        <StatusChart />
      </div>

      {/* Recent orders + Activity feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
