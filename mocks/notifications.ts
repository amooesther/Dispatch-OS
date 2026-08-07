import type { Notification } from "@/types";

export const mockNotifications: Notification[] = [
  { id: "n-001", type: "new_order", title: "New Order Received", message: "Order ND-10082 from Adebayo Stores — ₦48,500", read: false, createdAt: "2026-08-07T11:45:00Z", orderId: "ND-10082" },
  { id: "n-002", type: "delivery_completed", title: "Delivery Completed", message: "Order ND-10041 delivered to Kemi Fashions by Adaeze Nwosu", read: false, createdAt: "2026-08-07T11:30:00Z", orderId: "ND-10041", driverId: "d-002" },
  { id: "n-003", type: "delivery_delayed", title: "Delivery Delayed", message: "Order ND-10015 is running 25 minutes behind schedule", read: false, createdAt: "2026-08-07T11:10:00Z", orderId: "ND-10015" },
  { id: "n-004", type: "driver_assigned", title: "Driver Assigned", message: "Chukwuemeka Okonkwo assigned to Order ND-10091", read: true, createdAt: "2026-08-07T10:55:00Z", orderId: "ND-10091", driverId: "d-001" },
  { id: "n-005", type: "new_order", title: "New Order Received", message: "Order ND-10097 from PharmaBridge Ltd — ₦72,000", read: true, createdAt: "2026-08-07T10:30:00Z", orderId: "ND-10097" },
  { id: "n-006", type: "driver_unavailable", title: "Driver Unavailable", message: "Ngozi Adeyemi has gone offline unexpectedly", read: true, createdAt: "2026-08-07T10:15:00Z", driverId: "d-004" },
  { id: "n-007", type: "delivery_completed", title: "Delivery Completed", message: "Order ND-10063 delivered to Bright Computers", read: true, createdAt: "2026-08-07T09:48:00Z", orderId: "ND-10063" },
  { id: "n-008", type: "new_order", title: "New Order Received", message: "Order ND-10103 from Onyeka Import Export — ₦124,500", read: true, createdAt: "2026-08-07T09:20:00Z", orderId: "ND-10103" },
  { id: "n-009", type: "delivery_delayed", title: "Delivery Delayed", message: "Order ND-10028 delayed — traffic on Apapa-Oshodi Expressway", read: true, createdAt: "2026-08-07T09:05:00Z", orderId: "ND-10028" },
  { id: "n-010", type: "system_update", title: "System Update", message: "Scheduled maintenance completed. All systems operational.", read: true, createdAt: "2026-08-07T08:00:00Z" },
  { id: "n-011", type: "delivery_completed", title: "Delivery Completed", message: "Order ND-10055 delivered to Richmond Hotels by Chiamaka Obi", read: true, createdAt: "2026-08-06T16:42:00Z", orderId: "ND-10055", driverId: "d-008" },
  { id: "n-012", type: "new_order", title: "New Order Received", message: "Order ND-10118 from Tolu Electronics — ₦89,000", read: true, createdAt: "2026-08-06T15:30:00Z", orderId: "ND-10118" },
  { id: "n-013", type: "driver_assigned", title: "Driver Assigned", message: "Olamide Afolabi assigned to Order ND-10118", read: true, createdAt: "2026-08-06T15:35:00Z", orderId: "ND-10118", driverId: "d-030" },
  { id: "n-014", type: "delivery_delayed", title: "Delivery Delayed", message: "Order ND-10007 delayed — driver reported vehicle issue", read: true, createdAt: "2026-08-06T14:10:00Z", orderId: "ND-10007" },
  { id: "n-015", type: "driver_unavailable", title: "Driver Unavailable", message: "Rotimi Adewale has gone offline. Reassign pending orders.", read: true, createdAt: "2026-08-06T12:00:00Z", driverId: "d-018" },
];
