import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SIGN_IN_URL } from '@/lib/site';
import { Logo } from './logo';

export async function Footer() {
  const [t, nav] = await Promise.all([getTranslations('footer'), getTranslations('nav')]);
  const cols = [
    { title: t('product'), links: [['/features', nav('features')], ['/pricing', nav('pricing')], ['/start', nav('start')]] },
    { title: t('company'), links: [['/about', nav('about')]] },
    { title: t('legal'), links: [['/privacy', t('privacy')], ['/terms', t('terms')]] },
  ] as const;
  return (
    <footer className="border-t border-line bg-surface">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="grid content-start gap-4">
          <Logo />
          <p className="max-w-[30ch] text-ink-3">{t('tagline')}</p>
          <a href={SIGN_IN_URL} className="w-fit font-semibold text-ink-2 hover:text-ink">
            {nav('signIn')} →
          </a>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title} className="grid content-start gap-3">
            <p className="eyebrow">{c.title}</p>
            {c.links.map(([href, label]) => (
              <Link key={href} href={href} className="w-fit font-semibold text-ink-2 hover:text-ink">
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="wrap flex flex-wrap justify-between gap-3 border-t border-line py-6 text-sm text-ink-3">
        <p>{t('rights', { year: new Date().getFullYear() })}</p>
        <p>{t('made')}</p>
      </div>
    </footer>
  );
}
