"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { EmailCaptureDialog } from "@/components/ui/EmailCaptureDialog";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "link";

type Props = {
  endpoint: "/api/checkout/subscribe" | "/api/checkout/product";
  payload: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  emailPrompt?: boolean;
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
  const [emailOpen, setEmailOpen] = useState(false);

  async function startCheckout(email?: string) {
    setError(null);
    setLoading(true);
    try {
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

  function onClick() {
    if (emailPrompt) {
      setEmailOpen(true);
    } else {
      void startCheckout();
    }
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", variant === "link" ? "" : "w-full")}>
      <Button
        type="button"
        onClick={onClick}
        loading={loading}
        variant={variant}
        fullWidth={variant !== "link"}
        className={className}
      >
        {loading ? "Opening checkout…" : children}
      </Button>
      {error && (
        <p className="font-editorial-italic text-[13px] text-[color:var(--danger-700)]">{error}</p>
      )}
      {emailPrompt && (
        <EmailCaptureDialog
          open={emailOpen}
          busy={loading}
          onClose={() => setEmailOpen(false)}
          onSubmit={async (email) => {
            setEmailOpen(false);
            await startCheckout(email.toLowerCase());
          }}
        />
      )}
    </div>
  );
}
