'use client';

import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </div>
    </SessionProvider>
  );
}
