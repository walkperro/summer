import type { TextareaHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, hint, error, id, className, containerClassName, rows = 5, ...rest },
  ref,
) {
  const reactId = useId();
  const textareaId = id ?? `ta-${reactId}`;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="eyebrow eyebrow-bronze">
          {label}
        </label>
      )}
      <div
        className={cn(
          "rounded-md border border-[color:var(--ink-900)]/15 bg-white px-4 py-3 transition",
          "focus-within:border-[color:var(--bronze-500)]",
          error && "border-[color:var(--danger-700)] focus-within:border-[color:var(--danger-700)]",
        )}
      >
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(hintId, errorId) || undefined}
          className={cn(
            "block w-full resize-y bg-transparent text-base leading-relaxed text-[color:var(--ink-900)]",
            "placeholder:text-[color:var(--ink-300)] focus:outline-none",
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
