'use client';

import { useSearchParams } from 'next/navigation';
import { Sidebar } from '../../../components/dashboardcomponents/Sidebar';
import { Topbar } from '../../../components/dashboardcomponents/topbar';
import UserDashboardOverview from '../../../components/dashboardcomponents/user/overView';
import BookingsSection from '../../../components/dashboardcomponents/user/booking';
import UserProfile from '@/components/dashboardcomponents/user/userProfile';
import ReviewsSection from '@/components/dashboardcomponents/user/review';
import WishlistSection from '@/components/dashboardcomponents/user/wishlist';
import Settings from '../../../components/dashboardcomponents/user/setting';
import { Home, Users, Map } from 'lucide-react';

// === NAVIGATION ITEMS ===
const navItems = [
  { section: 'user', label: 'Dashboard', Icon: Home },
  { section: 'profile', label: 'Profile', Icon: Users },
  { section: 'bookings', label: 'Bookings', Icon: Map },
  { section: 'reviews', label: 'Reviews', Icon: Users },
  { section: 'wishlist', label: 'Wishlist', Icon: Map },
  { section: 'settings', label: 'Settings', Icon: Users },
];

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'user';

  const renderContent = () => {
    switch (section) {
      case 'user':
        return <UserDashboardOverview />;
      case 'profile':
        return <UserProfile />;
      case 'bookings':
        return (
          <section className="max-w-7xl mx-auto">
            <BookingsSection />
          </section>
        );
      case 'reviews':
        return <ReviewsSection />;
      case 'wishlist':
        return <WishlistSection />;
      case 'settings':
        return <Settings />;
      default:
        return <p className="text-red-600 text-sm">Invalid section selected.</p>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-stone-100 via-white to-emerald-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 h-full">
        <Sidebar navItems={navItems} />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col h-screen">
      <Topbar role="User" imageUrl="/images/profile.jpg" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
