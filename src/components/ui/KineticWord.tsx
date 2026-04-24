"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type Props = {
  words: string[];
  interval?: number;
  className?: string;
  accentClassName?: string;
};

export function KineticWord({
  words,
  interval = 2400,
  className,
  accentClassName,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (words.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [words, interval]);

  const active = words[index] ?? words[0];

  return (
    <span
      className={cn(
        "relative inline-flex items-baseline",
        className,
      )}
      aria-live="polite"
    >
      <span
        key={active}
        className={cn(
          "inline-block font-editorial-italic mask-wipe-in text-[color:var(--bronze-600)]",
          accentClassName,
        )}
      >
        {active}
      </span>
    </span>
  );
}
