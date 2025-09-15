'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LucideIcon, HelpCircle, Info } from 'lucide-react';
import clsx from 'clsx';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get('section') || 'admin';
  const locale = useLocale();
  const pathSegments = pathname?.split('/') || [];
  const dashboardRole = pathSegments[3] || 'user';
  const t = useTranslations('sidebar');
  const handleNavigate = (section: string) => {
    router.push(`/${locale}/dashboard/${dashboardRole}?section=${section}`);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 shadow-lg flex-col h-screen">
        {/* Header */}
        <div className="px-8 py-6 font-extrabold text-2xl tracking-wide text-green-700 border-b border-gray-200 select-none">
          {t("header")} {dashboardRole}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-grow px-4 py-6 space-y-1">
          {navItems.map(({ section, label, Icon }: any) => {
            const isActive = currentSection === section;
            return (
              <button
                key={section}
                onClick={() => handleNavigate(section)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 group",
                  isActive
                    ? "bg-green-50 text-green-800 shadow-md border border-green-200"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                )}
              >
                <span
                  className={clsx(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 scale-110"
                      : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-6 py-6 border-t border-gray-200 bg-green-50 select-none flex flex-col gap-4">
          <button
            onClick={() => alert("Contact support at support@traveladmin.com")}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold text-sm"
            type="button"
          >
            <HelpCircle className="w-4 h-4" />
            {t("help")}
          </button>

          <div className="flex items-center gap-2 text-xs text-green-600 font-mono select-text">
            <Info className="w-4 h-4" />
            <span>{t("version")}</span>
          </div>

          <blockquote className="text-xs text-green-700 italic border-l-2 border-green-400 pl-3">
            {t("quote")}
          </blockquote>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg flex justify-around py-2 z-50">
        {navItems.map(({ section, label, Icon }: any) => {
          const isActive = currentSection === section;
          return (
            <button
              key={section}
              onClick={() => handleNavigate(section)}
              className={clsx(
                "flex flex-col items-center justify-center px-3 py-1 text-xs font-medium transition-all duration-300",
                isActive ? "text-green-700" : "text-gray-500 hover:text-green-600"
              )}
            >
              <span
                className={clsx(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 mb-1",
                  isActive
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-700"
                )}
              >
                <Icon className="w-5 h-5" />
              </span>
              {label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
