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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

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
      <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
     {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            // Base style
            "relative px-1 py-2 transition-all duration-300",
            // Hover + active color transitions
            "text-muted-foreground hover:text-emerald-500 dark:hover:text-emerald-400",
            pathname.startsWith(link.href)
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {/* Label */}
          <span className="relative z-10">{link.label}</span>

          {/* Hover underline effect */}
          <span
            className={cn(
              "absolute left-0 bottom-0 w-full h-[2px] rounded-full bg-emerald-500 dark:bg-emerald-400 transform scale-x-0 origin-right transition-transform duration-300 ease-out",
              "group-hover:scale-x-100 group-hover:origin-left",
              pathname.startsWith(link.href) && "scale-x-100 origin-left"
            )}
          ></span>

          {/* Soft glowing hover background */}
          <span
            className="absolute inset-0 -z-10 opacity-0 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-md blur-sm transition-opacity duration-500 group-hover:opacity-100"
          ></span>
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
                    onClick={async () => {
                      await signOut({ redirect: false });
                      window.location.href = '/';
                      handleLinkClick();
                    }}
                    className="
                      relative overflow-hidden rounded-lg 
                      bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                      text-white font-semibold px-6 py-3
                      shadow-lg hover:shadow-xl 
                      transition-all duration-300 ease-out
                      hover:scale-[1.05] active:scale-95
                    "
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🚪 {t('signout')}
                    </span>

                    {/* subtle glowing effect */}
                    <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
                  </Button>
            </div>
          ) : (
           <Button
  asChild
  className="
    relative overflow-hidden rounded-lg
    bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500
    text-white font-semibold px-6 py-3
    shadow-lg hover:shadow-emerald-500/40
    transition-all duration-300 ease-out
    hover:scale-[1.05] active:scale-95
  "
>
  <Link href={`/${locale}/login`} className="flex items-center gap-2 relative z-10">
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='w-5 h-5'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M10 16l4-4m0 0l-4-4m4 4H3m13 4v1a2 2 0 002 2h4a2 2 0 002-2V7a2 2 0 00-2-2h-4a2 2 0 00-2 2v1'
      />
    </svg>
    {t('login')}
      {/* Subtle glossy shine */}
  <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
  </Link>
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
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col p-0">
              <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: "url('/static/ethio4.webp')" }}>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-white">Visit-Ethio</h2>
                </div>
              </div>
              <nav className="mt-6 flex flex-col gap-6 px-6">
                <Link href={`/${lang}`} className="flex items-center gap-3 mb-4" onClick={handleLinkClick}>
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
                    onClick={handleLinkClick}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith(link.href) ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4 p-6 border-t">
                <LanguageSwitcher />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-center">
                      <Sun className="h-5 w-5 mr-2 dark:hidden" />
                      <Moon className="h-5 w-5 mr-2 hidden dark:block" />
                      <span>{t('toggleTheme')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[248px]">
                    <DropdownMenuItem onClick={() => setTheme("light")}>{t('light')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>{t('dark')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>{t('system')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {session?.user ? (
                  <div className="flex flex-col gap-4">
                    <Link href={`/${locale}/dashboard/${session.user.role}`} onClick={handleLinkClick} className="flex items-center gap-3 rounded-md border p-2 bg-muted/50">
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
                   <Button
                    onClick={async () => {
                      await signOut({ redirect: false });
                      window.location.href = '/';
                      handleLinkClick();
                    }}
                    className="
                      relative overflow-hidden rounded-lg 
                      bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                      text-white font-semibold px-6 py-3
                      shadow-lg hover:shadow-xl 
                      transition-all duration-300 ease-out
                      hover:scale-[1.05] active:scale-95
                    "
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🚪 {t('signout')}
                    </span>

                    {/* subtle glowing effect */}
                    <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
                  </Button>

                  </div>
                ) : (
               <Button
                asChild
                className="relative overflow-hidden bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-white font-semibold transition-all duration-300 rounded-xl hover:scale-105 hover:shadow-[0_0_15px_rgba(16,185,129,0.6)] active:scale-95"
              >
                {/* Must be a single React element inside Button when using asChild */}
                <Link
                  href={`/${locale}/login`}
                  className="flex items-center justify-center gap-2 px-4 py-2"
                >
                  {t('login')}
                </Link>
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
