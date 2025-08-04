'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LucideIcon, HelpCircle, Info } from 'lucide-react';
import clsx from 'clsx';

type NavItem = {
  section: string;
  label: string;
  Icon: LucideIcon;
};

type SidebarProps = {
  navItems: NavItem[];
};

export function Sidebar({ navItems }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname(); // e.g., "/dashboard/user" or "/dashboard/admin"
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'admin';

  // Extract the dashboard base path segment dynamically:
  // We assume the path structure is "/dashboard/{role}" or similar
  // So split pathname and get the second segment after "dashboard"
  const pathSegments = pathname?.split('/') || [];
  // e.g. ['', 'dashboard', 'user']
  const dashboardRole = pathSegments[2] || 'user'; // fallback to 'user' if missing

  const handleNavigate = (section: string) => {
    router.push(`/dashboard/${dashboardRole}?section=${section}`);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-300 shadow-lg flex flex-col h-screen mb-25">
      <div className="px-8 py-6 font-extrabold text-2xl tracking-wide text-green-700 border-b border-gray-200 select-none">
        Travel {dashboardRole}
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

      {/* Bottom Static Section */}
      <div className="px-6 py-6 border-t border-gray-200 bg-green-50 select-none flex flex-col gap-4">
        {/* Help Link */}
        <button
          onClick={() => alert('Contact support at support@traveladmin.com')}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold text-sm"
          type="button"
        >
          <HelpCircle className="w-4 h-4" />
          Need help? Contact support
        </button>

        {/* App Version */}
        <div className="flex items-center gap-2 text-xs text-green-600 font-mono select-text">
          <Info className="w-4 h-4" />
          <span>Version 2.3.1</span>
        </div>

        {/* Motivational Quote */}
        <blockquote className="text-xs text-green-700 italic border-l-2 border-green-400 pl-3">
          “Adventure awaits those who dare to explore.”
        </blockquote>
      </div>
    </aside>
  );
}
