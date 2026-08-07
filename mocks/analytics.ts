import type { RevenueDataPoint, DriverPerformance } from "@/types";

// Last 30 days of revenue data
export const mockRevenueData: RevenueDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date("2026-08-07");
  d.setDate(d.getDate() - (29 - i));
  const dayOfWeek = d.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const base = isWeekend ? 580000 : 920000;
  const noise = Math.sin(i * 2.3 + 1.1) * 120000;
  return {
    date: d.toISOString().split("T")[0],
    revenue: Math.round((base + noise) / 1000) * 1000,
    orders: Math.round((isWeekend ? 18 : 28) + Math.sin(i * 1.7) * 5),
  };
});

export const mockDriverPerformance: DriverPerformance[] = [
  { driverId: "d-001", driverName: "Chukwuemeka Okonkwo", completedDeliveries: 819, onTimeRate: 94.2, avgDeliveryTime: 42, rating: 4.8 },
  { driverId: "d-002", driverName: "Adaeze Nwosu", completedDeliveries: 1005, onTimeRate: 97.1, avgDeliveryTime: 38, rating: 4.9 },
  { driverId: "d-003", driverName: "Babatunde Fashola", completedDeliveries: 608, onTimeRate: 91.4, avgDeliveryTime: 45, rating: 4.6 },
  { driverId: "d-006", driverName: "Funmi Akintoye", completedDeliveries: 698, onTimeRate: 95.8, avgDeliveryTime: 40, rating: 4.8 },
  { driverId: "d-008", driverName: "Chiamaka Obi", completedDeliveries: 548, onTimeRate: 93.1, avgDeliveryTime: 44, rating: 4.7 },
  { driverId: "d-010", driverName: "Amina Bello", completedDeliveries: 878, onTimeRate: 96.4, avgDeliveryTime: 39, rating: 4.9 },
  { driverId: "d-021", driverName: "Ebele Ohayon", completedDeliveries: 880, onTimeRate: 98.0, avgDeliveryTime: 36, rating: 4.9 },
  { driverId: "d-030", driverName: "Olamide Afolabi", completedDeliveries: 608, onTimeRate: 95.2, avgDeliveryTime: 41, rating: 4.8 },
];

export const mockStatusBreakdown = [
  { status: "Delivered", count: 61, percentage: 47 },
  { status: "In Transit", count: 26, percentage: 20 },
  { status: "Pending", count: 18, percentage: 14 },
  { status: "Assigned", count: 13, percentage: 10 },
  { status: "Cancelled", count: 8, percentage: 6 },
  { status: "Failed", count: 4, percentage: 3 },
];

export const mockKpi = {
  totalRevenue: 28482500,
  totalOrders: 130,
  activeDeliveries: 26,
  completedToday: 18,
  revenueChange: 12.4,
  ordersChange: 8.2,
  activeChange: 5.1,
  completedChange: 14.7,
};
