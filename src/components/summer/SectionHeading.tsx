import { cn } from "@/lib/cn";

import { Eyebrow } from "@/components/ui/Eyebrow";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
  size?: "md" | "lg" | "xl";
  italic?: boolean;
  number?: string;
  className?: string;
};

const sizes: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-6xl md:text-[4.25rem]",
  xl: "text-5xl sm:text-6xl md:text-[5.25rem] lg:text-[6rem]",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  size = "md",
  italic = false,
  number,
  className,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "mx-auto text-center" : align === "right" ? "ml-auto text-right" : "text-left";
  const descriptionWidth = align === "center" ? "max-w-2xl mx-auto" : align === "right" ? "max-w-xl ml-auto" : "max-w-xl";

  return (
    <div className={cn(alignment, className)}>
      <div className={cn("flex items-center gap-3", align === "right" ? "justify-end" : align === "center" ? "justify-center" : undefined)}>
        {number && (
          <span className={cn("font-mono-editorial text-[11px] uppercase tracking-[0.28em]", light ? "text-white/55" : "text-[color:var(--bronze-600)]")}>
            {number}
          </span>
        )}
        <Eyebrow variant="mono" tone={light ? "light" : "bronze"}>
          {eyebrow}
        </Eyebrow>
      </div>
      <h2
        className={cn(
          "font-editorial mt-5 text-balance leading-[0.95] font-medium tracking-[-0.035em]",
          sizes[size],
          italic && "font-editorial-italic",
          light ? "text-white" : "text-[color:var(--ink-900)]",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base leading-7 sm:text-lg sm:leading-8", descriptionWidth, light ? "text-white/75" : "text-[color:var(--ink-500)]")}>
          {description}
        </p>
      )}
    </div>
  );
}
