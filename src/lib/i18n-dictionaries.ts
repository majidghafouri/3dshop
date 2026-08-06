import { fa } from "./dictionaries/fa";
import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";
import { Locale, defaultLocale } from "./i18n";

const dictionaries: Record<Locale, typeof fa> = { fa, en, ar };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export function getDictionaryForLocale(locale: string | undefined): typeof fa {
  return dictionaries[(locale as Locale) || defaultLocale] || dictionaries[defaultLocale];
}

export type Dictionary = typeof fa;
