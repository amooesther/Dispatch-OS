import type { Activity } from "@/types";

export const mockActivity: Activity[] = [
  { id: "a-001", message: "Chukwuemeka Okonkwo picked up order ND-10082", type: "driver", createdAt: "2026-08-07T11:48:00Z", orderId: "ND-10082", driverId: "d-001" },
  { id: "a-002", message: "Order ND-10041 delivered to Kemi Fashions", type: "delivery", createdAt: "2026-08-07T11:30:00Z", orderId: "ND-10041" },
  { id: "a-003", message: "Adaeze Nwosu is now available", type: "driver", createdAt: "2026-08-07T11:28:00Z", driverId: "d-002" },
  { id: "a-004", message: "New order ND-10091 assigned to Babatunde Fashola", type: "order", createdAt: "2026-08-07T11:10:00Z", orderId: "ND-10091", driverId: "d-003" },
  { id: "a-005", message: "Order ND-10015 status updated to in transit", type: "delivery", createdAt: "2026-08-07T11:05:00Z", orderId: "ND-10015" },
  { id: "a-006", message: "New order ND-10097 received from PharmaBridge Ltd", type: "order", createdAt: "2026-08-07T10:30:00Z", orderId: "ND-10097" },
  { id: "a-007", message: "Ngozi Adeyemi went offline", type: "driver", createdAt: "2026-08-07T10:15:00Z", driverId: "d-004" },
  { id: "a-008", message: "Order ND-10063 delivered to Bright Computers", type: "delivery", createdAt: "2026-08-07T09:48:00Z", orderId: "ND-10063" },
  { id: "a-009", message: "Chiamaka Obi picked up order ND-10055", type: "driver", createdAt: "2026-08-07T09:35:00Z", orderId: "ND-10055", driverId: "d-008" },
  { id: "a-010", message: "New order ND-10103 received from Onyeka Import Export", type: "order", createdAt: "2026-08-07T09:20:00Z", orderId: "ND-10103" },
  { id: "a-011", message: "Funmi Akintoye is now available", type: "driver", createdAt: "2026-08-07T09:10:00Z", driverId: "d-006" },
  { id: "a-012", message: "Order ND-10028 delayed — heavy traffic", type: "delivery", createdAt: "2026-08-07T09:05:00Z", orderId: "ND-10028" },
  { id: "a-013", message: "System maintenance completed successfully", type: "system", createdAt: "2026-08-07T08:00:00Z" },
  { id: "a-014", message: "Order ND-10055 delivered to Richmond Hotels", type: "delivery", createdAt: "2026-08-06T16:42:00Z", orderId: "ND-10055" },
  { id: "a-015", message: "Olamide Afolabi assigned to order ND-10118", type: "driver", createdAt: "2026-08-06T15:35:00Z", orderId: "ND-10118", driverId: "d-030" },
  { id: "a-016", message: "New order ND-10118 received from Tolu Electronics", type: "order", createdAt: "2026-08-06T15:30:00Z", orderId: "ND-10118" },
  { id: "a-017", message: "Order ND-10007 delayed — vehicle issue reported", type: "delivery", createdAt: "2026-08-06T14:10:00Z", orderId: "ND-10007" },
  { id: "a-018", message: "Rotimi Adewale went offline unexpectedly", type: "driver", createdAt: "2026-08-06T12:00:00Z", driverId: "d-018" },
  { id: "a-019", message: "Order ND-10044 delivered to Aisha Beauty Supply", type: "delivery", createdAt: "2026-08-06T11:20:00Z", orderId: "ND-10044" },
  { id: "a-020", message: "Segun Balogun picked up order ND-10072", type: "driver", createdAt: "2026-08-06T10:45:00Z", orderId: "ND-10072", driverId: "d-009" },
];
