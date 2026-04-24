import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "paper" | "paper-warm" | "paper-deep" | "ink" | "bronze-veil" | "oxblood-veil";
type Pad = "none" | "sm" | "md" | "lg" | "xl";

type Props = HTMLAttributes<HTMLElement> & {
  tone?: Tone;
  pad?: Pad;
  grain?: boolean;
  children: ReactNode;
};

const tones: Record<Tone, string> = {
  paper: "bg-[color:var(--paper-100)] text-[color:var(--ink-900)]",
  "paper-warm": "bg-[color:var(--paper-50)] text-[color:var(--ink-900)]",
  "paper-deep": "bg-[color:var(--paper-200)] text-[color:var(--ink-900)]",
  ink: "bg-[color:var(--ink-900)] text-[color:var(--paper-100)]",
  "bronze-veil":
    "bg-[color:var(--bronze-100)] text-[color:var(--ink-900)]",
  "oxblood-veil":
    "bg-[color:var(--oxblood-500)] text-[color:var(--paper-100)]",
};

const pads: Record<Pad, string> = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20 lg:py-24",
  lg: "py-20 sm:py-24 md:py-28 lg:py-32",
  xl: "py-24 sm:py-28 md:py-32 lg:py-40",
};

export function Section({
  tone = "paper",
  pad = "lg",
  grain = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <section
      className={cn(
        "relative",
        tones[tone],
        pads[pad],
        grain && "grain",
        className,
      )}
      {...rest}
    >
      <div className="relative z-[2]">{children}</div>
    </section>
  );
}
