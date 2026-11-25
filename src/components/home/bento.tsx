import { getTranslations } from 'next-intl/server';

const TILES = [
  { key: 'theme', span: 'lg:col-span-4 lg:row-span-2', tone: 'night' },
  { key: 'checkout', span: 'lg:col-span-2', tone: 'brand' },
  { key: 'returns', span: 'lg:col-span-2', tone: 'paper' },
  { key: 'discounts', span: 'lg:col-span-2', tone: 'paper' },
  { key: 'accounts', span: 'lg:col-span-2', tone: 'mint' },
  { key: 'import', span: 'lg:col-span-2', tone: 'paper' },
] as const;

const TONE = {
  night: 'bg-night text-white [&_p]:text-white/70',
  brand: 'bg-brand text-white [&_p]:text-white/85',
  mint: 'bg-emerald-soft',
  paper: 'bg-surface',
} as const;

/** The admin's main tools, as a bento grid (the theme designer leads). */
export async function Bento() {
  const t = await getTranslations('bento');
  return (
    <section id="features" className="wrap py-24 lg:py-36">
      <div className="grid gap-4 pb-14">
        <p className="eyebrow" data-reveal>{t('eyebrow')}</p>
        <h2 className="text-display max-w-[18ch]" data-reveal>{t('title')}</h2>
      </div>
      <div className="grid auto-rows-[minmax(13rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-8">
        {TILES.map(({ key, span, tone }) => (
          <article
            key={key}
            data-reveal
            className={`group relative flex flex-col justify-end gap-2 overflow-hidden rounded-[1.75rem] border border-line p-7 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 ${span} ${TONE[tone]}`}
          >
            {key === 'theme' && <ThemeArt />}
            <h3 className="text-title relative">{t(`items.${key}.title`)}</h3>
            <p className="relative max-w-[34ch]">{t(`items.${key}.body`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** A tiny editor mock: sections list, canvas, inspector (pure markup, no images). */
function ThemeArt() {
  return (
    <div aria-hidden className="absolute inset-x-7 top-7 bottom-40 grid grid-cols-[5rem_1fr_6rem] gap-3 opacity-90 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2">
      <div className="grid content-start gap-2 rounded-2xl bg-white/8 p-3">
        {[70, 90, 55, 80, 65].map((w, i) => (
          <span key={i} className="h-2.5 rounded-full bg-white/25" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(140deg,oklch(0.63_0.14_163),oklch(0.56_0.18_258))]">
        <span className="absolute start-4 top-5 h-4 w-3/5 rounded-full bg-white/80" />
        <span className="absolute start-4 top-12 h-3 w-2/5 rounded-full bg-white/50" />
        <span className="absolute start-4 top-20 h-7 w-24 rounded-full bg-white" />
        <span className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-14 rounded-xl bg-white/25" />
          ))}
        </span>
        <span className="absolute inset-2 rounded-xl ring-2 ring-white/80 ring-offset-0" />
      </div>
      <div className="grid content-start gap-2 rounded-2xl bg-white/8 p-3">
        <span className="h-6 rounded-lg bg-white/25" />
        <span className="h-6 rounded-lg bg-white/15" />
        <span className="h-10 rounded-lg bg-white/15" />
        <span className="h-6 w-2/3 rounded-full bg-[oklch(0.63_0.14_163)]" />
      </div>
    </div>
  );
}
