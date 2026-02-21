// 4-color theme system: purple, rose, amber, emerald
// Each task gets a consistent color based on its ID

export type TaskColor = "purple" | "rose" | "amber" | "emerald";

const COLORS: TaskColor[] = ["purple", "rose", "amber", "emerald"];

// Simple hash from task ID to get consistent color assignment
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getTaskColor(taskId: string): TaskColor {
  return COLORS[hashCode(taskId) % COLORS.length];
}

export const colorConfig = {
  purple: {
    bg: "bg-brand-50",
    bgDark: "bg-brand-100",
    text: "text-brand-600",
    textLight: "text-brand-400",
    border: "border-brand-200",
    borderLeft: "border-l-brand-500",
    dot: "bg-brand-500",
    shadow: "shadow-colored-purple",
    hoverBg: "hover:bg-brand-50",
    gradient: "bg-brand-gradient",
    ring: "ring-brand-400/30",
    badge: "color-badge-purple",
    checkBg: "#8b5cf6",
    checkBorder: "border-brand-500",
  },
  rose: {
    bg: "bg-accent-rose-50",
    bgDark: "bg-accent-rose-100",
    text: "text-accent-rose-600",
    textLight: "text-accent-rose-400",
    border: "border-accent-rose-200",
    borderLeft: "border-l-accent-rose-500",
    dot: "bg-accent-rose-500",
    shadow: "shadow-colored-rose",
    hoverBg: "hover:bg-accent-rose-50",
    gradient: "bg-rose-gradient",
    ring: "ring-accent-rose-400/30",
    badge: "color-badge-rose",
    checkBg: "#f43f5e",
    checkBorder: "border-accent-rose-500",
  },
  amber: {
    bg: "bg-accent-amber-50",
    bgDark: "bg-accent-amber-100",
    text: "text-accent-amber-600",
    textLight: "text-accent-amber-400",
    border: "border-accent-amber-200",
    borderLeft: "border-l-accent-amber-500",
    dot: "bg-accent-amber-500",
    shadow: "shadow-colored-amber",
    hoverBg: "hover:bg-accent-amber-50",
    gradient: "bg-amber-gradient",
    ring: "ring-accent-amber-400/30",
    badge: "color-badge-amber",
    checkBg: "#f59e0b",
    checkBorder: "border-accent-amber-500",
  },
  emerald: {
    bg: "bg-accent-emerald-50",
    bgDark: "bg-accent-emerald-100",
    text: "text-accent-emerald-600",
    textLight: "text-accent-emerald-400",
    border: "border-accent-emerald-200",
    borderLeft: "border-l-accent-emerald-500",
    dot: "bg-accent-emerald-500",
    shadow: "shadow-colored-emerald",
    hoverBg: "hover:bg-accent-emerald-50",
    gradient: "bg-emerald-gradient",
    ring: "ring-accent-emerald-400/30",
    badge: "color-badge-emerald",
    checkBg: "#10b981",
    checkBorder: "border-accent-emerald-500",
  },
} as const;

export function getColorConfig(color: TaskColor) {
  return colorConfig[color];
}
