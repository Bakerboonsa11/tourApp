'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState,useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {

 
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin'|'guide';
  password?: string;
  createdAt: string;
  image:string
}
export default function Navbar() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null);
  

    useEffect(() => {
      const email = session?.user?.email;
      if (!email) return; // ensures it's a string
    
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

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Session loaded:', session);
    }
  }, [status, session]);

  if (status === 'loading') return null;

  const profileImage =user?.image ? `/userimages/${user?.image}`
    :!user?.image?`/userimages/${session?.user.image}`:
     '/pro.png';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto max-w-6xl flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
  <Image
    src="/static/log.png"
    alt="logo"
    width={50} // Increased size
    height={50}
    className="rounded-full object-cover border-2 border-green-500 shadow-md"
  />
  <Link
    href="/"
    className="text-3xl font-bold text-green-700 hover:opacity-90 transition"
  >
 Ethio-Visit
  </Link>
</div>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/tours/All" className="text-gray-700 hover:text-green-600 font-medium">
            Tours
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-green-600 font-medium">
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


<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full p-2
                 bg-gradient-to-r from-amber-400 to-pink-500 
                 dark:from-indigo-500 dark:to-purple-600
                 text-white shadow-lg shadow-amber-500/30 dark:shadow-indigo-500/30
                 hover:shadow-xl hover:scale-105
                 transition-all duration-300 ease-out"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent
    align="end"
    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1"
  >
    <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-amber-100 dark:hover:bg-indigo-600">
      Light
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-amber-100 dark:hover:bg-indigo-600">
      Dark
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-amber-100 dark:hover:bg-indigo-600">
      System
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

  
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
              <Link href="/about" className="text-lg font-medium text-gray-800">
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
