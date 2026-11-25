import { getTranslations } from 'next-intl/server';
import { Arrow } from '@/components/home/hero';
import { Link } from '@/i18n/navigation';

/** The closing invitation, on the brand gradient. */
export async function Cta() {
  const t = await getTranslations('cta');
  return (
    <section className="wrap pb-24 lg:pb-32">
      <div className="grain relative isolate overflow-hidden rounded-[2.5rem] bg-brand px-8 py-20 text-white sm:px-16 lg:py-28" data-reveal>
        <div aria-hidden className="absolute -end-20 -top-24 -z-10 size-[28rem] rounded-full border-[3.5rem] border-white/10" />
        <div aria-hidden className="absolute -bottom-32 start-1/3 -z-10 size-[22rem] rounded-full bg-white/10 blur-2xl" />
        <h2 className="text-display max-w-[16ch]">{t('title')}</h2>
        <p className="text-lead mt-5 text-white/85">{t('body')}</p>
        <Link href="/start" className="btn mt-10 bg-white text-ink shadow-[0_20px_40px_-20px_oklch(0.2_0.06_262/0.6)]">
          {t('button')}
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
