import { ScrollReveal } from "@/components/summer/ScrollReveal";

type Props = {
  eyebrow?: string;
  quote: string;
  attribution?: string;
  className?: string;
};

export function PullQuote({ eyebrow, quote, attribution, className }: Props) {
  return (
    <section
      className={`relative overflow-hidden bg-[#f6f1ea] px-6 py-24 md:px-10 md:py-28 ${className || ""}`}
      aria-labelledby="pull-quote-heading"
    >
      <div className="mx-auto max-w-5xl text-center">
        {eyebrow ? (
          <ScrollReveal>
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a7d72]">{eyebrow}</p>
          </ScrollReveal>
        ) : null}
        <ScrollReveal delayMs={100}>
          <p
            id="pull-quote-heading"
            className="font-editorial-italic mt-6 text-balance text-3xl leading-[1.18] tracking-[-0.005em] text-[#181512] md:text-5xl"
          >
            <span className="pull-quote-mark" aria-hidden="true">“</span>
            {quote}
            <span className="pull-quote-mark" aria-hidden="true">”</span>
          </p>
        </ScrollReveal>
        {attribution ? (
          <ScrollReveal delayMs={200}>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-[#8a7d72]">{attribution}</p>
          </ScrollReveal>
        ) : null}
      </div>
      <div aria-hidden="true" className="hairline mx-auto mt-16 max-w-3xl" />
    </section>
  );
}
