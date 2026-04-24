export function MobileCtaBar() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden"
      aria-hidden="false"
    >
      <div className="pointer-events-auto mx-auto max-w-md">
        <a
          href="#contact"
          className="press-effect focus-ring group relative flex h-12 w-full items-center justify-center gap-3 overflow-hidden border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] text-white shadow-[0_12px_40px_rgba(0,0,0,0.32)]"
        >
          <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em]">
            Apply for Training
          </span>
          <span
            aria-hidden="true"
            className="inline-block text-sm transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
      </div>
    </div>
  );
}
