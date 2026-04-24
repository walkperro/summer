import Image from "next/image";

import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { cn } from "@/lib/cn";

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

type Props = {
  item: ClassCardItem;
  index?: number;
  variant?: "landscape" | "portrait";
};

export function ClassCard({ item, index = 0, variant = "landscape" }: Props) {
  const accessLabel =
    item.accessLevelMin >= 3
      ? "Inner Circle"
      : item.accessLevelMin >= 2
      ? "Signature"
      : "Essentials";
  const accessClass =
    item.accessLevelMin >= 3
      ? "bg-[color:var(--oxblood-500)] text-white"
      : item.accessLevelMin >= 2
      ? "bg-[color:var(--bronze-500)] text-[color:var(--ink-900)]"
      : "border border-[color:var(--bronze-500)] text-[color:var(--bronze-700)]";

  return (
    <ScrollReveal
      as="article"
      className="group flex h-full flex-col"
      delayMs={index * 60}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[color:var(--paper-300)]",
          variant === "portrait" ? "aspect-[3/4]" : "aspect-[16/11]",
        )}
      >
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover grayscale-[6%] transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-[color:var(--paper-200)]">
            <span className="font-editorial-italic text-5xl text-[color:var(--bronze-400)]">
              {item.category ?? "Class"}
            </span>
            <span className="font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-[color:var(--ink-400)]">
              Available soon
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.32))] opacity-0 transition duration-500 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-white mix-blend-difference">
          №{String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "absolute right-4 top-4 rounded-full px-3 py-1 font-mono-editorial text-[9.5px] uppercase tracking-[0.28em]",
            accessClass,
          )}
        >
          {accessLabel}
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3 font-mono-editorial text-[10.5px] uppercase tracking-[0.28em] text-[color:var(--ink-400)]">
          {item.category && <span>{item.category}</span>}
          {item.durationMinutes && (
            <span className="text-[color:var(--bronze-500)]">· {item.durationMinutes} min</span>
          )}
          {item.difficulty && (
            <span className="text-[color:var(--bronze-500)]">· {item.difficulty}</span>
          )}
        </div>
        <h3 className="font-editorial text-[1.7rem] leading-[1.02] tracking-[-0.02em] text-[color:var(--ink-900)]">
          {item.title}
        </h3>
        {item.summary && (
          <p className="text-[14.5px] leading-[1.7] text-[color:var(--ink-500)]">{item.summary}</p>
        )}
      </div>
    </ScrollReveal>
  );
}
