import Image from "next/image";

import { SectionHeading } from "@/components/summer/SectionHeading";
import { aboutImages, aboutPoints } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

export function About({
  section,
  images = aboutImages,
  points = aboutPoints,
}: {
  section: SummerPublicSection;
  images?: typeof aboutImages;
  points?: string[];
}) {
  const paragraphs = Array.isArray(section.body.paragraphs) ? (section.body.paragraphs as string[]) : [];

  return (
    <section id="about" className="px-6 py-20 sm:py-24 md:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] sm:items-end">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/8 bg-[#ece3d8] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <Image
              src={images.main.src}
              alt={images.main.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover object-center"
            />
          </figure>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/8 bg-[#ece3d8] shadow-[0_24px_60px_rgba(0,0,0,0.06)] sm:mb-10">
            <Image
              src={images.supporting.src}
              alt={images.supporting.alt}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 100vw"
              className="object-cover object-center"
            />
          </figure>
        </div>

        <div>
          <SectionHeading eyebrow={section.eyebrow} title={section.heading} description={section.subheading} />
          <div className="mt-8 space-y-5 text-[#5f5650]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-base leading-7">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {points.map((point) => (
              <div key={point} className="border border-black/8 bg-white/70 px-5 py-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
                <p className="text-sm leading-6 text-[#433c37]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
