import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL } from './site';

/** A page's address in a language (English has no prefix). */
export function localePath(locale: string, path: string): string {
  const clean = path === '/' ? '' : path;
  return locale === routing.defaultLocale ? clean || '/' : `/${locale}${clean}`;
}

/** Title, description, canonical, hreflang alternates, Open Graph and Twitter for a page. */
export function pageMetadata(input: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${SITE_URL}${localePath(input.locale, input.path)}`;
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}${localePath(l, input.path)}`]),
  );
  languages['x-default'] = `${SITE_URL}${localePath(routing.defaultLocale, input.path)}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website',
      url,
      title: input.title,
      description: input.description,
      siteName: 'OffOnSale',
      locale: { en: 'en_PK', ar: 'ar_SA', ur: 'ur_PK' }[input.locale],
    },
    twitter: { card: 'summary_large_image', title: input.title, description: input.description },
  };
}

/** JSON-LD as a script tag body (escaped so it can never close the tag). */
export function jsonLd(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
