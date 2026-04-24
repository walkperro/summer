import Image from "next/image";

import { ScrollReveal } from "@/components/summer/ScrollReveal";

export type ClassCardItem = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  durationMinutes: number | null;
  difficulty: string | null;
  category: string | null;
  accessLevelMin: number;
};

export function ClassCard({ item }: { item: ClassCardItem }) {
  return (
    <ScrollReveal as="article" className="group flex h-full flex-col overflow-hidden luxe-card">
      <div className="relative aspect-[16/11] overflow-hidden bg-[#e8ddd0]">
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.28em] text-[#8a7d72]">
            Coming soon
          </div>
        )}
        {item.accessLevelMin > 0 ? (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur">
            {item.accessLevelMin >= 3 ? "Inner Circle" : item.accessLevelMin >= 2 ? "Signature" : "Essentials"}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#8a7d72]">
          {item.category ? <span>{item.category}</span> : null}
          {item.durationMinutes ? (
            <span className="text-[#c8b193]">· {item.durationMinutes} min</span>
          ) : null}
          {item.difficulty ? <span className="text-[#c8b193]">· {item.difficulty}</span> : null}
        </div>
        <h3 className="font-editorial mt-4 text-2xl leading-tight tracking-[-0.005em]">{item.title}</h3>
        {item.summary ? (
          <p className="mt-3 text-sm leading-relaxed text-[#3a322c]">{item.summary}</p>
        ) : null}
      </div>
    </ScrollReveal>
  );
}
