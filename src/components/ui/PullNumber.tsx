import { cn } from "@/lib/cn";

type Props = {
  value: string;
  label?: string;
  tone?: "bronze" | "ink" | "light";
  size?: "md" | "lg" | "xl";
  className?: string;
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  md: "text-5xl sm:text-6xl",
  lg: "text-6xl sm:text-7xl",
  xl: "text-7xl sm:text-8xl",
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  bronze: "text-[color:var(--bronze-600)]",
  ink: "text-[color:var(--ink-900)]",
  light: "text-white/85",
};

export function PullNumber({
  value,
  label,
  tone = "bronze",
  size = "lg",
  className,
}: Props) {
  return (
    <div className={cn("flex items-baseline gap-4", className)}>
      <span
        className={cn(
          "font-editorial-italic leading-[0.85] tracking-[-0.045em]",
          sizes[size],
          tones[tone],
        )}
      >
        {value}
      </span>
      {label && (
        <span
          className={cn(
            "eyebrow eyebrow-mono",
            tone === "light" ? "eyebrow-light" : undefined,
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
