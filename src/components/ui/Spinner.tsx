import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-[1.5px] border-current border-t-transparent",
        "h-3.5 w-3.5",
        className,
      )}
    />
  );
}
