import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['en', 'am', 'om'],
    defaultLocale: 'en',
    localePrefix:'as-needed'
})