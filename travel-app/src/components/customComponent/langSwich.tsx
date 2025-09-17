'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (locale: string) => {
    const newPathname = pathname.replace(/^\/(en|am|om)/, `/${locale}`);
    router.push(newPathname);
    setOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Gradient Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex justify-center items-center px-3 py-1 bg-gradient-to-r from-emerald-400 to-green-700 text-white text-sm font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-green-500 hover:to-emerald-600 focus:outline-none"
      >
        🌐 Lang
        <span className={`ml-2 inline-block transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden z-50 transform transition-all duration-300 origin-top ${
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <ul className="py-1">
          <li>
            <button
              onClick={() => changeLanguage('en')}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-700 transition-all text-sm font-medium"
            >
              English
            </button>
          </li>
          <li>
            <button
              onClick={() => changeLanguage('am')}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-700 transition-all text-sm font-medium"
            >
              Amharic
            </button>
          </li>
          <li>
            <button
              onClick={() => changeLanguage('om')}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-700 transition-all text-sm font-medium"
            >
              Afaan Oromo
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
