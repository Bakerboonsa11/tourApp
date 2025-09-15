'use client';

import { useSearchParams } from 'next/navigation';
import { Sidebar } from '../../../../components/dashboardcomponents/Sidebar';
import { Topbar } from '../../../../components/dashboardcomponents/topbar';
import UserDashboardOverview from '../../../../components/dashboardcomponents/user/overView';
import BookingsSection from '../../../../components/dashboardcomponents/user/booking';
import UserProfile from '@/components/dashboardcomponents/user/userProfile';
import ReviewsSection from '@/components/dashboardcomponents/user/review';
import WishlistSection from '@/components/dashboardcomponents/user/wishlist';
import Settings from '../../../../components/dashboardcomponents/user/setting';
import { Home, Users, Map } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';

// === NAVIGATION ITEMS ===


 function AdminDashboardHome() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'user';
  const t = useTranslations('user');

  const navItems = [
    { section: 'user', label: t('nav.dashboard'), Icon: Home },
    { section: 'profile', label: t('nav.profile'), Icon: Users },
    { section: 'bookings', label: t('nav.bookings'), Icon: Map },
    { section: 'reviews', label: t('nav.reviews'), Icon: Users },
    { section: 'wishlist', label: t('nav.wishlist'), Icon: Map },
    { section: 'settings', label: t('nav.settings'), Icon: Users }
  ];
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


export default function UserDashBoard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardHome />
    </Suspense>
  );
}
