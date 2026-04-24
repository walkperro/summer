import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";

import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "link" | "oxblood" | "inverse";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> & {
    href?: undefined;
    type?: "button" | "submit" | "reset";
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase transition press-effect focus-ring disabled:cursor-not-allowed disabled:opacity-45";

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-4 text-[11px] tracking-[0.22em]",
  md: "min-h-12 px-6 text-sm tracking-[0.18em]",
  lg: "min-h-[3.25rem] px-8 text-[13px] tracking-[0.2em]",
};

const variants: Record<Variant, string> = {
  primary:
    "border border-[color:var(--ink-800)] bg-[color:var(--ink-900)] text-white hover:bg-[color:var(--ink-700)]",
  secondary:
    "border border-[color:var(--ink-900)]/18 bg-transparent text-[color:var(--ink-900)] hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]",
  ghost:
    "border border-transparent bg-transparent text-[color:var(--ink-900)] hover:text-[color:var(--bronze-700)]",
  link:
    "border-0 bg-transparent px-0 text-[color:var(--ink-900)] accent-underline hover:text-[color:var(--bronze-700)]",
  oxblood:
    "border border-[color:var(--oxblood-700)] bg-[color:var(--oxblood-500)] text-[color:var(--paper-100)] hover:bg-[color:var(--oxblood-600)]",
  inverse:
    "border border-[color:var(--paper-200)] bg-[color:var(--paper-100)] text-[color:var(--ink-900)] hover:bg-[color:var(--paper-50)]",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      ...rest
    } = props;

    const classes = cn(
      base,
      sizes[size],
      variants[variant],
      fullWidth && "w-full",
      className,
    );

    const body = (
      <>
        {loading ? (
          <Spinner className="h-4 w-4" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
        )}
        <span className={cn("inline-flex items-center", loading && "opacity-80")}>{children}</span>
        {rightIcon && !loading && (
          <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
        )}
      </>
    );

    if ("href" in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-busy={loading || undefined}
          {...anchorRest}
        >
          {body}
        </a>
      );
    }

    const {
      type = "button",
      disabled,
      ...buttonRest
    } = rest as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={classes}
        {...buttonRest}
      >
        {body}
      </button>
    );
  },
);
