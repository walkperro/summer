import { cn } from "@/lib/cn";

type Props = {
  tone?: "ink" | "light";
  label?: string;
  className?: string;
};

export function ScrollCue({ tone = "ink", label = "scroll", className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-col items-center gap-3",
        tone === "ink" ? "text-[color:var(--ink-400)]" : "text-white/70",
        className,
      )}
    >
      <span className="font-editorial-italic text-[11px] tracking-[0.2em]">{label}</span>
      <span
        className={cn(
          "relative h-10 w-px overflow-hidden",
          tone === "ink" ? "bg-[color:var(--bronze-300)]" : "bg-white/30",
        )}
      >
        <span
          className={cn(
            "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 animate-[scroll-cue_2.4s_ease-in-out_infinite]",
            tone === "ink" ? "bg-[color:var(--bronze-600)]" : "bg-white/90",
          )}
        />
      </span>
    </div>
  );
}
