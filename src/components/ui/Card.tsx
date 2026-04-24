import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  featured?: boolean;
  interactive?: boolean;
  tone?: "paper" | "ink";
  rounded?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
};

const rounds: Record<NonNullable<Props["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-[20px]",
  xl: "rounded-[32px]",
};

export function Card({
  as,
  featured = false,
  interactive = false,
  tone = "paper",
  rounded = "lg",
  className,
  children,
  ...rest
}: Props) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "relative overflow-hidden",
        tone === "paper" ? "luxe-card" : "luxe-card-ink",
        featured && "luxe-card-featured",
        rounds[rounded],
        interactive && "cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

function Cover({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative overflow-hidden", className)} {...rest}>
      {children}
    </div>
  );
}

function Body({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-3 p-6 sm:p-7", className)} {...rest}>
      {children}
    </div>
  );
}

function Footer({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--bronze-200)] px-6 py-4 sm:px-7",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

Card.Cover = Cover;
Card.Body = Body;
Card.Footer = Footer;
