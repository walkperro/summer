import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  tone?: "paper" | "transparent";
};

export function EmptyState({
  eyebrow,
  title,
  subtitle,
  action,
  className,
  tone = "paper",
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-[20px] border border-dashed border-[color:var(--bronze-300)]/80 p-8 text-left sm:p-10",
        tone === "paper"
          ? "bg-[color:var(--paper-50)]"
          : "bg-transparent",
        className,
      )}
    >
      {eyebrow && <span className="eyebrow eyebrow-bronze">{eyebrow}</span>}
      <h3 className="font-editorial-italic text-3xl leading-[1.05] text-[color:var(--ink-900)] sm:text-4xl">
        {title}
      </h3>
      {subtitle && (
        <p className="max-w-[52ch] text-[15px] leading-relaxed text-[color:var(--ink-500)]">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
