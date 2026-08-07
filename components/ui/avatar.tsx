import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

// Deterministic color from name
function getColor(name: string): string {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500",
    "bg-rose-500", "bg-amber-500", "bg-cyan-500",
    "bg-pink-500", "bg-indigo-500",
  ];
  const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover flex-shrink-0", sizeStyles[size], className)}
      />
    );
  }
  return (
    <span
      aria-label={name}
      className={cn(
        "inline-flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0",
        sizeStyles[size],
        getColor(name),
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
}
