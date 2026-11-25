import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Bento } from '@/components/home/bento';
import { Cta } from '@/components/home/cta';
import { Steps } from '@/components/home/steps';
import { Story } from '@/components/home/story';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(props: PageProps<'/[locale]/features'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale: locale as Locale, path: '/features', title: t('featuresTitle'), description: t('featuresDescription') });
}

export default async function Features(props: PageProps<'/[locale]/features'>) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations('bento');
  return (
    <>
      <section className="wrap grid gap-5 pb-10 pt-40">
        <p className="eyebrow" data-reveal>{t('eyebrow')}</p>
        <h1 className="text-hero max-w-[14ch]" data-reveal>{t('title')}</h1>
      </section>
      <Bento />
      <Story />
      <Steps />
      <div className="pt-24">
        <Cta />
      </div>
    </>
  );
}
