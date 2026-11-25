import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Pages only: not API routes, Next internals, metadata files or static assets.
  matcher: ['/((?!api|_next|_vercel|.*\\..*|sitemap.xml|robots.txt|opengraph-image).*)'],
};
