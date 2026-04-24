import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

type Props = {
  instagramUrl?: string | null;
  contactEmail?: string | null;
  tagline?: string;
};

const WORK_LINKS = [
  { href: "/#contact", label: "Private Training" },
  { href: "/plans", label: "Online Coaching" },
  { href: "/classes", label: "Classes" },
  { href: "/plans", label: "Guides & Meal Plans" },
  { href: "/#contact", label: "Brand Bookings" },
];

const STUDIO_LINKS = [
  { href: "/about", label: "About Summer" },
  { href: "/#contact", label: "Inquire" },
  { href: "/client/login", label: "Client Sign-in" },
  { href: "/client/signup", label: "Create an account" },
];

function LinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <Eyebrow variant="mono" tone="bronze">
        {heading}
      </Eyebrow>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={`${heading}-${link.label}`}>
            <Link
              href={link.href}
              className="accent-underline inline-flex text-[15px] text-[color:var(--ink-600)] transition hover:text-[color:var(--ink-900)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({
  instagramUrl,
  contactEmail,
  tagline = "Refined fitness · Private training · Los Angeles",
}: Props) {
  const year = new Date().getFullYear();

  const quietLinks = [
    { href: "/legal/privacy", label: "Privacy" },
    { href: "/legal/terms", label: "Terms" },
  ];

  if (contactEmail) {
    quietLinks.push({ href: `mailto:${contactEmail}`, label: contactEmail });
  }

  return (
    <footer className="relative border-t border-[color:var(--bronze-300)] bg-[color:var(--paper-100)] text-[color:var(--ink-900)]">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container size="xl" className="relative z-[2] py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              className="font-editorial text-3xl leading-[0.95] tracking-[0.01em] text-[color:var(--ink-900)] md:text-4xl"
            >
              Summer&nbsp;Loffler
            </Link>
            <p className="max-w-[32ch] text-sm leading-relaxed text-[color:var(--ink-500)]">
              {tagline}
            </p>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="accent-underline inline-flex self-start font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-700)]"
              >
                Instagram ↗
              </a>
            )}
          </div>

          <LinkColumn heading="Work" links={WORK_LINKS} />
          <LinkColumn heading="Studio" links={STUDIO_LINKS} />
          <LinkColumn heading="Quiet" links={quietLinks} />
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "mt-14 overflow-hidden md:mt-20",
            "relative",
          )}
        >
          <div className="hairline-solid w-full" />
          <div className="masthead mt-6 whitespace-nowrap text-[clamp(3.5rem,14vw,9rem)] leading-[0.8]">
            Summer Loffler&nbsp;&nbsp;·&nbsp;&nbsp;Summer Loffler&nbsp;&nbsp;·&nbsp;&nbsp;Summer&nbsp;Loffler
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[color:var(--bronze-300)] pt-6 text-[12px] uppercase tracking-[0.28em] text-[color:var(--ink-400)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Summer Loffler · All rights reserved</span>
          <span>Playa Del Rey · Manhattan Beach · Venice</span>
        </div>
      </Container>
    </footer>
  );
}
