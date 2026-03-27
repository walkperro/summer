import Image from "next/image";

import type { SummerPublicSection } from "@/lib/summer/site-content";

export function SignatureBreak({ section }: { section: SummerPublicSection }) {
  return (
    <section className="px-6 py-8 md:px-10 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.55fr)]">
        <div className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-[#1a1613] text-white shadow-[0_28px_80px_rgba(0,0,0,0.12)]">
          <div className="absolute inset-0">
            <Image
              src="/images/summer/accent/signature_16_9_aspect_ratio.jpg"
              alt="Summer standing in a refined private gym in a signature monochrome frame."
              fill
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="object-cover object-[68%_32%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,12,10,0.84)_0%,rgba(14,12,10,0.48)_38%,rgba(14,12,10,0.14)_70%,rgba(14,12,10,0.32)_100%)]" />
          </div>
          <div className="relative z-10 flex min-h-[24rem] items-end p-7 sm:min-h-[28rem] sm:p-10">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/64">{section.eyebrow}</p>
              <blockquote className="font-editorial mt-4 text-balance text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl">
                {section.heading}
              </blockquote>
            </div>
          </div>
        </div>

        <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/8 bg-[#ddd5cb] shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
          <Image
            src="/images/summer/accent/signature_4_5_aspect_ratio.jpg"
            alt="Portrait signature image of Summer standing with calm confidence in a monochrome training space."
            fill
            sizes="(min-width: 1024px) 24vw, 100vw"
            className="object-cover object-[58%_24%]"
          />
        </figure>
      </div>
    </section>
  );
}
