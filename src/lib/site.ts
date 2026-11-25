/** Facts the site states. Plans mirror the API (tenancy/billing/plans.ts). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3300').replace(/\/$/, '');
export const ADMIN_URL = (process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001').replace(/\/$/, '');
export const SIGN_IN_URL = `${ADMIN_URL}/auth/login`;

export type PlanKey = 'BASIC' | 'GROW' | 'PLUS';
export type Feature =
  | 'branding'
  | 'blocks'
  | 'fields'
  | 'rules'
  | 'upsells'
  | 'support';

export interface Plan {
  key: PlanKey;
  price: number;
  staff: number | null;
  products: number | null;
  features: Feature[];
}

export const PLANS: Plan[] = [
  { key: 'BASIC', price: 2999, staff: 1, products: 500, features: [] },
  { key: 'GROW', price: 7999, staff: 5, products: 10_000, features: ['branding'] },
  {
    key: 'PLUS',
    price: 24999,
    staff: null,
    products: null,
    features: ['branding', 'blocks', 'fields', 'rules', 'upsells', 'support'],
  },
];

export const ALL_FEATURES: Feature[] = ['branding', 'blocks', 'fields', 'rules', 'upsells', 'support'];
export const TRIAL_DAYS = 14;
export const GRACE_DAYS = 7;

/** Prices in PKR, as a merchant in that language reads them. */
export function rupees(amount: number, locale: string): string {
  return new Intl.NumberFormat(`${locale}-PK`, {
    style: 'currency',
    currency: 'PKR',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount);
}
