import Image from "next/image";

import { SectionHeading } from "@/components/summer/SectionHeading";
import { galleryItems } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

function parseObjectPosition(value: string) {
  const match = value.match(/^object-\[(.+)\]$/);
  return match ? match[1].replace(/_/g, " ") : undefined;
}

export function Gallery({
  intro,
  items = galleryItems,
}: {
  intro: SummerPublicSection;
  items?: typeof galleryItems;
}) {
  const supportingSentence =
    typeof intro.body.supporting_sentence === "string" ? intro.body.supporting_sentence : null;

  return (
    <section id="portfolio" className="px-6 py-20 sm:py-24 md:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={intro.eyebrow} title={intro.heading} description={intro.subheading} />
        {supportingSentence ? (
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6a6058] sm:text-base sm:leading-7">{supportingSentence}</p>
        ) : null}

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-12">
          {items.map((item) => (
            <figure key={item.title} className={`${item.spanClass} group`}>
              <div className={`relative overflow-hidden rounded-[1.75rem] border border-black/8 bg-[#e6ddd3] shadow-[0_24px_60px_rgba(0,0,0,0.06)] ${item.aspectClass}`}>
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  style={{ objectPosition: parseObjectPosition(item.imagePosition) }}
                />
              </div>
              <figcaption className="flex items-center justify-between gap-4 px-1 pt-3">
                <div>
                  <p className="text-sm font-medium tracking-[0.01em] text-[#201b18]">{item.title}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-[#877b71]">{item.category}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
