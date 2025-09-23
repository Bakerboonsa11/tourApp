'use client';

import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sidebar } from '../../../../components/dashboardcomponents/Sidebar';
import { Topbar } from '../../../../components/dashboardcomponents/topbar';
import { Button } from '@/components/ui/button';
import UserTable from '../../../../components/dashboardcomponents/admin/usertable';
import GuideManagement from '@/components/dashboardcomponents/admin/guidemanagment';
import BookingsSection from '@/components/dashboardcomponents/admin/bookings';
import ToursManagement from '@/components/dashboardcomponents/admin/tourmangment';
import { Home, Users, Map } from 'lucide-react';
import { useEffect,useState,Suspense } from 'react';
import { useRouter } from 'next/navigation'; // ✅ CORRECT for App Router
import { useLocale } from 'next-intl';
import axios from 'axios';
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
  Legend,
  CartesianGrid,
} from 'recharts';
import { useTranslations } from 'next-intl';

// #### TYPES AND INTERFACES ####

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
};

interface Tour {
  _id: string;
  status: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  coverImage: string;
  location: {
    type?: string;
    coordinates?: number[];
    description?: string;
    address?: string;
  };
  startDates: string[];
  endDate: string;
  likes: string[];
  comments: {
    user: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
  guides: string[];
  __v: number;
}

interface Transaction {
  tx_ref: string;
  payment_method: string;
  payment_status: string;
  payment_date: Date;
}

interface IBooking {
  _id: string;
  tour: Tour;
  user: string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: Transaction;
  createdAt: Date | string;
  updatedAt: Date | string;
}

import {
  Globe2,
  Compass,
  CalendarCheck,
} from 'lucide-react';

// #### COMPONENT ####

function AdminDashboardHome() {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const t = useTranslations('admin');

  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState<User[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [activeGuide, setactiveGuide] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Chart-specific states
  const [userStats, setUserStats] = useState<object[]>([]);
  const [tourTypes, setTourTypes] = useState<{ [key: string]: number }>({});
  const [guideStats, setGuideStats] = useState<{ name: string; guides: number }[]>([]);
  const [bookingStats, setBookingStats] = useState<{ name: string; bookings: number }[]>([]);
  const [mostLikedTours, setMostLikedTours] = useState<{ name: string; likes: number }[]>([]);
  const [mostBookedTours, setMostBookedTours] = useState<{ name: string; bookings: number }[]>([]);

  const navItems = [
    { section: 'admin', label: t('nav.dashboard'), Icon: Home },
    { section: 'user', label: t('nav.users'), Icon: Users },
    { section: 'guide', label: t('nav.guides'), Icon: Compass },
    { section: 'bookings', label: t('nav.bookings'), Icon: CalendarCheck },
    { section: 'tours', label: t('nav.tours'), Icon: Globe2 },
  ];

  const handleNavigate = (section: string) => {
    router.push(`/${locale}/dashboard/admin/?section=${section}`);
  };

  // --- DATA FETCHING & PROCESSING ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, toursRes, bookingsRes] = await Promise.all([
          axios.get('/api/user'),
          axios.get('/api/tours'),
          axios.get('/api/bookings'),
        ]);

        const allUsers = usersRes.data.instanceFiltered || [];
        const allTours = toursRes.data.instanceFiltered || [];
        const allBookings = bookingsRes.data.instanceFiltered || [];

        setUsers(allUsers);
        setTours(allTours);
        setBookings(allBookings);

        // --- Process data for charts ---
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // User & Guide stats
        const userCounts: { [key: string]: number } = {};
        const guideCounts: { [key: string]: number } = {};
        allUsers.forEach((user: User) => {
          const month = monthNames[new Date(user.createdAt).getMonth()];
          if (user.role === 'guide') {
            guideCounts[month] = (guideCounts[month] || 0) + 1;
          }
          userCounts[month] = (userCounts[month] || 0) + 1;
        });
        setUserStats(monthNames.map(month => ({ name: month, users: userCounts[month] || 0 })));
        setGuideStats(monthNames.map(month => ({ name: month, guides: guideCounts[month] || 0 })));
        setactiveGuide(allUsers.filter((user: User) => user.role === 'guide').length);

        // Tour type distribution
        const tourTypeCounts: { [key: string]: number } = {};
        allTours.forEach((tour: Tour) => {
          tour.typeOfTour.forEach((type) => {
            tourTypeCounts[type] = (tourTypeCounts[type] || 0) + 1;
          });
        });
        setTourTypes(tourTypeCounts);

        // Monthly booking stats
        const bookingCounts: { [key: string]: number } = {};
        allBookings.forEach((booking: IBooking) => {
          const month = monthNames[new Date(booking.createdAt).getMonth()];
          bookingCounts[month] = (bookingCounts[month] || 0) + 1;
        });
        setBookingStats(monthNames.map(month => ({ name: month, bookings: bookingCounts[month] || 0 })));

        // Most liked tours
        const sortedByLikes = [...allTours]
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 5);
        setMostLikedTours(sortedByLikes.map(tour => ({ name: tour.name, likes: tour.likes?.length || 0 })));

        // Most booked tours
        const bookingCountsByTour: { [key: string]: { name: string; count: number } } = {};
        allBookings.forEach((booking: IBooking) => {
          const tourId = booking.tour?._id;
          if (tourId) {
            if (!bookingCountsByTour[tourId]) {
              bookingCountsByTour[tourId] = { name: booking.tour.name, count: 0 };
            }
            bookingCountsByTour[tourId].count++;
          }
        });
        const sortedByBookings = Object.values(bookingCountsByTour)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map(item => ({ name: item.name, bookings: item.count }));
        setMostBookedTours(sortedByBookings);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const tourTypesChartData = Object.entries(tourTypes).map(([name, value]) => ({ name, value }));

  // --- RENDER LOGIC ---
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'admin';

  const renderContent = () => {
    switch (section) {
      case 'admin':
        return (
          <section className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">{t('welcome')}, {session?.user?.name}!</h2>
            <p className="text-gray-600 mb-6 text-sm">{t('manageText')}</p>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-emerald-50 rounded-xl shadow border border-emerald-100"><h3 className="text-sm font-semibold text-emerald-700">{t('totalUsers')}</h3><p className="text-2xl font-bold text-emerald-900">{users.length}</p></div>
              <div className="p-4 bg-yellow-50 rounded-xl shadow border border-yellow-100"><h3 className="text-sm font-semibold text-yellow-700">{t('totalTours')}</h3><p className="text-2xl font-bold text-yellow-900">{tours.length}</p></div>
              <div className="p-4 bg-sky-50 rounded-xl shadow border border-sky-100"><h3 className="text-sm font-semibold text-sky-700">{t('activeGuides')}</h3><p className="text-2xl font-bold text-sky-900">{activeGuide}</p></div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button onClick={() => handleNavigate("user")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">{t('manageUsers')}</Button>
              <Button onClick={() => handleNavigate("tours")} className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm">{t('manageTours')}</Button>
              <Button onClick={() => handleNavigate("guide")} className="bg-sky-500 hover:bg-sky-600 text-white text-sm">{t('manageGuides')}</Button>
            </div>

            {/* CHARTS - ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* USER GROWTH */}
              <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100"><h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs">💚</span>{t('userGrowth')}</h4><div className="h-60 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={userStats}><XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} /><Bar dataKey="users" fill="#34D399" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
              {/* TOUR TYPES */}
              <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100"><h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white text-xs">📊</span>{t('tourTypes')}</h4><div className="h-60 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={tourTypesChartData}><XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} /><Bar dataKey="value" fill="#F59E0B" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
              {/* GUIDE ACTIVITY */}
              <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100"><h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-white text-xs">🧭</span>{t('guideActivity')}</h4><div className="h-60 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={guideStats}><XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe' }} /><Bar dataKey="guides" fill="#0EA5E9" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
            </div>

            {/* CHARTS - ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {/* BOOKINGS GROWTH */}
              <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100"><h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white text-xs">📅</span>Monthly Bookings</h4><div className="h-60 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={bookingStats}><XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} /><Bar dataKey="bookings" fill="#14B8A6" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
              
              {/* MOST LIKED TOURS */}
              <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100"><h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs">❤️</span>Most Liked Tours</h4><div className="h-60 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={mostLikedTours} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}><XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={70} /><YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="likes" fill="#F43F5E" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>

              {/* MOST BOOKED TOURS */}
              <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-100"><h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs">🔥</span>Most Booked Tours</h4><div className="h-60 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={mostBookedTours} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}><XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={70} /><YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '12px' }} /><Bar dataKey="bookings" fill="#F59E0B" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-10">
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow hover:shadow-lg border"><div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-xl font-bold">📘</div><div><h4 className="text-sm font-semibold text-gray-700">{t('totalGuides')}</h4><p className="text-xs text-gray-500 mt-1">{users.filter((t) => t.role === "guide").length}</p></div></div>
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow hover:shadow-lg border"><div className="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xl font-bold">🧭</div><div><h4 className="text-sm font-semibold text-gray-700">{t('activeRegions')}</h4><p className="text-xs text-gray-500 mt-1">{tours.length} regions covered</p></div></div>
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow hover:shadow-lg border"><div className="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">🌟</div><div><h4 className="text-sm font-semibold text-gray-700">{t('topLiked')}</h4><p className="text-xs text-gray-500 mt-1">{mostLikedTours[0] ? `${mostLikedTours[0].likes} ${mostLikedTours[0].name}` : 'N/A'}</p></div></div>
            </div>
          </section>
        );

      case 'user':
        return <section className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 max-w-7xl mx-auto"><header className="mb-6"><h2 className="text-2xl font-semibold text-teal-800">User Management</h2><p className="text-sm text-gray-600 mt-1">View, update, or delete users from the system.</p></header><UserTable /></section>;

      case 'guide':
        return <GuideManagement />;
      case 'bookings':
        return <BookingsSection />;
      case 'tours':
        return <ToursManagement />;

      default:
        return <p className="text-red-600 text-sm">Invalid section.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-stone-100 via-white to-emerald-50">
        <Sidebar navItems={navItems} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Topbar role="Admin" imageUrl="/images/profile.jpg" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function AdimDashbord() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardHome />
    </Suspense>
  );
}