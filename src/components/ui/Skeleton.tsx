import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  shape?: "line" | "block" | "circle";
};

export function Skeleton({ className, shape = "block" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block overflow-hidden",
        shape === "line" && "h-3 w-full rounded-sm",
        shape === "block" && "h-24 w-full rounded-md",
        shape === "circle" && "h-12 w-12 rounded-full",
        "bg-[color:var(--paper-200)]",
        "before:absolute before:inset-0 before:animate-[shimmer_1.8s_ease-in-out_infinite] before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.55)_50%,transparent_100%)]",
        className,
      )}
    />
  );
}
