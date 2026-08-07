"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import type { Notification, NotificationType } from "@/types";

interface LiveEvent {
  type: NotificationType;
  title: string;
  message: string;
  toastType: "success" | "info" | "warning" | "error";
}

const LIVE_EVENTS: LiveEvent[] = [
  {
    type: "delivery_completed",
    title: "Delivery Completed",
    message: "Order ND-10044 delivered to Aisha Beauty Supply by Kolade Martins",
    toastType: "success",
  },
  {
    type: "new_order",
    title: "New Order Received",
    message: "Order ND-10131 from Precious Pharmacy — ₦62,500",
    toastType: "info",
  },
  {
    type: "delivery_delayed",
    title: "Delivery Delayed",
    message: "Order ND-10093 is running 30 minutes behind schedule",
    toastType: "warning",
  },
  {
    type: "driver_assigned",
    title: "Driver Assigned",
    message: "Ebele Ohayon assigned to Order ND-10131",
    toastType: "info",
  },
  {
    type: "delivery_completed",
    title: "Delivery Completed",
    message: "Order ND-10077 delivered to Richmond Hotels by Chiamaka Obi",
    toastType: "success",
  },
  {
    type: "new_order",
    title: "New Order Received",
    message: "Order ND-10132 from Tolu Electronics — ₦118,000",
    toastType: "info",
  },
  {
    type: "driver_unavailable",
    title: "Driver Unavailable",
    message: "Rasheed Lawal has gone offline. 1 pending order needs reassignment.",
    toastType: "error",
  },
  {
    type: "delivery_completed",
    title: "Delivery Completed",
    message: "Order ND-10059 delivered to Nnamdi Supermart by Adaeze Nwosu",
    toastType: "success",
  },
  {
    type: "delivery_delayed",
    title: "Delivery Delayed",
    message: "Order ND-10108 delayed — road closure on Lagos-Ibadan Expressway",
    toastType: "warning",
  },
  {
    type: "new_order",
    title: "New Order Received",
    message: "Order ND-10133 from PharmaBridge Ltd — ₦84,000",
    toastType: "info",
  },
];

let eventIndex = 0;

/**
 * Mounts once inside the dashboard shell and fires simulated real-time
 * notifications every ~15 seconds. Each notification is:
 *   1. Prepended to the global notifications list (store)
 *   2. Shown as a toast popup
 *   3. Reflected in the unread badge automatically via the store
 */
export function useRealtimeNotifications() {
  const { addNotification, addToast } = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const event = LIVE_EVENTS[eventIndex % LIVE_EVENTS.length];
      eventIndex++;

      const notification: Notification = {
        id: `live-${Date.now()}`,
        type: event.type,
        title: event.title,
        message: event.message,
        read: false,
        createdAt: new Date().toISOString(),
      };

      addNotification(notification);

      addToast({
        type: event.toastType,
        title: event.title,
        message: event.message,
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [addNotification, addToast]);
}
