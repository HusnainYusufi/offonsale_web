import { getTranslations } from 'next-intl/server';
import { jsonLd } from '@/lib/seo';

/** Questions with native <details> (works without JavaScript), plus FAQPage data for search. */
export async function Faq() {
  const t = await getTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
  return (
    <section className="wrap grid gap-12 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:py-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
      <h2 className="text-display max-w-[12ch]" data-reveal>{t('title')}</h2>
      <div className="grid">
        {items.map((i) => (
          <details key={i.q} data-reveal className="group border-b border-line py-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.2rem] font-bold tracking-tight">
              {i.q}
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-ink-3 transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="max-w-[62ch] pt-4 text-ink-2">{i.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
