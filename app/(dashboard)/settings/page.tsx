"use client";

import { useAppStore } from "@/stores/app-store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { Sun, Moon, Monitor, Bell, Shield, User, Palette, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light",  label: "Light",  icon: <Sun size={16} /> },
  { value: "dark",   label: "Dark",   icon: <Moon size={16} /> },
  { value: "system", label: "System", icon: <Monitor size={16} /> },
];

function SettingRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        {description && <p className="text-xs text-[var(--muted)] mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme, user, logout } = useAppStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Manage your preferences and account.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <User size={14} /> <CardTitle>Profile</CardTitle>
          </div>
        </CardHeader>
        <div className="divide-y divide-[var(--border)]">
          <SettingRow label="Name" description="Your display name">
            <span className="text-sm text-[var(--muted)]">{user?.name ?? "—"}</span>
          </SettingRow>
          <SettingRow label="Email" description="Your account email">
            <span className="text-sm text-[var(--muted)]">{user?.email ?? "—"}</span>
          </SettingRow>
          <SettingRow label="Role" description="Your access level">
            <span className="text-sm text-[var(--muted)]">{user?.role ?? "—"}</span>
          </SettingRow>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <Palette size={14} /> <CardTitle>Appearance</CardTitle>
          </div>
        </CardHeader>
        <SettingRow label="Theme" description="Choose your preferred color scheme">
          <div className="flex gap-1 bg-[var(--muted-bg)] p-0.5 rounded-[var(--radius-md)]">
            {THEME_OPTIONS.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                aria-pressed={theme === value}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all",
                  theme === value
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </SettingRow>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <Bell size={14} /> <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <div className="divide-y divide-[var(--border)]">
          {[
            { label: "New orders", description: "Get notified when a new order is created" },
            { label: "Delivery updates", description: "Status changes for active deliveries" },
            { label: "Driver alerts", description: "Driver availability changes" },
            { label: "System updates", description: "Platform maintenance and news" },
          ].map(({ label, description }) => (
            <SettingRow key={label} label={label} description={description}>
              <Toggle />
            </SettingRow>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <Shield size={14} /> <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <div className="divide-y divide-[var(--border)]">
          <SettingRow label="Two-factor authentication" description="Add an extra layer of security">
            <Button variant="outline" size="sm">Set up</Button>
          </SettingRow>
          <SettingRow label="Active sessions" description="Manage devices with access">
            <Button variant="outline" size="sm">View sessions</Button>
          </SettingRow>
        </div>
      </Card>

      {/* Sign out */}
      <Card>
        <SettingRow label="Sign out" description="Sign out of your account on this device">
          <Button variant="danger" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut size={14} /> Sign out
          </Button>
        </SettingRow>
      </Card>
    </div>
  );
}

function Toggle() {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked className="sr-only peer" />
      <div className={cn(
        "w-9 h-5 rounded-full transition-colors",
        "bg-[var(--border)] peer-checked:bg-[var(--primary)]",
        "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
        "after:bg-white after:rounded-full after:h-4 after:w-4",
        "after:transition-transform peer-checked:after:translate-x-4"
      )} />
      <span className="sr-only">Toggle notification</span>
    </label>
  );
}
