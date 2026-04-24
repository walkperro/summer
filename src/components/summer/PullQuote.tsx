import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  quote: string;
  attribution?: string;
  className?: string;
  variant?: "cream" | "ink" | "oxblood";
};

export function PullQuote({ eyebrow, quote, attribution, className, variant = "cream" }: Props) {
  const isInk = variant === "ink";
  const isOxblood = variant === "oxblood";

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        isInk && "bg-[color:var(--ink-900)] text-[color:var(--paper-100)]",
        isOxblood && "bg-[color:var(--oxblood-500)] text-[color:var(--paper-100)]",
        !isInk && !isOxblood && "bg-[color:var(--paper-50)] text-[color:var(--ink-900)]",
        className,
      )}
      aria-labelledby="pull-quote-heading"
    >
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          mixBlendMode: isInk || isOxblood ? "overlay" : "multiply",
          opacity: isInk || isOxblood ? 0.12 : 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <Container size="lg" className="relative py-24 md:py-32 lg:py-40">
        {eyebrow && (
          <ScrollReveal>
            <div className="mb-8 flex items-center justify-center gap-4">
              <span
                aria-hidden="true"
                className={cn(
                  "h-px w-10",
                  isInk || isOxblood ? "bg-white/50" : "bg-[color:var(--bronze-500)]",
                )}
              />
              <Eyebrow variant="mono" tone={isInk || isOxblood ? "light" : "bronze"}>
                {eyebrow}
              </Eyebrow>
              <span
                aria-hidden="true"
                className={cn(
                  "h-px w-10",
                  isInk || isOxblood ? "bg-white/50" : "bg-[color:var(--bronze-500)]",
                )}
              />
            </div>
          </ScrollReveal>
        )}
        <ScrollReveal delayMs={120}>
          <p
            id="pull-quote-heading"
            className={cn(
              "font-editorial-italic mx-auto max-w-[20ch] text-balance text-center leading-[1.02] tracking-[-0.02em]",
              "text-[clamp(2.6rem,7vw,6rem)]",
            )}
          >
            <span className="pull-quote-mark" aria-hidden="true">
              &ldquo;
            </span>
            {quote}
            <span className="pull-quote-mark" aria-hidden="true">
              &rdquo;
            </span>
          </p>
        </ScrollReveal>
        {attribution && (
          <ScrollReveal delayMs={220}>
            <p
              className={cn(
                "mt-10 text-center font-mono-editorial text-[11px] uppercase tracking-[0.3em]",
                isInk || isOxblood ? "text-white/70" : "text-[color:var(--ink-400)]",
              )}
            >
              {attribution}
            </p>
          </ScrollReveal>
        )}
      </Container>
    </section>
  );
}
