import { cn } from "@/lib/cn";

type Status =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "paused";

type Tone = "success" | "warning" | "info" | "muted" | "danger";

const STATUS_MAP: Record<Status, { label: string; tone: Tone }> = {
  active: { label: "Active", tone: "success" },
  trialing: { label: "Trial", tone: "info" },
  past_due: { label: "Past due", tone: "warning" },
  canceled: { label: "Canceled", tone: "muted" },
  incomplete: { label: "Incomplete", tone: "warning" },
  paused: { label: "Paused", tone: "muted" },
};

const TONE_CLASSES: Record<Tone, string> = {
  success: "text-[color:var(--success-700)] border-[color:var(--success-700)]/30",
  warning: "text-[color:var(--bronze-700)] border-[color:var(--bronze-500)]/40",
  info: "text-[color:var(--bronze-600)] border-[color:var(--bronze-400)]/40",
  muted: "text-[color:var(--ink-400)] border-[color:var(--ink-200)]",
  danger: "text-[color:var(--danger-700)] border-[color:var(--danger-700)]/30",
};

type Props = {
  status?: Status;
  label?: string;
  tone?: Tone;
  className?: string;
};

export function StatusBadge({ status, label, tone, className }: Props) {
  const resolved =
    status && status in STATUS_MAP
      ? STATUS_MAP[status]
      : { label: label ?? status ?? "", tone: tone ?? "muted" };
  const displayLabel = label ?? resolved.label;
  const displayTone = tone ?? resolved.tone;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.24em] bg-[color:var(--paper-50)]",
        TONE_CLASSES[displayTone],
        className,
      )}
    >
      <span className="status-dot" aria-hidden="true" />
      {displayLabel}
    </span>
  );
}
