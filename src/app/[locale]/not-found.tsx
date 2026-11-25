import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="wrap grid min-h-[80vh] content-center gap-6 pt-28">
      <p className="text-[clamp(6rem,20vw,16rem)] font-extrabold leading-none tracking-[-0.06em] text-brand">404</p>
      <h1 className="text-display">{t('title')}</h1>
      <p className="text-lead max-w-[36rem] text-ink-2">{t('body')}</p>
      <Link href="/" className="btn btn-primary w-fit">
        {t('home')}
      </Link>
    </section>
  );
}
