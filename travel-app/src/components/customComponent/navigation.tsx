'use client';

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function Navbar() {
  // const { data: session } = useSession();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      console.log("Session loaded:", session);
    }
  }, [status, session]);

  useEffect(() => {
    console.log("User Role:", session?.user?.role);
  }, [session]);
  


  if (status === "loading") {
    return null; // or show a loading spinner
  }
  







console.log("Session:", session);

  return (
    <header className="sticky top-0 z-50 bg-white-50 ">
      <div className="container mx-auto max-w-5xl flex justify-between items-center p-4">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image  src="/static/log.png" alt="logo" width={100} height={100} className="rounded-full" />
          <Link href="/" className="text-2xl font-bold text-black-600 no-underline">
            Visit Oromia
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/tours/All" className="hover:text-green-700 no-underline text-black">Tours</Link>
          <Link href="/bookings" className="hover:text-green-700 no-underline text-black">About Us</Link>

{session?.user && (
  <Link
    href={`/dashboard/${session.user.role}`}
    className="hover:text-green-700 no-underline text-black"
  >
    Dashboard
  </Link>
)}

          {session?.user ? (
            <div className="flex items-center space-x-4">
              <Image
                src={'/pro.avif'}
                alt="profile"
                width={46}
                height={46}
                className="rounded-full"
              />
                 <Button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out ring-2 ring-green-500 hover:ring-green-700"
                >
                  Sign Out
                </Button>
            </div>
          ) : (
            <Link
            href="/login"
            className="inline-block bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out"
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
              <Link href="/bookings" className="hover:text-green-700 no-underline text-black">About Us</Link>

              <Link href={`/dashboard/${session?.user.role}`} className="text-lg no-underline text-black">Dashboard</Link>

              {session?.user ? (
                <>
                  <div className="flex items-center space-x-3">
                  
                  
                    <Image
                     src={ '/pro.avif'}
                      alt="profile"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <p className="text-sm">{session.user.name}</p>
                  </div>
                  <Button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out ring-2 ring-green-500 hover:ring-green-700"
                >
                  Sign Out
                </Button>

                </>
              ) : (
                <Link
                href="/login"
                className="inline-block bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out"
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
