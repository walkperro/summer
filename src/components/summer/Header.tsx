"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/classes", label: "Classes" },
  { href: "/plans", label: "Plans" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Inquire" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-[rgba(246,241,234,0.92)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-editorial text-xl leading-none tracking-[0.02em] text-[#181512] md:text-2xl"
        >
          Summer&nbsp;Loffler
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              (link.href === "/" && pathname === "/") ||
              (link.href !== "/" && !link.href.startsWith("/#") && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive ? "true" : undefined}
                className="accent-underline text-[11px] uppercase tracking-[0.28em] text-[#181512] transition hover:text-[#a8896b]"
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/client/login"
            className="inline-flex min-h-10 items-center justify-center border border-black/18 px-4 text-[11px] uppercase tracking-[0.28em] transition hover:border-[#a8896b] hover:text-[#a8896b]"
          >
            Client sign-in
          </Link>
        </nav>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex h-8 w-8 items-center justify-center border border-black/20 text-sm">
            {open ? "×" : "≡"}
          </span>
        </button>
      </div>
      {open ? (
        <div className="md:hidden">
          <nav className="flex flex-col gap-0 border-t border-black/8 bg-[#f6f1ea] px-6 pb-6 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-black/6 py-4 text-[12px] uppercase tracking-[0.28em] text-[#181512]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/client/login"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-11 items-center justify-center border border-black/18 text-[11px] uppercase tracking-[0.28em]"
            >
              Client sign-in
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
