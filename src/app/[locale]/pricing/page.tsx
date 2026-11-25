import type { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { Cta } from '@/components/home/cta';
import { Faq } from '@/components/home/faq';
import { PlanCards } from '@/components/home/plan-cards';
import type { Locale } from '@/i18n/routing';
import { jsonLd, pageMetadata } from '@/lib/seo';
import { ALL_FEATURES, PLANS, rupees, SITE_URL } from '@/lib/site';

export async function generateMetadata(props: PageProps<'/[locale]/pricing'>): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({ locale: locale as Locale, path: '/pricing', title: t('pricingTitle'), description: t('pricingDescription') });
}

export default async function Pricing(props: PageProps<'/[locale]/pricing'>) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const [t, lang] = await Promise.all([getTranslations('pricing'), getLocale()]);
  const included = t.raw('included') as string[];
  const product = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OffOnSale',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    offers: PLANS.map((p) => ({
      '@type': 'Offer',
      name: t(`plans.${p.key}.name`),
      price: p.price,
      priceCurrency: 'PKR',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price, priceCurrency: 'PKR', unitText: 'MONTH' },
    })),
  };
  const cell = (on: boolean) => (
    <span className={on ? 'text-[oklch(0.55_0.13_163)]' : 'text-ink-4'} aria-label={on ? t('yes') : t('no')}>
      {on ? '●' : '—'}
    </span>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(product)} />
      <section className="relative overflow-hidden pb-20 pt-40">
        <div aria-hidden className="absolute -top-40 start-1/2 -z-10 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.85_0.09_180/0.6),transparent)] blur-2xl" />
        <div className="wrap grid gap-5 pb-16 text-center">
          <p className="eyebrow" data-reveal>{t('eyebrow')}</p>
          <h1 className="text-hero mx-auto max-w-[12ch]" data-reveal>{t('title')}</h1>
          <p className="text-lead mx-auto max-w-[40rem] text-ink-2" data-reveal>{t('lead')}</p>
        </div>
        <div className="wrap">
          <PlanCards />
          <p className="mx-auto max-w-[44rem] pt-10 text-center text-ink-3" data-reveal>{t('trialNote')}</p>
        </div>
      </section>

      <section className="wrap pb-24">
        <h2 className="text-display pb-10" data-reveal>{t('compareTitle')}</h2>
        <div className="overflow-x-auto rounded-[1.75rem] border border-line bg-surface" data-reveal>
          <table className="w-full min-w-[40rem] border-collapse text-start">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-5 text-start text-sm font-bold text-ink-3">{t('feature')}</th>
                {PLANS.map((p) => (
                  <th key={p.key} scope="col" className="p-5 text-start">
                    <span className="block text-lg font-extrabold">{t(`plans.${p.key}.name`)}</span>
                    <span className="text-sm font-semibold text-ink-3">{rupees(p.price, lang)}{t('perMonth')}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line">
                <th scope="row" className="p-5 text-start font-semibold">{t('staffRow')}</th>
                {PLANS.map((p) => (
                  <td key={p.key} className="p-5">{p.staff === null ? t('staffUnlimited') : t('staffLimit', { count: p.staff })}</td>
                ))}
              </tr>
              <tr className="border-b border-line">
                <th scope="row" className="p-5 text-start font-semibold">{t('productsRow')}</th>
                {PLANS.map((p) => (
                  <td key={p.key} className="p-5">{p.products === null ? t('productsUnlimited') : t('productLimit', { count: p.products })}</td>
                ))}
              </tr>
              {ALL_FEATURES.map((f) => (
                <tr key={f} className="border-b border-line">
                  <th scope="row" className="p-5 text-start font-semibold">{t(`features.${f}`)}</th>
                  {PLANS.map((p) => (
                    <td key={p.key} className="p-5 text-lg">{cell(p.features.includes(f))}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="p-5 text-start align-top font-semibold">{t('everyPlan')}</th>
                <td colSpan={3} className="p-5">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {included.map((i) => (
                      <li key={i} className="flex gap-2"><span className="text-[oklch(0.55_0.13_163)]">●</span>{i}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <Faq />
      <Cta />
    </>
  );
}
