import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "../../i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionWrapper } from "@/components/customComponent/session-provider";
import Navbar from "@/components/customComponent/navigation";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// @ts-expect-error

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionWrapper>
          <Navbar />
          <main className={`${geistSans.variable} ${geistMono.variable}`}>
            {children}
          </main>
        </SessionWrapper>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
