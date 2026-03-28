import type { Metadata } from "next";

import { requireSummerAdminSession } from "@/lib/summer/admin-auth";

export const metadata: Metadata = {
  title: "Review",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ReviewLayout({ children }: { children: React.ReactNode }) {
  await requireSummerAdminSession();

  return children;
}
