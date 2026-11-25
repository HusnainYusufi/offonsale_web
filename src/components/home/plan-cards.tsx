import { getLocale, getTranslations } from 'next-intl/server';
import { Arrow } from '@/components/home/hero';
import { Link } from '@/i18n/navigation';
import { ALL_FEATURES, PLANS, rupees } from '@/lib/site';

/** The three paid plans (Grow highlighted); each starts with the free trial. */
export async function PlanCards() {
  const [t, locale] = await Promise.all([getTranslations('pricing'), getLocale()]);
  const included = t.raw('included') as string[];
  return (
    <ul className="grid gap-5 lg:grid-cols-3">
      {PLANS.map((p) => {
        const featured = p.key === 'GROW';
        return (
          <li
            key={p.key}
            data-reveal
            className={`relative flex flex-col gap-6 rounded-[2rem] p-8 ${
              featured
                ? 'bg-night text-white shadow-[0_50px_100px_-50px_oklch(0.56_0.18_258/0.9)] lg:-translate-y-4'
                : 'border border-line bg-surface'
            }`}
          >
            {featured && (
              <span className="absolute -top-3.5 start-8 rounded-full bg-brand px-3.5 py-1 text-xs font-bold tracking-wide text-white">
                {t('popular')}
              </span>
            )}
            <div>
              <h3 className="text-title">{t(`plans.${p.key}.name`)}</h3>
              <p className={featured ? 'text-white/65' : 'text-ink-3'}>{t(`plans.${p.key}.tagline`)}</p>
            </div>
            <p className="flex items-baseline gap-1.5">
              <span className="text-[clamp(2.4rem,4vw,3.25rem)] font-extrabold tracking-[-0.04em] tabular-nums">
                {rupees(p.price, locale)}
              </span>
              <span className={featured ? 'text-white/60' : 'text-ink-3'}>{t('perMonth')}</span>
            </p>
            <ul className="grid gap-2.5 text-[0.95rem]">
              <Li on>{p.staff === null ? t('staffUnlimited') : t('staffLimit', { count: p.staff })}</Li>
              <Li on>{p.products === null ? t('productsUnlimited') : t('productLimit', { count: p.products })}</Li>
              {included.slice(0, 3).map((i) => (
                <Li key={i} on>
                  {i}
                </Li>
              ))}
              {ALL_FEATURES.map((f) => (
                <Li key={f} on={p.features.includes(f)} dark={featured}>
                  {t(`features.${f}`)}
                </Li>
              ))}
            </ul>
            <Link
              href={{ pathname: '/start', query: { plan: p.key } }}
              className={`btn mt-auto ${featured ? 'btn-primary' : 'btn-ghost'}`}
            >
              {t('ctaPlan', { plan: t(`plans.${p.key}.name`) })}
              <Arrow />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Li({ on, dark, children }: { on: boolean; dark?: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-start gap-2.5 ${on ? '' : dark ? 'text-white/35 line-through' : 'text-ink-4 line-through'}`}>
      <svg viewBox="0 0 20 20" aria-hidden className={`mt-1 size-4 shrink-0 ${on ? 'text-[oklch(0.63_0.14_163)]' : 'opacity-40'}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {on ? <path d="m4.5 10.5 3.5 3.5 7.5-8" /> : <path d="M5 10h10" />}
      </svg>
      <span className="sr-only">{on ? '✓ ' : '— '}</span>
      {children}
    </li>
  );
}
