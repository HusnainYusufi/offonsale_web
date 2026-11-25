import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { localePath } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const PAGES = [
  { path: '/', priority: 1 },
  { path: '/pricing', priority: 0.9 },
  { path: '/features', priority: 0.8 },
  { path: '/start', priority: 0.8 },
  { path: '/about', priority: 0.6 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`])),
      },
    })),
  );
}
