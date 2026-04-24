import { cn } from "@/lib/cn";

type Props = {
  intensity?: "subtle" | "medium" | "heavy";
  blend?: "multiply" | "overlay";
  className?: string;
};

export function GrainOverlay({
  intensity = "subtle",
  blend = "multiply",
  className,
}: Props) {
  const opacity = intensity === "subtle" ? 0.045 : intensity === "medium" ? 0.075 : 0.11;
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      style={{
        mixBlendMode: blend,
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
