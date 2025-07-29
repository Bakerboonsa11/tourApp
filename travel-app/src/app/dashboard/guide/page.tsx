'use client';

import { useSearchParams } from 'next/navigation';
import { Sidebar } from '../../../components/dashboardcomponents/Sidebar';
import { Topbar } from '../../../components/dashboardcomponents/topbar';
import GuideLocations from '../../../components/dashboardcomponents/guide/location';
import GuideBookings from '../../../components/dashboardcomponents/guide/bookings';
import GuideSettings from '../../../components/dashboardcomponents/guide/setting';
import { Home, Users, MapPin, Calendar, ClipboardList } from 'lucide-react';
import GuideDashboardOverview from '../../../components/dashboardcomponents/guide/overview';
import GuideProfile from '../../../components/dashboardcomponents/guide/profile';
import GuideMyTours from '../../../components/dashboardcomponents/guide/mytours';

// import { Home, Users, Map } from 'lucide-react';

// Define nav items here and pass to Sidebar

const navItems = [
  { section: 'guide', label: 'Dashboard', Icon: Home },
  { section: 'profile', label: 'My Profile', Icon: Users },
  { section: 'assignedTours', label: 'My Tours', Icon: ClipboardList },
  { section: 'bookings', label: 'Bookings', Icon: Calendar },
  { section: 'locations', label: 'Locations', Icon: MapPin },
  { section: 'settings', label: 'Settings', Icon: Users },
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
      case 'guide':
        return (
          <GuideDashboardOverview/>
        );

      case 'profile':
        return (
         <GuideProfile/>
        );

      case 'locations':
        return (
          <GuideLocations/>
        );
        case 'bookings':
          return (
            <GuideBookings/>
          );
          case 'settings':
            return (
              <GuideSettings/>
            );
          case 'assignedTours':
            return (
              <GuideMyTours/>
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
  
      {/* Content area */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
  
}
