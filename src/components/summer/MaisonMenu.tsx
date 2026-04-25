"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/cn";

type MenuLink = { href: string; label: string; number: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: MenuLink[];
  instagramUrl?: string | null;
  clientHref?: string;
};

export function MaisonMenu({
  open,
  onClose,
  links,
  instagramUrl,
  clientHref = "/client/login",
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300 md:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        className="absolute inset-0 bg-[color:var(--paper-50)]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 flex h-full w-full flex-col px-6 pb-8 pt-24",
          "transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-y-0" : "-translate-y-3",
        )}
        style={{
          paddingTop: "calc(5.5rem + env(safe-area-inset-top))",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
        }}
      >
        <nav className="flex flex-1 flex-col gap-0 overflow-y-auto">
          {links.map((link, i) => {
            const isActive =
              (link.href === "/" && pathname === "/") ||
              (link.href !== "/" && !link.href.startsWith("/#") && pathname?.startsWith(link.href));
            const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
              onClose();
              if (link.href === "/") {
                event.preventDefault();
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  router.push("/");
                }
              }
            };
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleClick}
                data-active={isActive ? "true" : undefined}
                className={cn(
                  "group flex items-baseline justify-between gap-4 border-b border-[color:var(--bronze-200)] py-5",
                  "transition",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{
                  transitionProperty: "transform, opacity",
                  transitionDuration: "420ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  transitionDelay: `${80 + i * 55}ms`,
                }}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                    {link.number}
                  </span>
                  <span
                    className={cn(
                      "font-editorial-italic text-5xl leading-[0.95] text-[color:var(--ink-900)] sm:text-6xl",
                      isActive && "text-[color:var(--bronze-700)]",
                    )}
                  >
                    {link.label}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="font-editorial text-2xl text-[color:var(--ink-300)] transition group-hover:text-[color:var(--bronze-600)]"
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 flex flex-col gap-5 border-t border-[color:var(--bronze-300)] pt-6">
          <div className="flex items-center justify-between">
            <Link
              href={clientHref}
              onClick={onClose}
              className="eyebrow eyebrow-bronze accent-underline"
            >
              Client sign-in
            </Link>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow eyebrow-mono accent-underline"
              >
                Instagram ↗
              </a>
            )}
          </div>
          <p className="font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-[color:var(--ink-400)]">
            Los Angeles · Playa Del Rey · Venice · MMXXVI
          </p>
        </div>
      </div>
    </div>
  );
}
