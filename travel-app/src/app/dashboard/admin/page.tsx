'use client';

import { useSearchParams } from 'next/navigation';
import { Sidebar } from '../../../components/dashboardcomponents/Sidebar';
import { Topbar } from '../../../components/dashboardcomponents/topbar';
import { Button } from '@/components/ui/button';
import UserTable from '../../../components/dashboardcomponents/admin/usertable';
import GuideManagement from '@/components/dashboardcomponents/admin/guidemanagment';
import BookingsSection from '@/components/dashboardcomponents/admin/bookings';
import ToursManagement from '@/components/dashboardcomponents/admin/tourmangment';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, Map } from 'lucide-react';
import clsx from 'clsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
// Define nav items here and pass to Sidebar
const navItems = [
  { section: 'admin', label: 'Dashboard', Icon: Home },
  { section: 'user', label: 'Users', Icon: Users },
  { section: 'guide', label: 'Guides', Icon: Map },
  { section: 'bookings', label: 'bookings', Icon: Map },
  { section: 'tours', label: 'tours', Icon: Map },
];


const COLORS = ['#10B981', '#F59E0B', '#0EA5E9'];

const userStats = [
  { name: 'Jan', users: 300 },
  { name: 'Feb', users: 450 },
  { name: 'Mar', users: 500 },
];

const tourTypes = [
  { name: 'Cultural', value: 12 },
  { name: 'Hiking', value: 19 },
  { name: 'Wildlife', value: 9 },
];

const guideStats = [
  { name: 'Jan', guides: 10 },
  { name: 'Feb', guides: 16 },
  { name: 'Mar', guides: 14 },
];

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'admin';

  const renderContent = () => {
    switch (section) {
      case 'admin':
        return (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Welcome, Admin!</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Manage all aspects of your tour platform. Use the sidebar to navigate.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-emerald-50 rounded-xl shadow border border-emerald-100">
                <h3 className="text-sm font-semibold text-emerald-700">Total Users</h3>
                <p className="text-2xl font-bold text-emerald-900">1,240</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl shadow border border-yellow-100">
                <h3 className="text-sm font-semibold text-yellow-700">Total Tours</h3>
                <p className="text-2xl font-bold text-yellow-900">85</p>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl shadow border border-sky-100">
                <h3 className="text-sm font-semibold text-sky-700">Active Guides</h3>
                <p className="text-2xl font-bold text-sky-900">32</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">Manage Users</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm">Manage Tours</Button>
              <Button className="bg-sky-500 hover:bg-sky-600 text-white text-sm">Manage Guides</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl shadow border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">User Growth</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userStats}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Tour Types</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tourTypes}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label
                      >
                        {tourTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Guide Activity</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={guideStats}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="guides" fill="#0EA5E9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        );

      case 'user':
        return (
          <section className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            <header className="mb-6">
              <h2 className="text-2xl font-semibold text-teal-800">User Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                View, update, or delete users from the system.
              </p>
            </header>
            <UserTable />
          </section>
        );

      case 'guide':
        return (
          <GuideManagement/>
        );
        case 'bookings':
          return (
            <BookingsSection/>
          );
          case 'tours':
            return (
              <ToursManagement/>
            );

      default:
        return <p className="text-red-600 text-sm">Invalid section.</p>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-stone-100 via-white to-emerald-50">
      {/* Sidebar on top for mobile, side for desktop */}
      <div className="w-full md:w-64 flex-shrink-0">
  <Sidebar navItems={navItems} />
</div>

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
