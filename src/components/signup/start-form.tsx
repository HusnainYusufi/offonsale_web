'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Arrow } from '@/components/home/hero';
import { ADMIN_URL, PLANS, rupees } from '@/lib/site';

const OPTIONS = ['TRIAL', 'BASIC', 'GROW', 'PLUS'] as const;

/**
 * Store name, email, market and the plan for after the trial. Hands over to
 * the admin's /signup (a plain GET form, so it works without JavaScript);
 * the password is set on the login server, never here.
 */
export function StartForm({ initialPlan, locale }: { initialPlan: string; locale: string }) {
  const t = useTranslations('start');
  const p = useTranslations('pricing');
  const lang = useLocale();
  const [plan, setPlan] = useState<string>(
    (OPTIONS as readonly string[]).includes(initialPlan) ? initialPlan : 'TRIAL',
  );
  const [errors, setErrors] = useState<{ store?: string; email?: string }>({});

  return (
    <form
      action={`${ADMIN_URL}/signup`}
      method="get"
      noValidate
      className="grid gap-6 rounded-[2rem] border border-line bg-surface/90 p-6 shadow-[0_40px_80px_-50px_oklch(0.2_0.06_262/0.45)] backdrop-blur sm:p-8"
      data-reveal
      onSubmit={(e) => {
        const data = new FormData(e.currentTarget);
        const store = String(data.get('store') ?? '').trim();
        const email = String(data.get('email') ?? '').trim();
        const next = {
          store: store.length < 2 || store.length > 100 ? t('errors.store') : undefined,
          email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? undefined : t('errors.email'),
        };
        setErrors(next);
        if (next.store || next.email) {
          e.preventDefault();
          (e.currentTarget.querySelector(next.store ? '#store' : '#email') as HTMLElement | null)?.focus();
        }
      }}
    >
      <fieldset className="grid gap-3">
        <legend className="mb-3 font-bold">{t('plan')}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {OPTIONS.map((key) => {
            const info = PLANS.find((x) => x.key === key);
            return (
              <label
                key={key}
                className={`relative flex cursor-pointer flex-col gap-0.5 rounded-2xl border p-4 transition-[border-color,box-shadow] duration-300 ${
                  plan === key
                    ? 'border-transparent shadow-[0_0_0_2px_var(--color-ocean),0_20px_40px_-24px_oklch(0.56_0.18_258/0.6)]'
                    : 'border-line hover:border-line-strong'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={key}
                  checked={plan === key}
                  onChange={() => setPlan(key)}
                  className="sr-only"
                />
                <span className="font-bold">{key === 'TRIAL' ? t('trialOnly') : p(`plans.${key}.name`)}</span>
                <span className="text-sm text-ink-3">
                  {info ? `${rupees(info.price, lang)}${p('perMonth')}` : t('trialOnlyHint')}
                </span>
                {key === 'GROW' && (
                  <span className="absolute end-3 top-3 rounded-full bg-brand px-2 py-0.5 text-[0.65rem] font-bold text-white">
                    {p('popular')}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field id="store" label={t('store')} error={errors.store}>
        <input id="store" name="store" required minLength={2} maxLength={100} autoComplete="organization" placeholder={t('storePlaceholder')} className={input} aria-invalid={!!errors.store} aria-describedby={errors.store ? 'store-error' : undefined} />
      </Field>
      <Field id="email" label={t('email')} error={errors.email}>
        <input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className={input} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="country" label={t('country')}>
          <select id="country" name="country" defaultValue={locale === 'ar' ? 'SA' : 'PK'} className={input}>
            {(['PK', 'SA', 'AE'] as const).map((c) => (
              <option key={c} value={c}>
                {t(`countries.${c}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="lang" label={t('language')}>
          <select id="lang" name="lang" defaultValue={locale} className={input}>
            <option value="en">English</option>
            <option value="ur">اردو</option>
            <option value="ar">العربية</option>
          </select>
        </Field>
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {t('submit')}
        <Arrow />
      </button>
      <p className="flex items-center justify-center gap-2 text-center text-sm text-ink-3">
        <svg viewBox="0 0 20 20" className="size-4 text-[oklch(0.55_0.13_163)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="4" y="9" width="12" height="8" rx="2" />
          <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
        </svg>
        {t('secure')}
      </p>
    </form>
  );
}

const input =
  'h-13 w-full rounded-2xl border border-line-strong bg-paper px-4 text-[1rem] outline-none transition-[box-shadow,border-color] focus:border-ocean focus:shadow-[0_0_0_4px_oklch(0.56_0.18_258/0.15)] aria-[invalid=true]:border-[oklch(0.6_0.2_25)]';

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-[oklch(0.55_0.2_25)]">
          {error}
        </p>
      )}
    </div>
  );
}
