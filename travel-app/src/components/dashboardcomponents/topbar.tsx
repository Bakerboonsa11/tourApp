'use client';

import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';

type TopbarProps = {
  role: string;
  imageUrl: string;
};

export function Topbar({ role }: TopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white px-6 flex items-center justify-between rounded-xl shadow-lg border border-gray-100">
      {/* Left: Welcome */}
      <h1 className="text-gray-900 text-lg font-medium">
        Welcome, <span className="capitalize text-gray-500">{role}</span>
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
          <Bell className="w-5 h-5" strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
        </button>

        {/* Profile Image */}
        <div className="w-10 h-10 rounded-full border border-gray-200 shadow-md overflow-hidden">
          <img
            src={session?.user?.image ? `/userimages/${session.user.image}` : '/pro.png'}
            alt={`${role} Profile`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/pro.png';
            }}
          />
        </div>
      </div>
    </header>
  );
}
