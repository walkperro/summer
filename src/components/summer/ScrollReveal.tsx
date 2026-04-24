"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "section" | "article" | "li" | "figure";
};

export function ScrollReveal({ children, className, delayMs = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (delayMs) {
              window.setTimeout(() => {
                target.setAttribute("data-revealed", "true");
              }, delayMs);
            } else {
              target.setAttribute("data-revealed", "true");
            }
            observer.unobserve(target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  const Tag = as as unknown as React.ElementType;
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal=""
      className={className}
    >
      {children}
    </Tag>
  );
}
