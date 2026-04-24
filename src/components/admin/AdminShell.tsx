"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminLogoutAction } from "@/server/summer/admin-actions";

const NAV_SECTIONS: ReadonlyArray<{
  label: string;
  items: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    label: "Sell & serve",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/clients", label: "Clients" },
      { href: "/admin/inquiries", label: "Inquiries" },
      { href: "/admin/subscriptions", label: "Subscriptions" },
      { href: "/admin/revenue", label: "Revenue" },
    ],
  },
  {
    label: "Programs",
    items: [
      { href: "/admin/classes", label: "Classes" },
      { href: "/admin/plans", label: "Guides & Meal Plans" },
      { href: "/admin/testimonials", label: "Testimonials" },
    ],
  },
  {
    label: "Brand",
    items: [
      { href: "/admin/content", label: "Content" },
      { href: "/admin/offers", label: "Ways to Work Together" },
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/gallery", label: "Gallery" },
      { href: "/admin/media", label: "Media" },
      { href: "/admin/image-studio", label: "Image Studio" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

export function AdminShell({
  children,
  adminEmail,
}: {
  children: React.ReactNode;
  adminEmail: string;
}) {
  const currentPath = usePathname();

  return (
    <div className="min-h-screen bg-[#f6f1ea] text-[#181512]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-black/8 bg-[#f2ebe2] px-5 py-6 lg:px-6 lg:py-8">
          <div className="sticky top-0">
            <div className="border-b border-black/8 pb-5">
              <p className="font-editorial text-4xl leading-none tracking-[0.04em]">Summer Loffler</p>
              <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[#7a6f67]">Admin v1</p>
              <p className="mt-4 text-sm text-[#5f5650]">Signed in as {adminEmail}</p>
            </div>

            <nav className="mt-6 space-y-6">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label}>
                  <p className="px-2 text-[10px] uppercase tracking-[0.28em] text-[#a8896b]">{section.label}</p>
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => {
                      const active =
                        currentPath === item.href ||
                        (item.href !== "/admin" && currentPath?.startsWith(`${item.href}/`));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between px-4 py-3 text-sm transition ${
                            active ? "bg-[#191512] text-white" : "text-[#2f2823] hover:bg-white/60"
                          }`}
                        >
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <form action={adminLogoutAction} className="mt-8">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center border border-black/12 bg-white px-5 text-sm font-medium text-[#181512] transition hover:bg-[#efe7dd]"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
