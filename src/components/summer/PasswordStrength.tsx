"use client";

import { useMemo } from "react";

import { cn } from "@/lib/cn";

type Props = {
  value: string;
  className?: string;
};

const LABELS = ["weak", "building", "steady", "strong", "excellent"];

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

export function PasswordStrength({ value, className }: Props) {
  const { score, label, width } = useMemo(() => {
    if (!value) return { score: 0, label: "", width: 0 };
    const s = scorePassword(value);
    return { score: s, label: LABELS[s], width: ((s + 1) / LABELS.length) * 100 };
  }, [value]);

  if (!value) return null;

  return (
    <div
      className={cn(
        "flex items-baseline gap-3 font-mono-editorial text-[10.5px] uppercase tracking-[0.3em]",
        className,
      )}
      aria-live="polite"
    >
      <span className="text-[color:var(--ink-400)]">Strength</span>
      <span className="relative inline-flex min-w-[6rem] items-baseline">
        <span className="font-editorial-italic text-[13px] tracking-normal text-[color:var(--bronze-700)]">
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-[3px] left-0 h-[1.5px] bg-[color:var(--bronze-500)] transition-all duration-500",
            score >= 3 ? "bg-[color:var(--success-700)]" : undefined,
          )}
          style={{ width: `${width}%` }}
        />
      </span>
    </div>
  );
}
