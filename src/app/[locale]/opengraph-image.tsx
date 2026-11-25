import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'OffOnSale';

/** The share card: wordmark, headline, the silk gradient. */
export default async function OpenGraph({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale === 'ar' || locale === 'ur' ? 'en' : locale, namespace: 'hero' });
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background:
            'radial-gradient(circle at 85% 20%, #8fe3c4 0%, transparent 45%), radial-gradient(circle at 80% 90%, #7aa8f2 0%, transparent 50%), #f5f8fb',
          color: '#0e1b31',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 40, fontWeight: 800 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#0f9f74,#1f6fe0)' }} />
          <span style={{ color: '#5b6b82' }}>Off</span>
          <span style={{ color: '#1f6fe0', marginLeft: -16 }}>On</span>
          <span style={{ marginLeft: -16 }}>Sale</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 }}>
          <span>{t('line1')}</span>
          <span>{t('line2')}</span>
          <span style={{ color: '#0f9f74' }}>{t('line3')}</span>
        </div>
        <div style={{ fontSize: 28, color: '#3d4d66' }}>{t('note')}</div>
      </div>
    ),
    size,
  );
}
