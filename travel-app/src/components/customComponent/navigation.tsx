'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Session loaded:', session);
    }
  }, [status, session]);

  if (status === 'loading') return null;

  const profileImage = session?.user?.image
    ? `/userimages/${session.user.image}`
    : '/pro.png';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto max-w-6xl flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/static/log.png"
            alt="logo"
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <Link
            href="/"
            className="text-2xl font-bold text-green-700 hover:opacity-90 transition"
          >
            Visit Oromia
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/tours/All" className="text-gray-700 hover:text-green-600 font-medium">
            Tours
          </Link>
          <Link href="/bookings" className="text-gray-700 hover:text-green-600 font-medium">
            About Us
          </Link>

          {session?.user && (
            <Link
              href={`/dashboard/${session.user.role}`}
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Dashboard
            </Link>
          )}

          {session?.user ? (
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src={profileImage}
                  alt="profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-700 hover:scale-105 transition-all"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-700 hover:scale-105 transition-all"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-6">
            <div className="flex flex-col space-y-5">
              <Link href="/" className="text-lg font-medium text-gray-800">
                Home
              </Link>
              <Link href="/tours/All" className="text-lg font-medium text-gray-800">
                Tours
              </Link>
              <Link href="/bookings" className="text-lg font-medium text-gray-800">
                About Us
              </Link>

              {session?.user && (
                <Link
                  href={`/dashboard/${session.user.role}`}
                  className="text-lg font-medium text-gray-800"
                >
                  Dashboard
                </Link>
              )}

              {session?.user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300">
                      <Image
                        src={profileImage}
                        alt="profile"
                        width={36}
                        height={36}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-sm text-gray-700">{session.user.name}</span>
                  </div>
                  <Button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-green-700 transition"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-green-700 transition text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
