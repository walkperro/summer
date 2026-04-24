"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "./SiteFooter";

const HIDDEN_PREFIXES = ["/admin"];

type Props = {
  instagramUrl?: string | null;
  contactEmail?: string | null;
};

export function FooterMount({ instagramUrl, contactEmail }: Props) {
  const pathname = usePathname() ?? "";
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  return <SiteFooter instagramUrl={instagramUrl} contactEmail={contactEmail} />;
}
