"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  // Unread notifications count
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnread: () => void;

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

      unreadCount: 3,
      setUnreadCount: (count) => set({ unreadCount: count }),
      decrementUnread: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),

      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 4000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

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
      }),
    }
  )
);
