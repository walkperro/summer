"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ScrollReveal } from "@/components/summer/ScrollReveal";
import { inquiryOptions } from "@/components/summer/site-data";
import type { SummerPublicSection } from "@/lib/summer/site-content";

type InquiryOption = (typeof inquiryOptions)[number];

type FormState = {
  name: string;
  email: string;
  inquiryType: InquiryOption;
  phone: string;
  instagramHandle: string;
  location: string;
  goals: string;
  details: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  inquiryType: "Private Training",
  phone: "",
  instagramHandle: "",
  location: "",
  goals: "",
  details: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
};

export function ContactCta({
  section,
  contactEmail,
  instagramUrl,
}: {
  section: SummerPublicSection;
  contactEmail: string | null;
  instagramUrl: string | null;
}) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setFormState((current) => ({
      ...current,
      utmSource: searchParams.get("utm_source") || "",
      utmMedium: searchParams.get("utm_medium") || "",
      utmCampaign: searchParams.get("utm_campaign") || "",
    }));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType: formState.inquiryType,
          fullName: formState.name,
          email: formState.email,
          phone: formState.phone,
          instagramHandle: formState.instagramHandle,
          location: formState.location,
          goals: formState.goals,
          message: formState.details,
          source: "homepage_contact_cta",
          utmSource: formState.utmSource,
          utmMedium: formState.utmMedium,
          utmCampaign: formState.utmCampaign,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit inquiry right now.");
      }

      setFormState(initialState);
      setSuccess(true);
      setStatusMessage("Inquiry received. Summer will follow up with the best next step.");
    } catch {
      setStatusMessage(
        contactEmail
          ? `Inquiry intake is temporarily unavailable. Please email ${contactEmail}.`
          : "Inquiry intake is temporarily unavailable. Please try again shortly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const availabilityNote =
    typeof section.body.availability_note === "string"
      ? section.body.availability_note
      : "Private training remains intentionally limited. Brand, coaching, and general inquiries are reviewed with equal care.";
  const locationSignature =
    typeof section.body.location_signature === "string"
      ? section.body.location_signature
      : "Los Angeles · Playa Del Rey · Manhattan Beach";

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[color:var(--bronze-300)] bg-[color:var(--paper-200)]"
    >
      <Container size="xl" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          <ScrollReveal className="lg:col-span-5">
            <figure className="relative aspect-[4/5] overflow-hidden bg-[color:var(--paper-300)] lg:aspect-auto lg:h-full lg:min-h-[48rem]">
              <Image
                src="/images/summer/contact/summer_contact.jpg"
                alt="Summer Loffler seated in a calm interior, ready for inquiries about private training or bookings in Los Angeles."
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[54%_28%] grayscale-[8%] hero-ken-burns"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.5)_100%)]" />
              <figcaption className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <Eyebrow variant="mono" tone="light">
                  Availability
                </Eyebrow>
                <p className="mt-4 max-w-sm font-editorial-italic text-lg leading-[1.4] text-white/92 sm:text-xl">
                  {availabilityNote}
                </p>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="lg:col-span-7">
            <div className="relative flex h-full flex-col border border-[color:var(--bronze-300)] bg-[color:var(--paper-50)] p-7 sm:p-10 md:p-12">
              <div className="flex items-center gap-3">
                <span className="font-mono-editorial text-[11px] uppercase tracking-[0.28em] text-[color:var(--bronze-600)]">
                  § VIII
                </span>
                <Eyebrow variant="mono" tone="bronze">
                  {section.eyebrow}
                </Eyebrow>
              </div>
              <h2 className="font-editorial mt-5 text-balance text-5xl leading-[0.95] font-medium tracking-[-0.035em] text-[color:var(--ink-900)] md:text-[4.25rem]">
                {section.heading}
              </h2>
              <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-[color:var(--ink-500)]">
                {section.subheading}
              </p>

              {(contactEmail || instagramUrl) && (
                <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[color:var(--ink-500)]">
                  {contactEmail && (
                    <a href={`mailto:${contactEmail}`} className="accent-underline">
                      {contactEmail}
                    </a>
                  )}
                  {instagramUrl && (
                    <a href={instagramUrl} target="_blank" rel="noreferrer" className="accent-underline">
                      Instagram ↗
                    </a>
                  )}
                </div>
              )}
              <p className="mt-4 font-mono-editorial text-[10.5px] uppercase tracking-[0.3em] text-[color:var(--ink-400)]">
                {locationSignature}
              </p>

              <form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Name"
                    required
                    autoComplete="name"
                    value={formState.name}
                    onChange={(e) => setFormState((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((c) => ({ ...c, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Input
                    label="Phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState((c) => ({ ...c, phone: e.target.value }))}
                    placeholder="Optional"
                  />
                  <Input
                    label="Instagram"
                    value={formState.instagramHandle}
                    onChange={(e) =>
                      setFormState((c) => ({ ...c, instagramHandle: e.target.value }))
                    }
                    placeholder="@handle"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  <Select
                    label="Inquiry type"
                    value={formState.inquiryType}
                    onChange={(e) =>
                      setFormState((c) => ({
                        ...c,
                        inquiryType: e.target.value as InquiryOption,
                      }))
                    }
                  >
                    {inquiryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Location / Time zone"
                    value={formState.location}
                    onChange={(e) => setFormState((c) => ({ ...c, location: e.target.value }))}
                    placeholder="City, region, or time zone"
                  />
                </div>

                <Textarea
                  label="Goals"
                  rows={3}
                  value={formState.goals}
                  onChange={(e) => setFormState((c) => ({ ...c, goals: e.target.value }))}
                  placeholder="Optional training goals or campaign context."
                />

                <Textarea
                  label="What are you looking for?"
                  rows={6}
                  required
                  value={formState.details}
                  onChange={(e) => setFormState((c) => ({ ...c, details: e.target.value }))}
                  placeholder="Share your goals, preferred timeline, or the project you have in mind."
                />

                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button type="submit" variant="primary" loading={submitting}>
                    {submitting ? "Sending" : "Send Inquiry"}
                  </Button>
                  <Button href="#portfolio" variant="secondary">
                    View Portfolio
                  </Button>
                </div>

                {statusMessage && (
                  <p
                    aria-live="polite"
                    className={`font-editorial-italic text-[15px] leading-[1.6] ${
                      success ? "text-[color:var(--success-700)]" : "text-[color:var(--danger-700)]"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </form>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
