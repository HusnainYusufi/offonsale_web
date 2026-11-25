'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion, useGsap } from '@/components/motion/gsap';

const ART = ['shield', 'chat', 'script', 'lock', 'checkout'] as const;

/**
 * Why OffOnSale: five reasons on a horizontal track, pinned while you scroll
 * on large screens; a plain list on phones and for reduced motion.
 */
export function Story() {
  const t = useTranslations('story');
  const items = t.raw('items') as { tag: string; title: string; body: string }[];
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { gsap } = useGsap();

  useEffect(() => {
    if (!section.current || !track.current || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const el = track.current!;
      const rtl = document.documentElement.dir === 'rtl';
      const distance = () => el.scrollWidth - window.innerWidth + 64;
      const tween = gsap.to(el, {
        x: () => (rtl ? distance() : -distance()),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray<HTMLElement>('[data-story-card]').forEach((card) => {
        gsap.from(card.querySelector('[data-story-art]'), {
          scale: 0.6,
          rotate: -12,
          opacity: 0,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 85%', end: 'left 45%', scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, [gsap]);

  return (
    <section ref={section} id="why" className="relative overflow-hidden py-24 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
      <div className="wrap grid gap-4 pb-12 lg:pb-14">
        <p className="eyebrow" data-reveal>{t('eyebrow')}</p>
        <h2 className="text-display max-w-[16ch]" data-reveal>{t('title')}</h2>
        <p className="text-lead max-w-[46rem] text-ink-2" data-reveal>{t('lead')}</p>
      </div>
      <div ref={track} className="flex flex-col gap-5 px-[var(--gutter)] lg:w-max lg:flex-row lg:gap-6">
        {items.map((item, i) => (
          <article
            key={item.tag}
            data-story-card
            data-reveal
            className="group relative grid min-h-[22rem] gap-5 overflow-hidden rounded-[2rem] border border-line bg-surface p-8 shadow-[0_40px_80px_-50px_oklch(0.2_0.06_262/0.4)] lg:w-[31rem] lg:p-10"
          >
            <span className="text-sm font-bold text-ink-4">0{i + 1}</span>
            <div data-story-art className="grid size-20 place-items-center rounded-[1.4rem] bg-brand text-white shadow-[0_20px_40px_-18px_oklch(0.56_0.18_258/0.8)]">
              <Art kind={ART[i] ?? 'shield'} />
            </div>
            <p className="eyebrow text-[oklch(0.5_0.12_200)]">{item.tag}</p>
            <h3 className="text-title">{item.title}</h3>
            <p className="text-ink-2">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Art({ kind }: { kind: (typeof ART)[number] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<(typeof ART)[number], React.ReactNode> = {
    shield: <><path d="M16 3 6 7v8c0 6.5 4.3 11.6 10 14 5.7-2.4 10-7.5 10-14V7z" {...common} /><path d="m11.5 16 3.2 3.2 6-6.4" {...common} /></>,
    chat: <><path d="M5 26l1.7-5A11 11 0 1 1 11 25.3z" {...common} /><path d="M12 13c.4 3 2.9 5.6 6 6l1.4-1.6 2.4 1-.4 2.2c-4.8.5-9.8-4.5-9.3-9.3l2.2-.4 1 2.4z" {...common} /></>,
    script: <><path d="M6 9h20M6 16h14M6 23h9" {...common} /><path d="M24 20c0 3-2 5-4 5" {...common} /></>,
    lock: <><rect x="7" y="14" width="18" height="13" rx="3" {...common} /><path d="M11 14V10a5 5 0 0 1 10 0v4" {...common} /><circle cx="16" cy="20.5" r="1.6" {...common} /></>,
    checkout: <><rect x="5" y="8" width="22" height="16" rx="3" {...common} /><path d="M5 13h22M9 19h6" {...common} /></>,
  };
  return <svg viewBox="0 0 32 32" className="size-10">{paths[kind]}</svg>;
}
