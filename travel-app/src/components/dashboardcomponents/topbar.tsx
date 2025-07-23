// dashboard/components/Topbar.tsx
import { Bell } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
      <h1 className="text-xl font-semibold">Welcome Admin</h1>
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5" />
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}
