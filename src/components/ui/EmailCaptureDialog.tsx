"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { Input } from "./Input";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void | Promise<void>;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  busy?: boolean;
};

export function EmailCaptureDialog({
  open,
  onClose,
  onSubmit,
  title = "A moment for your email.",
  subtitle = "We'll send your receipt and access details there.",
  submitLabel = "Continue to checkout",
  busy = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.classList.add("no-scroll");

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    await onSubmit(trimmed);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] flex items-end justify-center sm:items-center",
        "bg-[color:var(--ink-950)]/55 backdrop-blur-sm",
      )}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className={cn(
          "relative mx-4 mb-4 w-full max-w-md overflow-hidden rounded-[24px] bg-[color:var(--paper-50)] p-7 sm:mb-0",
          "shadow-[var(--shadow-xl)] border border-[color:var(--bronze-300)]",
        )}
      >
        <div className="mb-5 flex flex-col gap-2">
          <Eyebrow variant="mono" tone="bronze">
            Checkout · Email
          </Eyebrow>
          <h2 className="font-editorial text-3xl leading-[1.05] text-[color:var(--ink-900)]">
            {title}
          </h2>
          <p className="max-w-[40ch] text-sm text-[color:var(--ink-500)]">{subtitle}</p>
        </div>

        <Input
          ref={inputRef}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error ?? undefined}
          required
        />

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={busy} fullWidth>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
