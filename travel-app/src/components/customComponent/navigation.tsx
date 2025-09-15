'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { useTheme } from "next-themes";
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './../customComponent/langSwich';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guide';
  password?: string;
  createdAt: string;
  image: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const locale = useLocale();
  const t = useTranslations('navbar');
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
        const userData: User = response.data.data;
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session]);

  const profileImage = user?.image
    ? `/userimages/${user.image}`
    : session?.user?.image
    ? `/userimages/${session.user.image}`
    : '/pro.png';

  const navLinks = [
    { href: `/${locale}/tours/All`, label: t('tours') },
    { href: `/${locale}/about`, label: t('about') },
    ...(session?.user ? [{ href: `/${locale}/dashboard/${session.user.role}`, label: t('dashboard') }] : []),
  ];

  if (status === 'loading') {
    return (
      <header className="sticky top-0 z-50 h-16 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
            <div className="h-6 w-24 rounded bg-muted animate-pulse"></div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="h-5 w-16 rounded bg-muted animate-pulse"></div>
            <div className="h-5 w-16 rounded bg-muted animate-pulse"></div>
          </div>
          <div className="h-9 w-20 rounded-md bg-muted animate-pulse hidden md:block"></div>
          <div className="md:hidden h-9 w-9 rounded-md bg-muted animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <Image
            src="/static/log.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            {t('logo')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition-colors hover:text-primary",
                pathname.startsWith(link.href) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center justify-end gap-4">
          {session?.user ? (
            <div className="flex items-center gap-4">
             <Link href={`/${locale}/dashboard/${session.user.role}`}>
  <Image
    src={profileImage}
    alt="profile"
    width={40}
    height={40}
    className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-primary transition-colors"
  />
</Link>

              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="secondary"
              >
                {t('signout')}
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href={`/${locale}/login`}>{t('login')}</Link>
            </Button>
          )}
                 
          {/* Desktop Theme Toggle & Language */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">{t('toggleTheme')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>{t('light')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>{t('dark')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>{t('system')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col">
              <nav className="mt-8 flex flex-col gap-6">
                <Link href={`/${lang}`} className="flex items-center gap-3 mb-4">
                  <Image
                    src="/static/log.png"
                    alt="logo"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="text-xl font-bold">{t('logo')}</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith(link.href) ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <div className="pt-4 border-t">
                  <LanguageSwitcher />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-center">
                      <Sun className="h-5 w-5 mr-2 dark:hidden" />
                      <Moon className="h-5 w-5 mr-2 hidden dark:block" />
                      <span>{t('toggleTheme')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[268px]">
                    <DropdownMenuItem onClick={() => setTheme("light")}>{t('light')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>{t('dark')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>{t('system')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {session?.user ? (
                  <div className="flex flex-col gap-4">
                    <Link href={`/${locale}/dashboard/${session.user.role}`} className="flex items-center gap-3 rounded-md border p-2 bg-muted/50">
                      <Image
                        src={profileImage}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
      
                      <div>
                        <p className="font-semibold">{session.user.name}</p>
                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                      </div>
                    </Link>
                    <Button onClick={() => signOut({ callbackUrl: '/' })}>
                      {t('signout')}
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/${locale}/login`}>{t('login')}</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}