import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Props = LabelHTMLAttributes<HTMLLabelElement> & {
  tone?: "ink" | "bronze";
};

export function Label({ tone = "bronze", className, children, ...rest }: Props) {
  return (
    <label
      className={cn(
        "eyebrow",
        tone === "bronze" ? "eyebrow-bronze" : undefined,
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}
