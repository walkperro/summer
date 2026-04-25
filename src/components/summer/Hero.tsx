"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

import { ScrollCue } from "./ScrollCue";

type Slide = {
  id: string;
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  desktopPosition: string;
  mobilePosition: string;
  /** Optional CSS scale class applied to the mobile <Image>, e.g. "scale-110". */
  mobileScale?: string;
};

const SLIDES: Slide[] = [
  {
    id: "hero-action",
    desktopSrc: "/images/summer/refined/summer-hero-action-desktop.png",
    mobileSrc: "/images/summer/refined/summer-hero-action-mobile.png",
    alt: "Summer Loffler in a cinematic editorial portrait.",
    desktopPosition: "55% 30%",
    mobilePosition: "0% 30%",
    mobileScale: "scale-[1.1]",
  },
  {
    id: "hero-bw-2",
    desktopSrc: "/images/summer/refined/summer-hero-bw-2-desktop.png",
    mobileSrc: "/images/summer/hero/summer_hero_bw_2_mobile.jpg",
    alt: "Black and white profile of Summer Loffler in a sculptural training space.",
    desktopPosition: "62% 38%",
    mobilePosition: "56% 35%",
  },
  {
    id: "hero-bw-1",
    desktopSrc: "/images/summer/hero/summer_hero_bw_1_desktop.jpg",
    mobileSrc: "/images/summer/hero/summer_hero_bw_1_mobile.png",
    alt: "Black and white portrait of Summer Loffler with a direct, composed expression.",
    desktopPosition: "70% 35%",
    mobilePosition: "50% 28%",
  },
];

type HeroProps = {
  eyebrow?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const VOLUME_LINES = [
  "Volume III · Spring · MMXXVI",
  "Los Angeles · Private training",
  "By invitation · Selectively accepting",
];

const SLIDE_INTERVAL_MS = 8400;

export function Hero({
  eyebrow = "Los Angeles · Private Training · Est. MMXVIII",
  primaryCtaLabel = "Apply for Private Training",
  primaryCtaHref = "#contact",
  secondaryCtaLabel = "View the lookbook",
  secondaryCtaHref = "#portfolio",
}: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [volumeIdx, setVolumeIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || SLIDES.length <= 1) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [reducedMotion, paused]);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(
      () => setVolumeIdx((i) => (i + 1) % VOLUME_LINES.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[color:var(--paper-100)] text-[color:var(--ink-900)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Image stack — full-bleed on mobile, right 62% on desktop */}
      <div
        className="pointer-events-none absolute inset-0 md:left-[38%]"
        aria-hidden="true"
      >
        <div className="relative h-full w-full overflow-hidden">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={slide.id}
                className={cn(
                  // Mobile: pure opacity fade at 3200ms (very soft).
                  // Desktop: opacity + soft blur at 2400ms.
                  "absolute inset-0 transition-[opacity,filter] duration-[3200ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:duration-[2400ms]",
                  isActive
                    ? "opacity-100 blur-0"
                    : "opacity-0 blur-0 md:blur-[3px]",
                  "motion-reduce:transition-none",
                )}
              >
                <Image
                  src={slide.desktopSrc}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 768px) 62vw, 100vw"
                  className="hidden object-cover md:block"
                  style={{ objectPosition: slide.desktopPosition }}
                />
                <Image
                  src={slide.mobileSrc}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className={cn(
                    "object-cover md:hidden",
                    slide.mobileScale,
                  )}
                  style={{ objectPosition: slide.mobilePosition }}
                />
              </div>
            );
          })}
          {/* Desktop edge feather toward the text column */}
          <div
            className="absolute inset-0 hidden md:block md:bg-[linear-gradient(270deg,transparent_0%,transparent_45%,rgba(246,241,234,0.2)_75%,var(--paper-100)_100%)]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Mobile-only paper wash behind the text — light highlight for legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[60svh] md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(246,241,234,0) 0%, rgba(246,241,234,0.35) 30%, rgba(246,241,234,0.82) 58%, rgba(246,241,234,0.97) 80%, var(--paper-100) 100%)",
        }}
      />

      {/* Grain — desktop only, mobile already has the paper wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          opacity: 0.05,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Composition */}
      <Container
        size="xl"
        className="relative z-[2] flex min-h-[100svh] flex-col"
      >
        <div className="grid flex-1 grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          {/* Title column — bottom-aligned on mobile so it sits over the paper wash */}
          <div
            className="flex flex-col justify-end pb-10 pt-28 md:col-span-7 md:pb-16 md:pt-36 lg:col-span-6"
            style={{ paddingTop: "calc(7rem + env(safe-area-inset-top))" }}
          >
            <Eyebrow variant="mono" tone="bronze" className="mb-6 md:mb-8">
              {eyebrow}
            </Eyebrow>

            <h1
              className="font-editorial text-balance text-[color:var(--ink-950)] mask-wipe-in"
              style={{
                fontSize: "clamp(2.8rem, 10.5vw, 8.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.045em",
                fontWeight: 500,
              }}
            >
              <span className="block">Your summer body,</span>
              <span
                className="block font-editorial-italic text-[color:var(--ink-600)]"
                style={{ fontSize: "0.68em", lineHeight: 1 }}
              >
                in every
              </span>
              <span className="block">
                <span className="accent-underline-static text-[color:var(--ink-950)]">
                  season.
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-[48ch] text-base leading-7 text-[color:var(--ink-500)] sm:text-lg sm:leading-8">
              Private training, online coaching, and glute-specific programming — built for a
              body you keep.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={primaryCtaHref}
                className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)] bg-[color:var(--ink-900)] px-6 text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[color:var(--ink-700)]"
              >
                {primaryCtaLabel}
              </a>
              <a
                href={secondaryCtaHref}
                className="press-effect focus-ring inline-flex min-h-12 items-center justify-center border border-[color:var(--ink-900)]/22 bg-transparent px-6 text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--ink-900)] transition hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]"
              >
                {secondaryCtaLabel}
              </a>
            </div>
          </div>

          {/* Right ornament column (desktop only) */}
          <div className="hidden md:col-span-5 md:col-start-8 md:flex md:flex-col md:items-end md:justify-end md:pb-16 lg:col-span-5">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-px">
                <div className="absolute inset-0 hairline-v" aria-hidden="true" />
              </div>
              <span
                key={VOLUME_LINES[volumeIdx]}
                className="mask-wipe-in font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--ink-400)]"
                aria-live="polite"
              >
                {VOLUME_LINES[volumeIdx]}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row — scroll cue + dot indicators */}
        <div className="relative z-[2] flex items-end justify-between gap-6 pb-10 pt-4 md:pb-14">
          <ScrollCue tone="ink" />
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Hero slides"
          >
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show slide ${idx + 1}`}
                  aria-pressed={isActive}
                  className={cn(
                    "relative inline-flex h-8 items-center justify-center px-1 focus-ring",
                    "touch-manipulation",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-[2px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive
                        ? "w-10 bg-[color:var(--bronze-500)]"
                        : "w-6 bg-[color:var(--ink-900)]/25 group-hover:bg-[color:var(--ink-900)]/45",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
