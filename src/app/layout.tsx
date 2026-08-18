import { cookies } from "next/headers";
import "@/app/globals.css";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "@fontsource/vazirmatn/900.css";
import { isLocale, getDir, defaultLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import { getSiteTheme, buildThemeStyle, DEFAULT_PALETTE } from "@/lib/siteTheme";
import { buildMetadata, buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo";
import LocaleDirection from "@/components/LocaleDirection";

export async function generateMetadata() {
  const store = cookies();
  const locale = store.get("locale")?.value;
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const dict = getDictionary(resolved);
  return buildMetadata({ dict, locale: resolved });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = cookies();
  const locale = store.get("locale")?.value;
  const resolved = isLocale(locale) ? locale : "fa";
  const dir = getDir(resolved);
  const palette = (await getSiteTheme()) ?? DEFAULT_PALETTE;
  const paletteCss = buildThemeStyle(palette);
  const organizationJsonLd = buildOrganizationJsonLd();
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <html lang={resolved === "fa" ? "fa-IR" : resolved} dir={dir}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("figureforge-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: paletteCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
        />
      </head>
      <body className="antialiased bg-[var(--bg)]" style={{ paddingTop: "76px" }}>
        <LocaleDirection />
        {children}
      </body>
    </html>
  );
}
