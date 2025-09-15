import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "../../i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionWrapper } from "@/components/customComponent/session-provider";
import Navbar from "@/components/customComponent/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import type  { ReactNode } from "react";
import React from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Fetch messages synchronously using React Server Components
  const messagesPromise = getMessages({ locale });

  return (
    <React.Suspense fallback={<div>Loading translations...</div>}>
      <MessagesWrapper messagesPromise={messagesPromise}>
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
      </MessagesWrapper>
    </React.Suspense>
  );
}

function MessagesWrapper({
  messagesPromise,
  children,
}: {
  messagesPromise: Promise<any>;
  children: ReactNode;
}) {
  const messages = React.use(messagesPromise); // Server Components hook
  return <NextIntlClientProvider locale="en" messages={messages}>{children}</NextIntlClientProvider>;
}
