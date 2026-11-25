import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/ui/header';
import { Reveals } from '@/components/motion/reveals';
import { SmoothScroll } from '@/components/motion/smooth-scroll';
import { RTL, routing } from '@/i18n/routing';
import { jsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import '../globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#f5f8fb',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'OffOnSale',
  icons: { icon: '/icon.svg' },
  robots: { index: true, follow: true },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: LayoutProps<'/[locale]'>) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'nav' });
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OffOnSale',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    areaServed: ['PK', 'SA', 'AE'],
  };

  return (
    <html
      lang={locale}
      dir={RTL.includes(locale) ? 'rtl' : 'ltr'}
      className={`${jakarta.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Animations hide content only once JavaScript runs (crawlers and no-JS see it all). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(org)} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          {t('skip')}
        </a>
        <NextIntlClientProvider>
          <SmoothScroll />
          <Reveals />
          <Header />
          <main id="main">{props.children as ReactNode}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
