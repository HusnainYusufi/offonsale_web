import type { ReactNode } from 'react';

/** Each language renders its own <html> (src/app/[locale]/layout.tsx). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
