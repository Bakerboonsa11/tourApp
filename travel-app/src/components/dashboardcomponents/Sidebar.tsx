'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Home, Users, Map } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { section: 'admin', label: 'Dashboard', Icon: Home },
  { section: 'user', label: 'Users', Icon: Users },
  { section: 'guide', label: 'Guides', Icon: Map },
  { section: 'bookings', label: 'bookings', Icon: Map },
  { section: 'tours', label: 'tours', Icon: Map },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'admin';

  const handleNavigate = (section: string) => {
    router.push(`/dashboard/admin?section=${section}`);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-300 shadow-lg flex flex-col h-screen">
      <div className="px-8 py-6 font-extrabold text-2xl tracking-wide text-green-700 border-b border-gray-200 select-none">
        Travel Admin
      </div>
      <nav className="flex flex-col flex-grow px-4 py-6 space-y-1">
        {navItems.map(({ section, label, Icon }) => {
          const isActive = currentSection === section;
          return (
            <button
              key={section}
              onClick={() => handleNavigate(section)}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300',
                isActive
                  ? 'bg-green-100 text-green-800 shadow-inner'
                  : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
              )}
            >
              <Icon
                className={clsx(
                  'w-5 h-5 transition-colors duration-300',
                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'
                )}
              />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500 select-none">
        &copy; 2025 Oromia Tours
      </div>
    </aside>
  );
}
