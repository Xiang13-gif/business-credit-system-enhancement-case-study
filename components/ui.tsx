import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b bg-card px-5 py-6 md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-normal text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("panel p-5", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  helper,
  tone = "default"
}: {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger"
  }[tone];

  return (
    <Card className="min-h-28">
      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{label}</p>
      <p className={cn("mt-3 break-words text-2xl font-semibold tracking-normal md:text-3xl", toneClass)}>{value}</p>
      {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
    </Card>
  );
}

export function Badge({
  children,
  tone = "default"
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const toneClass = {
    default: "border-border bg-muted text-muted-foreground",
    success: "border-success/20 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/15 text-warning-foreground dark:text-warning",
    danger: "border-danger/20 bg-danger/10 text-danger",
    info: "border-primary/20 bg-primary/10 text-primary"
  }[tone];

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", toneClass)}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  type = "button",
  disabled = false,
  title
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  title?: string;
}) {
  const className = cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" && "border bg-card text-foreground hover:bg-muted",
    variant === "ghost" && "text-muted-foreground hover:bg-muted hover:text-foreground"
  );

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick} title={title} type={type}>
      {children}
    </button>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
