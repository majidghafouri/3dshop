import type { Metadata } from "next";
import { cookies } from "next/headers";
import "@/app/globals.css";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "@fontsource/vazirmatn/900.css";
import { isLocale, getDir } from "@/lib/i18n";
import { getSiteTheme, buildThemeStyle, DEFAULT_PALETTE } from "@/lib/siteTheme";

export const metadata: Metadata = {
  title: {
    default: "فیگرفورج | خرید فیگور و اکشن فیگور اورجینال",
    template: "%s | فیگرفورج",
  },
  description:
    "فیگرفورج؛ فروشگاه تخصصی فیگور و اکشن فیگور. خرید آنلاین فیگور انیمه، گیمینگ، سینمایی و دیزنی با ارسال سریع.",
  icons: { icon: "/favicon.ico" },
};

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

  return (
    <html lang={resolved === "fa" ? "fa-IR" : resolved} dir={dir}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("figureforge-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: paletteCss }} />
      </head>
      <body className="antialiased bg-[var(--bg)]" style={{ paddingTop: "76px" }}>
        {children}
      </body>
    </html>
  );
}
