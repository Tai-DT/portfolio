import en from './en';
import vi from './vi';
import jp from './jp';
import type { Dictionary, Locale } from './types';

export const LOCALES: readonly Locale[] = ['en', 'vi', 'jp'];
export const DEFAULT_LOCALE: Locale = 'en';

export const dictionaries: Record<Locale, Dictionary> = { en, vi, jp };

export const DATE_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  vi: 'vi-VN',
  jp: 'ja-JP',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Detect the best locale from the browser, falling back to DEFAULT_LOCALE. */
export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('vi')) return 'vi';
  if (lang.startsWith('ja')) return 'jp';
  return DEFAULT_LOCALE;
}

/** Interpolate `{var}` placeholders in a message template. */
export function formatMessage(template: string, vars: Record<string, string> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export type { Dictionary, Locale };
export type { ExperienceItem, Pillar } from './types';
