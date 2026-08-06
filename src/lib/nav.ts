import { Locale, localizePath } from "@/lib/i18n";
import { Dictionary } from "@/lib/i18n-dictionaries";

export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
  active?: boolean;
};

export function buildNav(dict: Dictionary, locale: Locale): NavItem[] {
  return [
    { label: dict.nav.home, href: localizePath("/", locale) },
    { label: dict.nav.allProducts, href: localizePath("/products", locale) },
    {
      label: dict.nav.figures,
      children: [
        {
          label: dict.nav.animeFigure,
          href: localizePath("/category/anime-figure", locale),
        },
        {
          label: dict.nav.gamingFigure,
          href: localizePath("/category/gaming-figure", locale),
        },
        {
          label: dict.nav.moviesSeries,
          href: localizePath("/category/movies-series", locale),
        },
        {
          label: dict.nav.disneyPixar,
          href: localizePath("/category/disney-pixar", locale),
        },
      ],
    },
    {
      label: dict.nav.discounts,
      href: localizePath("/products?discount=1", locale),
    },
    { label: dict.nav.blog, href: localizePath("/blog", locale) },
    { label: dict.nav.contact, href: localizePath("/contact", locale) },
  ];
}
