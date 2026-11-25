'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { prefersReducedMotion, useGsap } from './gsap';

/**
 * Elements marked data-reveal rise in once as they enter (staggered in
 * batches). data-reveal="fade" only fades. Runs again on each page.
 */
export function Reveals() {
  const { gsap, ScrollTrigger } = useGsap();
  const pathname = usePathname();
  useEffect(() => {
    const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    const triggers = ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.07,
          overwrite: true,
        }),
    });
    ScrollTrigger.refresh();
    return () => triggers.forEach((t) => t.kill());
  }, [gsap, ScrollTrigger, pathname]);
  return null;
}
