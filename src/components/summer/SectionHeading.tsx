type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  const descriptionWidth = align === "center" ? "max-w-2xl" : "max-w-xl";

  return (
    <div className={`${alignment}`}>
      <p className={`text-[11px] uppercase tracking-[0.32em] ${light ? "text-white/70" : "text-[#7a6f67]"}`}>
        {eyebrow}
      </p>
      <h2 className={`font-editorial mt-4 text-balance text-4xl leading-none font-medium tracking-[-0.03em] sm:text-5xl ${light ? "text-white" : "text-[#181512]"}`}>
        {title}
      </h2>
      <p className={`mt-5 ${descriptionWidth} text-base leading-7 ${light ? "text-white/74" : "text-[#5f5650]"}`}>
        {description}
      </p>
    </div>
  );
}
