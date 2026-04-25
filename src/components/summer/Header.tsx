"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

import { MaisonMenu } from "./MaisonMenu";

const NAV_LINKS = [
  { href: "/", label: "Home", number: "01" },
  { href: "/classes", label: "Classes", number: "02" },
  { href: "/plans", label: "Plans", number: "03" },
  { href: "/about", label: "About", number: "04" },
  { href: "/#contact", label: "Inquire", number: "05" },
];

function Burger({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-11 w-11 items-center justify-center border border-[color:var(--ink-900)]/20 bg-transparent"
    >
      <span
        className={cn(
          "absolute left-1/2 h-px w-5 -translate-x-1/2 bg-[color:var(--ink-900)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[38%]",
        )}
      />
      <span
        className={cn(
          "absolute left-1/2 h-px w-5 -translate-x-1/2 bg-[color:var(--ink-900)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-[62%]",
        )}
      />
    </span>
  );
}

export function Header({ instagramUrl }: { instagramUrl?: string | null } = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleHomeClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    event.preventDefault();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-[rgba(246,241,234,0.92)] backdrop-blur-md border-b border-[color:var(--bronze-300)]/70"
            : "bg-transparent",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-[96rem] items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="group relative inline-flex items-baseline gap-1 font-editorial leading-none tracking-[0.01em] text-[color:var(--ink-900)]"
            aria-label="Summer Loffler — home"
          >
            <span className="text-[1.3rem] md:text-[1.55rem]">Summer&nbsp;Loffler</span>
            <span
              aria-hidden="true"
              className="inline-block h-[6px] w-[6px] translate-y-[-2px] rounded-full bg-[color:var(--bronze-500)] opacity-80 transition group-hover:opacity-100"
            />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                (link.href === "/" && pathname === "/") ||
                (link.href !== "/" &&
                  !link.href.startsWith("/#") &&
                  pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive ? "true" : undefined}
                  onClick={link.href === "/" ? handleHomeClick : undefined}
                  className={cn(
                    "accent-underline font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition",
                    isActive
                      ? "text-[color:var(--bronze-700)]"
                      : "text-[color:var(--ink-900)] hover:text-[color:var(--bronze-700)]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/client/login"
              className={cn(
                "inline-flex min-h-10 items-center justify-center border border-[color:var(--ink-900)]/22 px-4 font-mono-editorial text-[11px] uppercase tracking-[0.28em] transition",
                "hover:border-[color:var(--bronze-500)] hover:text-[color:var(--bronze-700)]",
              )}
            >
              Client sign-in
            </Link>
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden focus-ring"
            onClick={() => setOpen((v) => !v)}
          >
            <Burger open={open} />
          </button>
        </div>
      </header>

      <MaisonMenu
        open={open}
        onClose={() => setOpen(false)}
        links={NAV_LINKS}
        instagramUrl={instagramUrl}
      />
    </>
  );
}
