import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import { hasLocale } from 'next-intl';


export default getRequestConfig(async ({requestLocale}) => {

const requeasted= await requestLocale;
const locale= hasLocale(routing.locales,requeasted)
    ?requeasted
    :routing.defaultLocale


    return {
        locale,
        messages:(await import(`../../messages/${locale}.json`)).default,
    }

})

