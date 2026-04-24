import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg" | "xl" | "full";

type Props = HTMLAttributes<HTMLElement> & {
  size?: Size;
  as?: ElementType;
  children: ReactNode;
};

const sizes: Record<Size, string> = {
  sm: "max-w-[68ch]",
  md: "max-w-4xl",
  lg: "max-w-7xl",
  xl: "max-w-[96rem]",
  full: "max-w-none",
};

export function Container({
  size = "lg",
  as,
  className,
  children,
  ...rest
}: Props) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn("mx-auto w-full px-6 md:px-10", sizes[size], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
