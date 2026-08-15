"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { getDir } from "@/lib/i18n";

export default function LocaleDirection() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const seg = pathname?.split("/")[1] ?? "";
    const locale = seg === "en" ? "en" : seg === "ar" ? "ar" : "fa";
    document.documentElement.dir = getDir(locale);
    document.documentElement.lang = locale === "fa" ? "fa-IR" : locale;
  }, [pathname]);

  return null;
}
