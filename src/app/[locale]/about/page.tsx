import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Cta } from '@/components/home/cta';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(props: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale: locale as Locale, path: '/about', title: t('aboutTitle'), description: t('aboutDescription') });
}

export default async function About(props: PageProps<'/[locale]/about'>) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const story = t.raw('story') as string[];
  const values = t.raw('values') as { title: string; body: string }[];
  return (
    <>
      <section className="wrap grid gap-6 pb-20 pt-40">
        <p className="eyebrow" data-reveal>{t('eyebrow')}</p>
        <h1 className="text-hero max-w-[12ch]" data-reveal>
          {t('title')}
        </h1>
        <p className="text-lead max-w-[42rem] text-ink-2" data-reveal>{t('lead')}</p>
      </section>
      <section className="wrap grid gap-10 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div aria-hidden className="grain relative hidden min-h-[28rem] overflow-hidden rounded-[2rem] bg-brand lg:block" data-reveal>
          <div className="absolute -bottom-24 -end-24 size-96 rounded-full border-[3rem] border-white/15" />
          <div className="absolute start-10 top-10 text-[9rem] font-extrabold leading-none text-white/90">اردو</div>
        </div>
        <div className="grid content-center gap-8">
          {story.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-title' : 'text-lead text-ink-2'} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </section>
      <section className="bg-night py-24 text-white lg:py-32">
        <div className="wrap grid gap-12">
          <h2 className="text-display" data-reveal>{t('valuesTitle')}</h2>
          <ul className="grid gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2">
            {values.map((v, i) => (
              <li key={v.title} className="grid gap-3 bg-night p-8 lg:p-10" data-reveal>
                <span className="text-sm font-bold text-white/40">0{i + 1}</span>
                <h3 className="text-title">{v.title}</h3>
                <p className="text-white/70">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="pt-24">
        <Cta />
      </div>
    </>
  );
}
