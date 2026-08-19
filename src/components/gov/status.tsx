import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { IncidentStatus, Severity } from "@/lib/demo/types";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        critical: "border-critical/30 bg-critical/12 text-critical",
        high: "border-high/30 bg-high/12 text-high",
        medium: "border-medium/40 bg-medium/18 text-medium-foreground",
        low: "border-low/30 bg-low/12 text-low",
        safe: "border-safe/30 bg-safe/12 text-safe",
        neutral: "border-border bg-muted text-muted-foreground",
        official: "border-primary/25 bg-primary/10 text-primary",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type Tone = NonNullable<VariantProps<typeof badge>["tone"]>;

export function StatusPill({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return <span className={cn(badge({ tone }), className)}>{children}</span>;
}

export const severityTone: Record<Severity, Tone> = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <StatusPill tone={severityTone[severity]}>{severity}</StatusPill>;
}

const statusTone: Record<IncidentStatus, Tone> = {
  SUBMITTED: "neutral",
  UNDER_REVIEW: "medium",
  VERIFIED: "official",
  RESPONSE_ASSIGNED: "low",
  IN_PROGRESS: "high",
  RESOLVED: "safe",
  REJECTED: "neutral",
};

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  return <StatusPill tone={statusTone[status]}>{status.replace(/_/g, " ")}</StatusPill>;
}

export function VerificationBadge({ verified, by }: { verified: boolean; by?: string }) {
  return (
    <StatusPill tone={verified ? "official" : "neutral"}>
      {verified ? `Verified${by ? ` · ${by.split(" ").slice(-1)[0]}` : ""}` : "Unverified"}
    </StatusPill>
  );
}

export function severityColorVar(severity: Severity): string {
  return {
    CRITICAL: "var(--critical)",
    HIGH: "var(--high)",
    MEDIUM: "var(--medium)",
    LOW: "var(--low)",
  }[severity];
}
