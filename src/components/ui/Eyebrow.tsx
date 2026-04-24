import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "ink" | "light" | "muted" | "bronze";
type Variant = "serif" | "mono";
type Size = "sm" | "md" | "lg";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  tone?: Tone;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const tones: Record<Tone, string> = {
  ink: "text-[color:var(--ink-400)]",
  light: "text-white/70",
  muted: "text-[color:var(--ink-300)]",
  bronze: "text-[color:var(--bronze-600)]",
};

const sizes: Record<Size, string> = {
  sm: "text-[10.5px]",
  md: "text-[11px]",
  lg: "text-xs",
};

export function Eyebrow({
  as,
  tone = "ink",
  variant = "serif",
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  const Component = (as ?? "span") as ElementType;
  const isMono = variant === "mono";
  return (
    <Component
      className={cn(
        "inline-flex items-center gap-2 font-medium uppercase",
        isMono
          ? "font-mono-editorial tracking-[0.28em]"
          : "tracking-[0.32em]",
        sizes[size],
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
