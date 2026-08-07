import type { OrderStatus, OrderPriority, DriverStatus } from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "warning",
  assigned: "info",
  picked_up: "info",
  in_transit: "primary",
  delivered: "success",
  cancelled: "danger",
  failed: "danger",
};

export const ORDER_PRIORITY_LABELS: Record<OrderPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const ORDER_PRIORITY_COLORS: Record<OrderPriority, string> = {
  low: "muted",
  normal: "info",
  high: "warning",
  urgent: "danger",
};

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  available: "Available",
  busy: "Busy",
  offline: "Offline",
  on_break: "On Break",
};

export const DRIVER_STATUS_COLORS: Record<DriverStatus, string> = {
  available: "success",
  busy: "primary",
  offline: "muted",
  on_break: "warning",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Orders", href: "/orders", icon: "Package" },
  { label: "Drivers", href: "/drivers", icon: "Truck" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Live Map", href: "/live-map", icon: "Map" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
] as const;

export const DEMO_EMAIL = "demo@dispatchos.app";
export const DEMO_PASSWORD = "DemoPassword123!";

export const PAGE_SIZE = 20;
