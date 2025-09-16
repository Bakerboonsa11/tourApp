import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionWrapper } from "@/components/customComponent/session-provider";
import Navbar from "@/components/customComponent/navigation";
import type { ReactNode } from "react";
import { routing } from "../../i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionWrapper>
              <Navbar />
              <main>{children}</main>
            </SessionWrapper>
          </ThemeProvider>
        </NextIntlClientProvider>
    </>
  );
}