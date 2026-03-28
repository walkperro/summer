export function MobileCtaBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-3 border border-black/10 bg-[rgba(251,247,242,0.92)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-md">
        <a
          href="#contact"
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-[#1d1814] bg-[#191512] px-4 text-sm font-medium tracking-[0.03em] text-white transition hover:bg-[#2a241f]"
        >
          Apply for Training
        </a>
        <a
          href="#portfolio"
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-black/12 bg-white px-4 text-sm font-medium tracking-[0.03em] text-[#181512] transition hover:bg-[#f2ece4]"
        >
          View Portfolio
        </a>
      </div>
    </div>
  );
}
