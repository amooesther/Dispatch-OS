import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "primary" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[var(--success-bg)] text-[var(--success-text)]",
  warning: "bg-[var(--warning-bg)] text-[var(--warning-text)]",
  danger:  "bg-[var(--danger-bg)] text-[var(--danger-text)]",
  info:    "bg-[var(--info-bg)] text-[var(--info-text)]",
  primary: "bg-[var(--primary-muted)] text-[var(--primary)]",
  muted:   "bg-[var(--muted-bg)] text-[var(--muted)]",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger:  "bg-[var(--danger)]",
  info:    "bg-[var(--info)]",
  primary: "bg-[var(--primary)]",
  muted:   "bg-[var(--muted)]",
};

export function Badge({ variant = "muted", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
