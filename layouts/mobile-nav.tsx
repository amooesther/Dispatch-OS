"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Map, BarChart3, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const MOBILE_NAV = [
  { label: "Dashboard", href: "/dashboard",  icon: LayoutDashboard },
  { label: "Orders",    href: "/orders",      icon: Package },
  { label: "Map",       href: "/live-map",    icon: Map },
  { label: "Analytics", href: "/analytics",   icon: BarChart3 },
  { label: "More",      href: "/drivers",     icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-20 bg-[var(--surface)] border-t border-[var(--border)] lg:hidden"
    >
      <ul role="list" className="flex">
        {MOBILE_NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium",
                  "transition-colors duration-150",
                  active ? "text-[var(--primary)]" : "text-[var(--muted)]"
                )}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
