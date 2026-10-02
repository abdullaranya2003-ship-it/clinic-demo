import { ReactNode } from "react";
import clsx from "clsx";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("rounded-xl2 border border-line bg-surface p-5 shadow-card", className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  tone?: "default" | "success" | "danger" | "accent";
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-primary-50 text-primary",
    success: "bg-primary-50 text-success",
    danger: "bg-accent-50 text-danger",
    accent: "bg-accent-50 text-accent",
  };

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs text-ink/50">{label}</p>
        <p className="mt-1 font-mono text-2xl font-semibold text-ink">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-ink/40">{sub}</p>}
      </div>
      {icon && (
        <div className={clsx("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", toneClasses[tone])}>
          {icon}
        </div>
      )}
    </Card>
  );
}
