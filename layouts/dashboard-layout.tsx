"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { ToastContainer } from "@/components/feedback/toast";
import { CommandPalette } from "@/components/command-palette";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();
  // Wait for Zustand persist to hydrate from localStorage before making auth decisions
  const [hydrated, setHydrated] = useState(false);

  // Real-time notification simulation — runs on every dashboard page
  useRealtimeNotifications();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  // Show a loading screen until the store has hydrated
  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <Spinner size="lg" />
      </div>
    );
  }

  // After hydration, if not authenticated redirect is already in-flight
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main
          id="main-content"
          className={cn(
            "flex-1 overflow-y-auto pb-16 lg:pb-0",
            "transition-all duration-300"
          )}
        >
          <div className="max-w-[1600px] mx-auto p-4 md:p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
      <ToastContainer />
      <CommandPalette />
    </div>
  );
}
