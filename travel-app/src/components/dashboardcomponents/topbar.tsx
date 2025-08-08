'use client';

import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';


type TopbarProps = {
  role: string;
  imageUrl: string;
};

export function Topbar({ role, imageUrl }: TopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-gradient-to-r from-emerald-600 to-green-500 px-6 flex items-center justify-between shadow-md border-b border-emerald-700">
      <h1 className="text-white text-xl font-bold tracking-wide">
        Welcome, <span className="capitalize">{role}</span>
      </h1>

      <div className="flex items-center gap-4">
        <button className="relative text-white hover:text-yellow-300 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-300 animate-ping" />
        </button>

        <div className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden">
          <img
            src={`/userimages/${session?.user.image}` || '/pro.png'}
            alt={`${role} Profile`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/pro.png'; // Fallback image
            }}
          />
        </div>
      </div>
    </header>
  );
}
