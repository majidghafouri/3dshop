"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackClient } from "@/lib/client-analytics";

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/api")) return;
    trackClient("PAGE_VIEW", { path: pathname });
  }, [pathname]);

  return <>{children}</>;
}
