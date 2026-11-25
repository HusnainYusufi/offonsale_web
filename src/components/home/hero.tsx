'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, useGsap } from '@/components/motion/gsap';
import { Link } from '@/i18n/navigation';
import { RTL, type Locale } from '@/i18n/routing';

/** Words wrapped for the rise-in (the text stays real HTML for search and screen readers). */
function Words({ text, gradient }: { text: string; gradient?: boolean }) {
  return (
    <span className="-mb-[0.2em] block overflow-hidden pb-[0.3em]">
      {text.split(' ').map((w, i) => (
        // The gradient sits on each word: a clipped background does not reach moving children.
        // Extra bottom padding lets the gradient reach descenders (the "y" in delivery).
        <span key={i} className={`inline-block ${gradient ? 'text-brand -mb-[0.2em] pb-[0.2em]' : ''}`} data-word>
          {w}
          {' '}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const { gsap } = useGsap();

  // The silk loads after first paint (the headline is the LCP), and only when WebGL works.
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    const go = async () => {
      if (!canvas.current || !window.WebGLRenderingContext) return;
      const { startSilk } = await import('./silk');
      if (cancelled || !canvas.current) return;
      try {
        stop = startSilk(canvas.current, { rtl: RTL.includes(locale), still: prefersReducedMotion() });
        setReady(true);
      } catch {
        // No WebGL: the CSS gradient stays.
      }
    };
    const idle = 'requestIdleCallback' in window
      ? window.requestIdleCallback(() => void go(), { timeout: 1200 })
      : globalThis.setTimeout(() => void go(), 300);
    return () => {
      cancelled = true;
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
      stop?.();
    };
  }, [locale]);

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('[data-word]', { yPercent: 115, rotate: 3, duration: 1.15, stagger: 0.055 })
        .from('[data-hero-fade]', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=0.8')
        .from('[data-float]', { y: 40, opacity: 0, scale: 0.92, duration: 1.1, stagger: 0.12, ease: 'back.out(1.6)' }, '-=0.9');
      gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? -10 : 10, duration: 3 + i, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
        gsap.to(el, {
          yPercent: -30 - i * 15,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [gsap]);

  return (
    <section ref={root} className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-[12vh] pt-32">
      {/* Fallback gradient (no WebGL, or until the silk is ready). */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-paper">
        <div className="absolute -end-[15%] top-[5%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,oklch(0.75_0.13_165/0.55),transparent_65%)] blur-2xl" />
        <div className="absolute -end-[5%] bottom-[-10%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,oklch(0.62_0.17_258/0.45),transparent_65%)] blur-2xl" />
      </div>
      <canvas
        ref={canvas}
        aria-hidden
        className={`absolute inset-0 -z-10 h-full w-full transition-opacity duration-[1600ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <div className="wrap relative grid w-full gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end">
        <div className="grid gap-7">
          <p data-hero-fade className="inline-flex w-fit items-center gap-2 rounded-full bg-surface/80 px-3.5 py-1.5 text-sm font-semibold text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] backdrop-blur">
            <span className="size-2 rounded-full bg-brand" />
            {t('eyebrow')}
          </p>
          <h1 className="text-hero">
            <Words text={t('line1')} />
            <Words text={t('line2')} />
            <Words text={t('line3')} gradient />
          </h1>
          <p data-hero-fade className="text-lead max-w-[38rem] text-ink-2">
            {t('lead')}
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-3">
            <Link href="/start" className="btn btn-primary">
              {t('primary')}
              <Arrow />
            </Link>
            <Link href="/pricing" className="btn btn-ghost">
              {t('secondary')}
            </Link>
          </div>
          <p data-hero-fade className="text-sm text-ink-3">
            {t('note')}
          </p>
        </div>

        {/* The product, in three glances. */}
        <div aria-hidden className="relative hidden h-[26rem] lg:block">
          <div data-float className="absolute end-0 top-0 w-72 rounded-3xl bg-surface/90 p-5 shadow-[0_30px_70px_-30px_oklch(0.2_0.06_262/0.45)] backdrop-blur-xl">
            <p className="text-xs font-semibold text-ink-3">{t('cardOrder')}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">Rs 8,450</p>
            <p className="text-sm text-ink-3">{t('cardOrderMeta')}</p>
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-soft px-3 py-2 text-sm font-semibold text-[oklch(0.42_0.1_165)]">
              <Check />
              {t('cardConfirmed')}
            </div>
          </div>
          <div data-float className="absolute start-4 top-40 w-60 rounded-3xl bg-night p-5 text-white shadow-[0_30px_70px_-30px_oklch(0.2_0.06_262/0.7)]">
            <p className="text-xs font-semibold text-white/60">{t('cardShield')}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-1/5 rounded-full bg-brand" />
            </div>
            <p className="mt-3 text-sm font-semibold">{t('cardShieldMeta')}</p>
          </div>
          <div data-float className="absolute bottom-2 end-10 rounded-full bg-surface/90 px-5 py-3 text-sm font-bold shadow-[0_20px_50px_-24px_oklch(0.2_0.06_262/0.5)] backdrop-blur-xl">
            {t('cardLang')}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  );
}
