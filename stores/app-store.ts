"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockNotifications } from "@/mocks";
import type { Notification } from "@/types";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Notifications (live state shared across the whole app)
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markNotificationUnread: (id: string) => void;
  toggleNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setUnreadCount: (count: number) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  // Auth (demo)
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      theme: "light",
      setTheme: (theme) => set({ theme }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // Notifications — initialised from mock data
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,

      addNotification: (n) =>
        set((s) => ({
          notifications: [n, ...s.notifications],
          unreadCount: s.unreadCount + 1,
        })),

      markNotificationRead: (id) =>
        set((s) => {
          const already = s.notifications.find((n) => n.id === id)?.read;
          return {
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: already ? s.unreadCount : Math.max(0, s.unreadCount - 1),
          };
        }),

      markNotificationUnread: (id) =>
        set((s) => {
          const alreadyUnread = !s.notifications.find((n) => n.id === id)?.read;
          return {
            notifications: s.notifications.map((n) =>
              n.id === id ? { ...n, read: false } : n
            ),
            unreadCount: alreadyUnread ? s.unreadCount : s.unreadCount + 1,
          };
        }),

      toggleNotificationRead: (id) =>
        set((s) => {
          const n = s.notifications.find((x) => x.id === id);
          if (!n) return s;
          const wasRead = n.read;
          return {
            notifications: s.notifications.map((x) =>
              x.id === id ? { ...x, read: !x.read } : x
            ),
            unreadCount: wasRead
              ? s.unreadCount + 1          // toggling to unread
              : Math.max(0, s.unreadCount - 1), // toggling to read
          };
        }),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      setUnreadCount: (count) => set({ unreadCount: count }),

      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 4000);
      },
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      isAuthenticated: false,
      user: null,
      login: (email) =>
        set({
          isAuthenticated: true,
          user: { name: "Tunde Okafor", email, role: "Operations Manager" },
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "dispatchos-store",
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        // Don't persist notifications — regenerate from mock on each session
      }),
    }
  )
);
