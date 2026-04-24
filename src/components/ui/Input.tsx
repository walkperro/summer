import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  leftAdornment?: ReactNode;
  containerClassName?: string;
  variant?: "minimal" | "boxed";
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    hint,
    error,
    leftAdornment,
    id,
    className,
    containerClassName,
    variant = "minimal",
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `in-${reactId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="eyebrow eyebrow-bronze"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-3 transition",
          variant === "minimal"
            ? "border-b border-[color:var(--ink-900)]/15 pb-2 focus-within:border-[color:var(--bronze-500)]"
            : "rounded-md border border-[color:var(--ink-900)]/15 bg-white px-4 focus-within:border-[color:var(--bronze-500)]",
          error && "border-[color:var(--danger-700)] focus-within:border-[color:var(--danger-700)]",
        )}
      >
        {leftAdornment && (
          <span className="shrink-0 text-[color:var(--ink-400)]">{leftAdornment}</span>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hintId, errorId) || undefined}
          className={cn(
            "flex-1 bg-transparent text-base text-[color:var(--ink-900)] placeholder:text-[color:var(--ink-300)]",
            "focus:outline-none",
            variant === "minimal" ? "min-h-10" : "min-h-12 py-3",
            className,
          )}
          {...rest}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="font-editorial-italic text-[13px] text-[color:var(--ink-400)]">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="font-editorial-italic text-[13px] text-[color:var(--danger-700)]"
        >
          {error}
        </p>
      )}
    </div>
  );
});
