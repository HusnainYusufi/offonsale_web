'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { SIGN_IN_URL } from '@/lib/site';
import { Logo } from './logo';

const LANGS: Record<string, string> = { en: 'English', ar: 'العربية', ur: 'اردو' };

/** Glass bar: hides while scrolling down, returns on the way up. */
export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Open on the page it was opened on: navigating closes it by itself.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 400);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const links = [
    { href: '/features', label: t('features') },
    { href: '/pricing', label: t('pricing') },
    { href: '/about', label: t('about') },
  ] as const;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
        hidden && !open ? '-translate-y-full' : ''
      } ${scrolled || open ? 'bg-paper/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : ''}`}
    >
      <nav className="wrap flex h-18 items-center justify-between gap-6 py-4" aria-label="OffOnSale">
        <Link href="/" aria-label="OffOnSale">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? 'page' : undefined}
                className="rounded-full px-4 py-2 text-[0.95rem] font-semibold text-ink-2 transition-colors hover:text-ink aria-[current=page]:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageMenu locale={locale} pathname={pathname} label={t('language')} />
          <a href={SIGN_IN_URL} className="rounded-full px-4 py-2 text-[0.95rem] font-semibold text-ink-2 hover:text-ink">
            {t('signIn')}
          </a>
          <Link href="/start" className="btn btn-primary !min-h-11 !px-5 !py-2 text-[0.95rem]">
            {t('start')}
          </Link>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--color-line-strong)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('close') : t('menu')}
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute inset-x-0 top-0 h-0.5 rounded bg-ink transition-transform ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`absolute inset-x-0 bottom-0 h-0.5 rounded bg-ink transition-transform ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </span>
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="wrap grid h-[calc(100dvh-4.5rem)] content-start gap-2 pb-10 pt-6 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="border-b border-line py-4 text-3xl font-extrabold tracking-tight">
              {l.label}
            </Link>
          ))}
          <div className="flex flex-wrap gap-2 py-6">
            {routing.locales.map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                lang={l}
                aria-current={l === locale ? 'true' : undefined}
                className="rounded-full border border-line-strong px-4 py-2 font-semibold aria-[current=true]:bg-ink aria-[current=true]:text-white"
              >
                {LANGS[l]}
              </Link>
            ))}
          </div>
          <Link href="/start" className="btn btn-primary">
            {t('start')}
          </Link>
          <a href={SIGN_IN_URL} className="btn btn-ghost">
            {t('signIn')}
          </a>
        </div>
      )}
    </header>
  );
}

function LanguageMenu({ locale, pathname, label }: { locale: string; pathname: string; label: string }) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-2 text-[0.95rem] font-semibold text-ink-2 hover:text-ink [&::-webkit-details-marker]:hidden" aria-label={label}>
        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="10" cy="10" r="7.5" />
          <path d="M2.5 10h15M10 2.5c2.2 2.4 2.2 12.6 0 15M10 2.5c-2.2 2.4-2.2 12.6 0 15" />
        </svg>
        {LANGS[locale]}
      </summary>
      <ul className="absolute end-0 mt-2 grid min-w-40 gap-1 rounded-2xl bg-surface p-2 shadow-[0_20px_50px_-20px_oklch(0.2_0.06_262/0.4),inset_0_0_0_1px_var(--color-line)]">
        {routing.locales.map((l) => (
          <li key={l}>
            <Link href={pathname} locale={l} lang={l} className="block rounded-xl px-3 py-2 font-semibold hover:bg-paper-2">
              {LANGS[l]}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
