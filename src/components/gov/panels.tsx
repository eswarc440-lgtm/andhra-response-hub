import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { StatusPill } from "./status";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="gov-label">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-md border border-border bg-card shadow-panel", className)}>
      {title ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
            {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function MetricTile({
  label,
  value,
  suffix,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: number | string;
  suffix?: string;
  hint?: string;
  tone?: "neutral" | "critical" | "high" | "safe" | "primary";
}) {
  const bar = {
    neutral: "bg-border",
    critical: "bg-critical",
    high: "bg-high",
    safe: "bg-safe",
    primary: "bg-primary",
  }[tone];

  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-card p-4 shadow-panel">
      <span className={cn("absolute inset-y-0 left-0 w-1", bar)} />
      <p className="gov-label">{label}</p>
      <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-foreground">
        {value}
        {suffix ? <span className="ml-1 text-base text-muted-foreground">{suffix}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Counter({ to, duration = 1600 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-IN")}
    </span>
  );
}

export function DemoDataNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border border-medium/40 bg-medium/12 px-3 py-2 text-xs text-medium-foreground",
        className,
      )}
    >
      <StatusPill tone="medium">Demo data</StatusPill>
      <span>
        This environment runs on realistic Andhra Pradesh sample data. Figures are illustrative and not an
        official government advisory.
      </span>
    </div>
  );
}

export function AiAssistNotice({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      <span className="font-semibold text-foreground">AI-assisted recommendation.</span> Generated from
      multi-source disaster intelligence. The final operational decision rests with the authorised officer.
    </p>
  );
}

export function FactorList({
  factors,
}: {
  factors: { label: string; effect: "positive" | "negative" | "neutral"; weight?: number }[];
}) {
  return (
    <ul className="space-y-1.5 text-sm">
      {factors.map((f) => (
        <li key={f.label} className="flex items-start gap-2">
          <span
            className={cn(
              "mt-0.5 font-mono text-xs font-bold",
              f.effect === "positive" && "text-safe",
              f.effect === "negative" && "text-critical",
              f.effect === "neutral" && "text-muted-foreground",
            )}
          >
            {f.effect === "positive" ? "+" : f.effect === "negative" ? "−" : "·"}
          </span>
          <span className="text-foreground/90">{f.label}</span>
          {f.weight ? (
            <span className="ml-auto font-mono text-xs text-muted-foreground">{f.weight}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ScoreMeter({ score, label }: { score: number; label: string }) {
  const tone = score >= 80 ? "bg-critical" : score >= 60 ? "bg-high" : score >= 40 ? "bg-medium" : "bg-low";
  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="gov-label">{label}</p>
        <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">{score}</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-muted/40 px-4 py-10 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function LastUpdated({ at, label = "Last updated" }: { at: string; label?: string }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}: {new Date(at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} IST
    </p>
  );
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (Math.abs(mins) < 60) return mins > 0 ? `${mins} min ago` : `in ${-mins} min`;
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 48) return hours > 0 ? `${hours} h ago` : `in ${-hours} h`;
  const days = Math.round(hours / 24);
  return days > 0 ? `${days} d ago` : `in ${-days} d`;
}
