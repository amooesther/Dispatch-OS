// ─── User ────────────────────────────────────────────────────────────────────
export type UserRole = "admin" | "manager" | "dispatcher";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// ─── Driver ──────────────────────────────────────────────────────────────────
export type DriverStatus = "available" | "busy" | "offline" | "on_break";
export type VehicleType = "motorcycle" | "car" | "van" | "truck";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  status: DriverStatus;
  vehicleType: VehicleType;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  currentLocation: Coordinates;
  city: string;
  createdAt: string;
}

// ─── Customer ─────────────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "failed";

export type OrderPriority = "low" | "normal" | "high" | "urgent";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  driverId?: string;
  driverName?: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupCity: string;
  deliveryCity: string;
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
  amount: number;
  status: OrderStatus;
  priority: OrderPriority;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationType =
  | "new_order"
  | "delivery_delayed"
  | "delivery_completed"
  | "driver_unavailable"
  | "system_update"
  | "driver_assigned";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
  driverId?: string;
}

// ─── Activity ─────────────────────────────────────────────────────────────────
export interface Activity {
  id: string;
  message: string;
  type: "order" | "driver" | "delivery" | "system";
  createdAt: string;
  orderId?: string;
  driverId?: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface DriverPerformance {
  driverId: string;
  driverName: string;
  completedDeliveries: number;
  onTimeRate: number;
  avgDeliveryTime: number;
  rating: number;
}

// ─── KPI ──────────────────────────────────────────────────────────────────────
export interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  activeDeliveries: number;
  completedToday: number;
  revenueChange: number;
  ordersChange: number;
  activeChange: number;
  completedChange: number;
}
