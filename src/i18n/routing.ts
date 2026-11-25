import { defineRouting } from 'next-intl/routing';

/** English at /, Arabic at /ar, Urdu at /ur (each indexable, linked with hreflang). */
export const routing = defineRouting({
  locales: ['en', 'ar', 'ur'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
export const RTL: readonly Locale[] = ['ar', 'ur'];
