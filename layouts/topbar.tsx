"use client";

import { Menu, Bell, Sun, Moon, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { useState, useRef, useEffect } from "react";

export function Topbar() {
  const { toggleSidebar, theme, setTheme, unreadCount, user, logout, setCommandPaletteOpen } = useAppStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut Cmd/Ctrl+K
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header
      className={cn(
        "h-[var(--topbar-height)] bg-[var(--surface)] border-b border-[var(--border)]",
        "flex items-center gap-3 px-4 sticky top-0 z-10"
      )}
    >
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
        className="lg:hidden"
      >
        <Menu size={18} />
      </Button>

      {/* Search trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-[var(--radius-md)]",
          "bg-[var(--muted-bg)] border border-[var(--border)]",
          "text-sm text-[var(--muted)] transition-colors hover:border-[var(--border-strong)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
          "w-48 md:w-64"
        )}
        aria-label="Open search"
      >
        <Search size={14} aria-hidden="true" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 font-mono text-[10px] text-[var(--muted)]">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </Button>

      {/* Notifications */}
      <Link href="/notifications" aria-label={`${unreadCount} unread notifications`}>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-[var(--danger)] text-white text-[9px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </Link>

      {/* User menu */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="User menu"
          className="flex items-center gap-2 rounded-[var(--radius-md)] p-1 hover:bg-[var(--muted-bg)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        >
          <Avatar name={user?.name ?? "User"} size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-[var(--foreground)] leading-none">{user?.name ?? "Demo User"}</p>
            <p className="text-[10px] text-[var(--muted)] leading-none mt-0.5">{user?.role ?? "Manager"}</p>
          </div>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className={cn(
              "absolute right-0 top-full mt-2 w-44 bg-[var(--surface)] border border-[var(--border)]",
              "rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden z-50 animate-fade-in"
            )}
          >
            <div className="px-3 py-2 border-b border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">{user?.email}</p>
            </div>
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)] transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
