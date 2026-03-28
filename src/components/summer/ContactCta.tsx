"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      : "Los Angeles / Playa Del Rey / Manhattan Beach";

  return (
    <section id="contact" className="border-t border-black/6 bg-[#efe7dd] px-6 py-20 sm:py-24 md:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
        <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/8 bg-[#ddd3c6] shadow-[0_30px_80px_rgba(0,0,0,0.08)] lg:aspect-auto lg:min-h-[44rem]">
          <Image
            src="/images/summer/contact/summer_contact.jpg"
            alt="Summer Loffler seated in a calm interior, ready for inquiries about private training or bookings in Los Angeles."
            fill
            sizes="(min-width: 1024px) 36vw, 100vw"
            className="object-cover object-[54%_28%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.26))]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-sm border border-white/24 bg-black/24 p-5 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/68">Availability</p>
              <p className="mt-3 text-sm leading-6 text-white/82">{availabilityNote}</p>
            </div>
          </div>
        </figure>

        <div className="border border-black/8 bg-[#fbf7f2] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#7a6f67]">{section.eyebrow}</p>
          <h2 className="font-editorial mt-4 text-balance text-4xl leading-none tracking-[-0.03em] text-[#181512] sm:text-5xl">
            {section.heading}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#5f5650]">{section.subheading}</p>
          {contactEmail || instagramUrl ? (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#5f5650]">
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} className="underline-offset-4 hover:underline">
                  {contactEmail}
                </a>
              ) : null}
              {instagramUrl ? (
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                  Instagram
                </a>
              ) : null}
            </div>
          ) : null}
          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[#8a7d72]">{locationSignature}</p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Name</span>
                <input
                  required
                  value={formState.name}
                  onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                  className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm text-[#181512] outline-none transition placeholder:text-[#91857b] focus:border-black/35"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Email</span>
                <input
                  required
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                  className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm text-[#181512] outline-none transition placeholder:text-[#91857b] focus:border-black/35"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Phone</span>
                <input
                  value={formState.phone}
                  onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))}
                  className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm text-[#181512] outline-none transition placeholder:text-[#91857b] focus:border-black/35"
                  placeholder="Optional"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Instagram</span>
                <input
                  value={formState.instagramHandle}
                  onChange={(event) => setFormState((current) => ({ ...current, instagramHandle: event.target.value }))}
                  className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm text-[#181512] outline-none transition placeholder:text-[#91857b] focus:border-black/35"
                  placeholder="@handle"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Inquiry Type</span>
                <select
                  value={formState.inquiryType}
                  onChange={(event) => setFormState((current) => ({ ...current, inquiryType: event.target.value as InquiryOption }))}
                  className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm text-[#181512] outline-none transition focus:border-black/35"
                >
                  {inquiryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Location / Time Zone</span>
                <input
                  value={formState.location}
                  onChange={(event) => setFormState((current) => ({ ...current, location: event.target.value }))}
                  className="min-h-12 w-full border border-black/10 bg-white px-4 text-sm text-[#181512] outline-none transition placeholder:text-[#91857b] focus:border-black/35"
                  placeholder="City, region, or time zone"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">Goals</span>
              <textarea
                rows={3}
                value={formState.goals}
                onChange={(event) => setFormState((current) => ({ ...current, goals: event.target.value }))}
                className="w-full border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-[#181512] outline-none transition placeholder:text-[#91857b] focus:border-black/35"
                placeholder="Optional training goals or campaign context."
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-[#7a6f67]">What are you looking for?</span>
              <textarea
                required
                rows={6}
                value={formState.details}
                onChange={(event) => setFormState((current) => ({ ...current, details: event.target.value }))}
                className="w-full border border-black/10 bg-white px-4 py-3 text-sm leading-6 text-[#181512] outline-none transition placeholder:text-[#91857b] focus:border-black/35"
                placeholder="Share your goals, preferred timeline, or the project you have in mind."
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 items-center justify-center border border-[#1d1814] bg-[#191512] px-6 text-sm font-medium tracking-[0.03em] text-white transition hover:bg-[#2a241f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending Inquiry..." : "Send Inquiry"}
              </button>
              <a
                href="#portfolio"
                className="inline-flex min-h-12 items-center justify-center border border-black/12 bg-white px-6 text-sm font-medium tracking-[0.03em] text-[#181512] transition hover:bg-[#f2ece4]"
              >
                View Portfolio
              </a>
            </div>

            {statusMessage ? (
              <p aria-live="polite" className="text-sm leading-6 text-[#5f5650]">
                {statusMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
