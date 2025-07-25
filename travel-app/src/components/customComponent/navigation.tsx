'use client';

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  // const { data: session } = useSession();
 
  const { data: session } = useSession();
  console.log("Session Data: in the navigation ", session?.user);



console.log("Session:", session);

  return (
    <header className="sticky top-0 z-50 bg-white-50 ">
      <div className="container mx-auto max-w-5xl flex justify-between items-center p-4">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image  src="/visitoro3.jpg" alt="logo" width={100} height={100} className="rounded-full" />
          <Link href="/" className="text-2xl font-bold text-black-600 no-underline">
            Visit Oromia
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/tours/All" className="hover:text-green-700 no-underline text-black">Tours</Link>
          <Link href="/bookings" className="hover:text-green-700 no-underline text-black">Bookings</Link>
          <Link href="/dashboard/admin" className="hover:text-green-700 no-underline text-black">Dashboard</Link>

          {session?.user ? (
            <div className="flex items-center space-x-4">
              <Image
                src={session.user.image || '/pro.avif'}
                alt="profile"
                width={46}
                height={46}
                className="rounded-full"
              />
              <Button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="bg-black text-white hover:bg-neutral-800"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-black text-white hover:bg-neutral-800 px-4 py-2 rounded-md no-underline"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-lg no-underline text-black">Home</Link>
              <Link href="/tours/All" className="text-lg no-underline text-black">Tours</Link>
              <Link href="/bookings" className="text-lg no-underline text-black">Bookings</Link>
              <Link href="/dashboard/user" className="text-lg no-underline text-black">Dashboard</Link>

              {session?.user ? (
                <>
                  <div className="flex items-center space-x-3">
                  
                  
                    <Image
                     src={`/${session.user.image}` || '/profile.png'}
                      alt="profile"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <p className="text-sm">{session.user.name}</p>
                  </div>
                  <Button 
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className="bg-black text-white hover:bg-neutral-800"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-black text-white hover:bg-neutral-800 w-full">Login</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}
