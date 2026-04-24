import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
  variant?: "fade" | "solid";
};

export function Hairline({
  orientation = "horizontal",
  variant = "fade",
  className,
  ...rest
}: Props) {
  const isHorizontal = orientation === "horizontal";
  return (
    <div
      aria-hidden="true"
      className={cn(
        isHorizontal
          ? variant === "fade"
            ? "hairline w-full"
            : "hairline-solid w-full"
          : "hairline-v h-full",
        className,
      )}
      {...rest}
    />
  );
}
