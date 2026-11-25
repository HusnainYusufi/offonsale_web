import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

const UPDATED = new Date('2026-11-25');

export async function generateMetadata(props: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale: locale as Locale, path: '/privacy', title: t('privacyTitle'), description: t('homeDescription') });
}

export default async function Page(props: PageProps<'/[locale]/privacy'>) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const [t, meta] = await Promise.all([getTranslations('legal'), getTranslations('meta')]);
  const sections = t.raw('privacy') as { h: string; p: string }[];
  return (
    <article className="wrap grid max-w-[48rem] gap-8 pb-28 pt-40">
      <h1 className="text-display">{meta('privacyTitle')}</h1>
      <p className="text-ink-3">{t('updated', { date: new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(UPDATED) })}</p>
      {sections.map((s) => (
        <section key={s.h} className="grid gap-2">
          <h2 className="text-title">{s.h}</h2>
          <p className="text-ink-2">{s.p}</p>
        </section>
      ))}
    </article>
  );
}
