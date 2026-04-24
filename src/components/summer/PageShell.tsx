"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter flex min-h-full flex-col">
      {children}
    </div>
  );
}
