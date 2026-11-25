'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion, useGsap } from '@/components/motion/gsap';

/** Three steps joined by a line that draws itself as you scroll. */
export function Steps() {
  const t = useTranslations('steps');
  const items = t.raw('items') as { title: string; body: string }[];
  const root = useRef<HTMLElement>(null);
  const line = useRef<SVGPathElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    const path = line.current;
    if (!path || prefersReducedMotion()) return;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.8 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [gsap]);

  return (
    <section ref={root} className="relative overflow-hidden bg-night py-24 text-white lg:py-36">
      <div aria-hidden className="absolute -top-40 end-[-10%] size-[40rem] rounded-full bg-[radial-gradient(circle,oklch(0.56_0.18_258/0.45),transparent_65%)] blur-3xl" />
      <div className="wrap relative grid gap-16">
        <div className="grid gap-4">
          <p className="eyebrow !text-white/55" data-reveal>{t('eyebrow')}</p>
          <h2 className="text-display max-w-[14ch]" data-reveal>{t('title')}</h2>
        </div>
        <div className="relative">
          <svg aria-hidden viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 top-6 hidden h-24 w-full lg:block rtl:-scale-x-100">
            <defs>
              <linearGradient id="stepline" x1="0" x2="1">
                <stop offset="0" stopColor="oklch(0.7 0.14 163)" />
                <stop offset="1" stopColor="oklch(0.62 0.17 258)" />
              </linearGradient>
            </defs>
            <path ref={line} d="M20 60 C 220 0, 380 120, 600 60 S 980 0, 1180 60" fill="none" stroke="url(#stepline)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <ol className="relative grid gap-10 lg:grid-cols-3">
            {items.map((s, i) => (
              <li key={s.title} className="grid gap-4" data-reveal>
                <span className="grid size-14 place-items-center rounded-full bg-brand text-lg font-extrabold shadow-[0_0_0_8px_oklch(0.2_0.06_262)]">
                  {i + 1}
                </span>
                <h3 className="text-title">{s.title}</h3>
                <p className="max-w-[34ch] text-white/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
