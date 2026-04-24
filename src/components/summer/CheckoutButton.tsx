"use client";

import { useState } from "react";

type Props = {
  endpoint: "/api/checkout/subscribe" | "/api/checkout/product";
  payload: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "link";
  emailPrompt?: boolean;
};

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium uppercase tracking-[0.18em] transition";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "min-h-12 border border-[#1d1814] bg-[#191512] px-6 text-white hover:bg-[#2a241f]",
  secondary:
    "min-h-12 border border-black/18 bg-transparent px-6 text-[#181512] hover:border-[#a8896b] hover:text-[#a8896b]",
  link: "text-[#181512] accent-underline",
};

export function CheckoutButton({
  endpoint,
  payload,
  children,
  className,
  variant = "primary",
  emailPrompt = true,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setError(null);
    setLoading(true);
    try {
      let email: string | undefined;
      if (emailPrompt) {
        const input = window.prompt("Enter the email to attach this order to:");
        if (!input) {
          setLoading(false);
          return;
        }
        email = input.trim().toLowerCase();
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, email }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Checkout could not be started.");
        setLoading(false);
        return;
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={`${base} ${variants[variant]} ${className || ""} ${loading ? "opacity-60" : ""}`}
      >
        {loading ? "Opening checkout…" : children}
      </button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
