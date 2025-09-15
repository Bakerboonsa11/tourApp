import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

// Apply the i18n middleware
export default createMiddleware(routing);

export const config = {
  // Paths that should be internationalized
  matcher: [
    // Match all paths except:
    // - API routes
    // - Next.js static files (_next)
    // - static assets (images, fonts, etc.)
    '/((?!api|_next|.*\\..*).*)'
  ]
};
