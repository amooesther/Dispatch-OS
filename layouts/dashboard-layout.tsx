"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { ToastContainer } from "@/components/feedback/toast";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils/cn";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, sidebarOpen } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

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
