"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { mockOrders, mockDrivers, mockCustomers } from "@/mocks";
import { cn } from "@/lib/utils/cn";
import {
  Search, X, LayoutDashboard, Package, Truck, Users,
  Map, BarChart3, Bell, Settings, Moon, Sun, LogOut, ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  group: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, theme, setTheme, logout } = useAppStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  function navigate(href: string) {
    router.push(href);
    close();
  }

  function close() {
    setCommandPaletteOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  // Build command list
  const staticCommands: CommandItem[] = [
    { id: "nav-dashboard",     label: "Go to Dashboard",     group: "Navigation", icon: <LayoutDashboard size={15} />, action: () => navigate("/dashboard") },
    { id: "nav-orders",        label: "Go to Orders",        group: "Navigation", icon: <Package size={15} />,        action: () => navigate("/orders") },
    { id: "nav-drivers",       label: "Go to Drivers",       group: "Navigation", icon: <Truck size={15} />,          action: () => navigate("/drivers") },
    { id: "nav-customers",     label: "Go to Customers",     group: "Navigation", icon: <Users size={15} />,          action: () => navigate("/customers") },
    { id: "nav-map",           label: "Open Live Map",       group: "Navigation", icon: <Map size={15} />,            action: () => navigate("/live-map") },
    { id: "nav-analytics",     label: "Open Analytics",      group: "Navigation", icon: <BarChart3 size={15} />,      action: () => navigate("/analytics") },
    { id: "nav-notifications", label: "Open Notifications",  group: "Navigation", icon: <Bell size={15} />,           action: () => navigate("/notifications") },
    { id: "nav-settings",      label: "Open Settings",       group: "Navigation", icon: <Settings size={15} />,       action: () => navigate("/settings") },
    { id: "toggle-theme",      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode", group: "Actions", icon: theme === "dark" ? <Sun size={15} /> : <Moon size={15} />, action: () => { setTheme(theme === "dark" ? "light" : "dark"); close(); } },
    { id: "logout",            label: "Sign Out",            group: "Actions",    icon: <LogOut size={15} />,         action: () => { logout(); navigate("/login"); } },
  ];

  const q = query.trim().toLowerCase();

  const orderResults: CommandItem[] = q.length < 2 ? [] : mockOrders
    .filter((o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q))
    .slice(0, 4)
    .map((o) => ({
      id: `order-${o.id}`,
      label: o.id,
      description: `${o.customerName} · ${o.deliveryCity}`,
      group: "Orders",
      icon: <Package size={15} />,
      action: () => navigate(`/orders/${o.id}`),
    }));

  const driverResults: CommandItem[] = q.length < 2 ? [] : mockDrivers
    .filter((d) => d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q))
    .slice(0, 3)
    .map((d) => ({
      id: `driver-${d.id}`,
      label: d.name,
      description: `${d.city} · ${d.vehicleType}`,
      group: "Drivers",
      icon: <Truck size={15} />,
      action: () => navigate(`/drivers/${d.id}`),
    }));

  const customerResults: CommandItem[] = q.length < 2 ? [] : mockCustomers
    .filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))
    .slice(0, 3)
    .map((c) => ({
      id: `customer-${c.id}`,
      label: c.name,
      description: `${c.city}, ${c.state}`,
      group: "Customers",
      icon: <Users size={15} />,
      action: () => navigate(`/customers/${c.id}`),
    }));

  const filteredStatic = q.length > 0
    ? staticCommands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
    : staticCommands;

  const allItems = [...orderResults, ...driverResults, ...customerResults, ...filteredStatic];

  // Group items
  const groups = allItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatItems = Object.values(groups).flat();

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [commandPaletteOpen]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flatItems[activeIndex]?.action();
    } else if (e.key === "Escape") {
      close();
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!commandPaletteOpen) return null;

  let globalIdx = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden animate-fade-in">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--muted)] flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or type a command…"
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
            aria-autocomplete="list"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
          />
          <button onClick={close} aria-label="Close command palette" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Results */}
        <ul
          id="command-list"
          ref={listRef}
          role="listbox"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {flatItems.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-[var(--muted)]">No results found.</li>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <li key={group} role="presentation">
                <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {group}
                </p>
                <ul role="group">
                  {items.map((item) => {
                    const idx = globalIdx++;
                    const active = idx === activeIndex;
                    return (
                      <li
                        key={item.id}
                        role="option"
                        aria-selected={active}
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-[var(--radius-md)] cursor-pointer transition-colors",
                          active ? "bg-[var(--primary)] text-white" : "text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                        )}
                      >
                        <span className={cn("flex-shrink-0", active ? "text-white" : "text-[var(--muted)]")}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          {item.description && (
                            <p className={cn("text-xs truncate", active ? "text-white/70" : "text-[var(--muted)]")}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        {active && <ArrowRight size={13} className="flex-shrink-0 text-white/70" />}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-[var(--border)] text-[10px] text-[var(--muted)]">
          <span className="flex items-center gap-1"><kbd className="bg-[var(--muted-bg)] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-[var(--muted-bg)] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1"><kbd className="bg-[var(--muted-bg)] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
