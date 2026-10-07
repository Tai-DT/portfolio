import type { Dictionary, Locale } from './types';
import en from './en';
import vi from './vi';
import jp from './jp';

export const LOCALES: Locale[] = ['en', 'vi', 'jp'];
export const DEFAULT_LOCALE: Locale = 'en';

/** BCP-47 tag for <html lang> and hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  vi: 'vi',
  jp: 'ja',
};

const DICTS: Record<Locale, Dictionary> = { en, vi, jp };

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'vi' || value === 'jp';
}

export function getDict(locale: Locale): Dictionary {
  return DICTS[locale] ?? en;
}

/** Picks a locale from an Accept-Language header. */
export function negotiateLocale(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const lower = header.toLowerCase();
  if (lower.includes('ja')) return 'jp';
  if (lower.includes('vi')) return 'vi';
  return DEFAULT_LOCALE;
}
