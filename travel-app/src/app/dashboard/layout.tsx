// dashboard/layout.tsx
import { Sidebar } from '../../components/dashboardcomponents/Sidebar';
import { Topbar } from '../../components/dashboardcomponents/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
     
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
    
    </div>
  );
}
