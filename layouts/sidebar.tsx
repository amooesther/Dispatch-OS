"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Truck, Users, Map,
  BarChart3, Bell, Settings, ChevronLeft, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAppStore } from "@/stores/app-store";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { label: "Dashboard",     href: "/dashboard",      icon: LayoutDashboard },
  { label: "Orders",        href: "/orders",          icon: Package },
  { label: "Drivers",       href: "/drivers",         icon: Truck },
  { label: "Customers",     href: "/customers",       icon: Users },
  { label: "Live Map",      href: "/live-map",        icon: Map },
  { label: "Analytics",     href: "/analytics",       icon: BarChart3 },
  { label: "Notifications", href: "/notifications",   icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, unreadCount } = useAppStore();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Main navigation"
        className={cn(
          "fixed top-0 left-0 z-30 h-full bg-[var(--surface)] border-r border-[var(--border)]",
          "flex flex-col transition-all duration-300 ease-in-out",
          "w-[var(--sidebar-width)]",
          // Desktop: translate based on open state
          "lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-[60px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-[var(--topbar-height)] px-4 border-b border-[var(--border)] gap-3 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)] flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-[var(--foreground)] text-base tracking-tight">
              DispatchOS
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul role="list" className="space-y-0.5">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              const isNotif = href === "/notifications";
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium",
                      "transition-colors duration-150",
                      active
                        ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                        : "text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                    {sidebarOpen && (
                      <span className="flex-1 truncate">{label}</span>
                    )}
                    {sidebarOpen && isNotif && unreadCount > 0 && (
                      <Badge variant="danger" className="text-[10px] px-1.5 py-0 min-w-[18px] justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="border-t border-[var(--border)] px-2 py-3 space-y-0.5">
          <Link
            href="/settings"
            aria-current={pathname === "/settings" ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium",
              "transition-colors duration-150",
              pathname === "/settings"
                ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                : "text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
            )}
          >
            <Settings size={18} className="flex-shrink-0" aria-hidden="true" />
            {sidebarOpen && <span>Settings</span>}
          </Link>

          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={cn(
              "hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium",
              "text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] transition-colors"
            )}
          >
            <ChevronLeft
              size={18}
              className={cn("flex-shrink-0 transition-transform duration-300", !sidebarOpen && "rotate-180")}
              aria-hidden="true"
            />
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
