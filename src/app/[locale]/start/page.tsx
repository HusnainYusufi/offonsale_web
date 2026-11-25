import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StartForm } from '@/components/signup/start-form';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { SIGN_IN_URL } from '@/lib/site';

export async function generateMetadata(props: PageProps<'/[locale]/start'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale: locale as Locale, path: '/start', title: t('startTitle'), description: t('startDescription') });
}

export default async function Start(props: PageProps<'/[locale]/start'>) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const search = await props.searchParams;
  const t = await getTranslations('start');
  const timeline = t.raw('timeline') as { when: string; what: string }[];
  const plan = typeof search.plan === 'string' ? search.plan.toUpperCase() : 'TRIAL';
  return (
    <section className="relative overflow-hidden pb-24 pt-36">
      <div aria-hidden className="absolute -end-40 -top-40 -z-10 size-[44rem] rounded-full bg-[radial-gradient(circle,oklch(0.82_0.1_170/0.55),transparent_65%)] blur-2xl" />
      <div aria-hidden className="absolute -bottom-60 -start-40 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,oklch(0.75_0.12_255/0.4),transparent_65%)] blur-2xl" />
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20">
        <div className="grid content-start gap-6">
          <p className="eyebrow" data-reveal>{t('eyebrow')}</p>
          <h1 className="text-display" data-reveal>{t('title')}</h1>
          <p className="text-lead max-w-[36rem] text-ink-2" data-reveal>{t('lead')}</p>
          <StartForm initialPlan={plan} locale={locale} />
          <p className="text-ink-3">
            {t('haveAccount')}{' '}
            <a href={SIGN_IN_URL} className="font-bold text-ink underline decoration-line-strong underline-offset-4">
              {t('signIn')}
            </a>
          </p>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] bg-night p-8 text-white sm:p-10">
            <h2 className="text-title">{t('timelineTitle')}</h2>
            <ol className="relative mt-8 grid gap-8 border-s border-white/15 ps-8">
              {timeline.map((s, i) => (
                <li key={s.when} className="relative grid gap-1">
                  <span className={`absolute -start-[2.55rem] top-1 size-4 rounded-full ring-4 ring-night ${i === 3 ? 'bg-white/40' : 'bg-brand'}`} />
                  <p className="font-bold">{s.when}</p>
                  <p className="text-white/70">{s.what}</p>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
