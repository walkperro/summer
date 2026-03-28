"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { heroSlides as defaultHeroSlides } from "@/components/summer/site-data";

function parseObjectPosition(value: string) {
  const match = value.match(/^object-\[(.+)\]$/);
  return match ? match[1].replace(/_/g, " ") : undefined;
}

type HeroProps = {
  slides?: typeof defaultHeroSlides;
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export function Hero({
  slides = defaultHeroSlides,
  heading = "Private training with strength, discipline, and presence.",
  subheading = "A refined approach to coaching for clients who want serious guidance, polished presentation, and lasting results on and off camera.",
  primaryCtaLabel = "Apply for Private Training",
  primaryCtaHref = "#contact",
  secondaryCtaLabel = "View Portfolio",
  secondaryCtaHref = "#portfolio",
}: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(mediaQuery.matches);

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || slides.length <= 1) {
      return;
    }

    const rotation = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(rotation);
  }, [reducedMotion, slides]);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#151210] text-white">
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out motion-reduce:duration-0 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.desktopSrc}
                alt={slide.desktopAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hidden object-cover md:block"
                style={{ objectPosition: parseObjectPosition(slide.desktopPosition) }}
              />
              <Image
                src={slide.mobileSrc}
                alt={slide.mobileAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover md:hidden"
                style={{ objectPosition: parseObjectPosition(slide.mobilePosition) }}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,8,7,0.8)_0%,rgba(10,8,7,0.42)_42%,rgba(10,8,7,0.16)_78%,rgba(10,8,7,0.42)_100%)] md:bg-[linear-gradient(90deg,rgba(10,8,7,0.88)_0%,rgba(10,8,7,0.52)_38%,rgba(10,8,7,0.18)_72%,rgba(10,8,7,0.45)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.18)_55%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <header className="px-6 pt-6 md:px-10 md:pt-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-white/12 pb-4">
            <a href="#top" className="font-editorial text-3xl tracking-[0.08em] text-white">
              Summer Loffler
            </a>
            <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.28em] text-white/68 md:flex">
              <a href="#about" className="transition hover:text-white">
                About
              </a>
              <a href="#training" className="transition hover:text-white">
                Training
              </a>
              <a href="#portfolio" className="transition hover:text-white">
                Portfolio
              </a>
              <a href="#contact" className="transition hover:text-white">
                Inquire
              </a>
            </nav>
          </div>
        </header>

        <div id="top" className="mx-auto flex w-full max-w-7xl flex-1 items-end px-6 pb-14 pt-16 md:px-10 md:pb-16 md:pt-24">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.2fr)_220px] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/70">SUMMER LOFFLER / PRIVATE TRAINING / PORTFOLIO</p>
              <h1 className="font-editorial mt-6 text-balance text-[3.2rem] leading-[0.9] font-medium tracking-[-0.045em] text-white sm:text-[4.4rem] lg:text-[5.8rem]">
                {heading}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{subheading}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={primaryCtaHref}
                  className="inline-flex min-h-12 items-center justify-center border border-[#e7ddd1] bg-[#f4ece2] px-6 text-sm font-medium tracking-[0.03em] text-[#181512] transition hover:bg-white"
                >
                  {primaryCtaLabel}
                </a>
                <a
                  href={secondaryCtaHref}
                  className="inline-flex min-h-12 items-center justify-center border border-white/24 bg-white/8 px-6 text-sm font-medium tracking-[0.03em] text-white backdrop-blur-sm transition hover:bg-white/14"
                >
                  {secondaryCtaLabel}
                </a>
              </div>
            </div>

            <div className="flex items-end justify-between gap-6 lg:flex-col lg:items-start lg:justify-end">
              <div className="space-y-3 text-sm text-white/74">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/58">Los Angeles</p>
                <div className="space-y-2">
                  <p>Private training</p>
                  <p>Online coaching</p>
                  <p>Select editorial bookings</p>
                </div>
              </div>
              <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                {slides.map((slide, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 transition-all ${isActive ? "w-9 bg-white" : "w-2.5 bg-white/35 hover:bg-white/55"}`}
                      aria-label={`Show slide ${index + 1}`}
                      aria-pressed={isActive}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
