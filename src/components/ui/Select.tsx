import type { SelectHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, hint, error, id, className, containerClassName, children, ...rest },
  ref,
) {
  const reactId = useId();
  const selectId = id ?? `sel-${reactId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="eyebrow eyebrow-bronze">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center border-b border-[color:var(--ink-900)]/15 transition",
          "focus-within:border-[color:var(--bronze-500)]",
          error && "border-[color:var(--danger-700)] focus-within:border-[color:var(--danger-700)]",
        )}
      >
        <select
          id={selectId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hintId, errorId) || undefined}
          className={cn(
            "w-full appearance-none bg-transparent pb-2 pr-8 text-base text-[color:var(--ink-900)]",
            "focus:outline-none",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className="pointer-events-none absolute right-1 h-2.5 w-2.5 text-[color:var(--ink-400)]"
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
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
