"use client";

import { useAppStore } from "@/stores/app-store";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const icons = {
  success: <CheckCircle className="h-4 w-4 text-[var(--success)]" />,
  error:   <AlertCircle className="h-4 w-4 text-[var(--danger)]" />,
  warning: <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />,
  info:    <Info className="h-4 w-4 text-[var(--info)]" />,
};

const borderColors = {
  success: "border-l-[var(--success)]",
  error:   "border-l-[var(--danger)]",
  warning: "border-l-[var(--warning)]",
  info:    "border-l-[var(--info)]",
};

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);
  const remove = useAppStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={cn(
            "pointer-events-auto bg-[var(--surface)] border border-[var(--border)] border-l-4 rounded-[var(--radius-lg)]",
            "shadow-[var(--shadow-lg)] px-4 py-3 flex items-start gap-3",
            "animate-fade-in",
            borderColors[toast.type]
          )}
          style={{ animation: "toast-enter 300ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <span className="mt-0.5 flex-shrink-0">{icons[toast.type]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)]">{toast.title}</p>
            {toast.message && (
              <p className="text-xs text-[var(--muted)] mt-0.5">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => remove(toast.id)}
            aria-label="Dismiss notification"
            className="flex-shrink-0 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
