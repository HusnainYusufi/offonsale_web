import { getTranslations } from 'next-intl/server';

/** What OffOnSale speaks and takes, drifting by (pure CSS; pauses for reduced motion). */
export async function Marquee() {
  const t = await getTranslations();
  const items = t.raw('marquee') as string[];
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pe-10 [animation:marquee_38s_linear_infinite] rtl:[animation-direction:reverse]">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap text-[clamp(1.25rem,2.4vw,2rem)] font-bold tracking-tight text-ink-2">
          {item}
          <span className="size-2 rounded-full bg-brand" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="OffOnSale" className="overflow-hidden border-y border-line bg-surface py-7 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <style>{`@keyframes marquee{to{transform:translateX(-100%)}}`}</style>
      <div className="flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
