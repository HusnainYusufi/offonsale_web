import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Bento } from '@/components/home/bento';
import { Cta } from '@/components/home/cta';
import { Faq } from '@/components/home/faq';
import { Hero } from '@/components/home/hero';
import { Marquee } from '@/components/home/marquee';
import { PlanCards } from '@/components/home/plan-cards';
import { Steps } from '@/components/home/steps';
import { Story } from '@/components/home/story';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(props: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale: locale as Locale, path: '/', title: t('homeTitle'), description: t('homeDescription') });
}

export default async function Home(props: PageProps<'/[locale]'>) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');
  return (
    <>
      <Hero />
      <Marquee />
      <Story />
      <Bento />
      <Steps />
      <section className="wrap py-24 lg:py-36">
        <div className="grid gap-4 pb-14 text-center">
          <p className="eyebrow" data-reveal>{t('eyebrow')}</p>
          <h2 className="text-display mx-auto max-w-[16ch]" data-reveal>{t('title')}</h2>
          <p className="text-lead mx-auto max-w-[40rem] text-ink-2" data-reveal>{t('lead')}</p>
        </div>
        <PlanCards />
        <p className="pt-10 text-center">
          <Link href="/pricing" className="font-bold text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
            {t('seeAll')}
          </Link>
        </p>
      </section>
      <Faq />
      <Cta />
    </>
  );
}
