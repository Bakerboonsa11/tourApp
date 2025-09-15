'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Bell,
  CheckCircle,
  ClipboardList,
  MessageSquare,
} from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin'|'guide';
  password?: string;
  createdAt: string;
}
type Tour = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  coverImage: string;
  location: string;
  startDates: string[];
  endDate: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  guides: string[];
  status:string
};
export interface Comment {
  message: string;
  userId: string;
  userImage: string;
  name:string;
  createdAt: string; // ISO date string
}
export interface IBooking {
  _id: string;
  tour: {
    _id:string
    name:string
  };// Simplified for display
  user: string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: unknown;
  createdAt: string;
  updatedAt: string;

}
const upcomingTours = [
  { id: 1, name: 'Mount Kilimanjaro Trek', date: 'Aug 10, 2025', location: 'Tanzania' },
  { id: 2, name: 'Nile River Cruise', date: 'Sep 05, 2025', location: 'Egypt' },
  { id: 3, name: 'Safari Adventure', date: 'Sep 20, 2025', location: 'Kenya' },
];

const recentBookings = [
  { id: 1, customer: 'Alice Johnson', tour: 'Mount Kilimanjaro Trek', date: 'July 25, 2025' },
  { id: 2, customer: 'Mark Lee', tour: 'Nile River Cruise', date: 'July 26, 2025' },
  { id: 3, customer: 'Sofia Patel', tour: 'Safari Adventure', date: 'July 27, 2025' },
];

const notifications = [
  { id: 1, text: 'New message from Alice Johnson', read: false },
  { id: 2, text: 'Booking confirmed: Safari Adventure', read: true },
  { id: 3, text: 'Update: Kilimanjaro Trek itinerary changed', read: false },
];

export default function GuideDashboardOverview() {
  const [notif, setNotif] = useState(notifications);


   const { data: session } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [guidedToursLength,setGuidedTourLength]=useState<number>(0)
    const [bookingThisMonth,setBokingThisMonth]=useState<number>(0)
    const [pendingTours, setPendingTours] = useState< Tour[]>([]);
    const [fineshedTour,setFineshedTours]=useState< Tour[]>([]);
    const t = useTranslations('guideDashboard');
  
    useEffect(() => {
      const email = session?.user?.email;
      if (!email) return; // ensures it's a string
    
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
          const userData: User = response.data.data;
          setUser(userData);
  
          // find tours
          const tourResponse =await axios.get(`/api/tours`);
          console.log(tourResponse.data)
  
      //  filter for number of tours
      const filteredtourGuided = tourResponse.data.instanceFiltered.filter(
        (tour: Tour) => tour.guides.some((guide: string) => guide === userData?._id)
      );
                console.log('guideds are  are ',filteredtourGuided)
          setGuidedTourLength(filteredtourGuided.length)
          const bookingResponse=await axios.get('/api/bookings')

        
          // filter for tours completed this month
          const tourIds = filteredtourGuided.map((tour: Tour) => tour._id);

          const now = new Date();
          const currentMonth = now.getMonth(); // 0-indexed: Jan = 0
          const currentYear = now.getFullYear();
          
          const relatedBookingsThisMonth = bookingResponse.data.instanceFiltered.filter(
            (booking: IBooking) => {
              const bookingDate = new Date(booking.createdAt);
              const sameTour = tourIds.includes(booking.tour._id);
              const sameMonth =
                bookingDate.getMonth() === currentMonth &&
                bookingDate.getFullYear() === currentYear;
              return sameTour && sameMonth;
            }
          );
          
          
  
      
          setBokingThisMonth(relatedBookingsThisMonth.length)
          console.log('bookings are',bookingResponse)
  
        //  find pending and fineshd tours of guide 
        console.log('tours of guide is ',filteredtourGuided)
          const finishedTours = filteredtourGuided.filter(
            (tour: Tour) => tour.status === 'finished'
          );
  
          const pendingTours = filteredtourGuided.filter(
            (tour: Tour) => tour.status === 'pending'
          );
          
         
          // );
         setFineshedTours(finishedTours)
         setPendingTours(pendingTours)
       
        
       
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      fetchUserData();
    }, [session]);




  const markAsRead = (id: number) => {
    setNotif((prev) =>
      prev?.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-emerald-200 via-white to-cyan-100 animate-gradient">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg">
          {t('overview.welcomeBack')},{" "}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            {t('overview.guide')}
          </span>
          !
        </h1>
        <p className="text-gray-600 text-lg mt-3">{t('overview.latestActivity')}</p>
      </header>
  
      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          {
            title: t('overview.toursAssigned'),
            value: guidedToursLength || 0,
            icon: ClipboardList,
            color: 'from-blue-500 to-indigo-600',
          },
          {
            title: t('overview.bookingsThisMonth'),
            value: bookingThisMonth || 0,
            icon: Calendar,
            color: 'from-teal-500 to-emerald-600',
          },
          {
            title: t('overview.averageRating'),
            value: '4.8 / 5',
            icon: Star,
            color: 'from-yellow-400 to-orange-500',
          },
        ].map(({ title, value, icon: Icon, color }) => (
          <div
            key={title}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 flex items-center gap-6 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300"
          >
            <span
              className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
            >
              <Icon className="w-7 h-7" />
            </span>
            <div>
              <p className="text-4xl font-bold text-gray-900">{value}</p>
              <p className="text-gray-500">{title}</p>
            </div>
          </div>
        ))}
      </section>
  
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 max-h-[calc(100vh-320px)] overflow-hidden">
        {/* Upcoming Tours */}
        <section className="glass-card flex-1">
          <h2 className="section-title text-emerald-600">
            <MapPin className="w-6 h-6 text-emerald-500" /> {t('overview.upcomingTours')}
          </h2>
          {pendingTours?.length === 0 ? (
            <p className="empty-text">{t('overview.noUpcomingTours')}</p>
          ) : (
            <ul className="space-y-4">
              {pendingTours?.map((tour: Tour) => (
                <li
                  key={String(tour._id)}
                  className="item-card from-emerald-50 to-teal-50"
                >
                  <p className="font-semibold text-gray-800">{tour?.name}</p>
                  <p className="text-sm text-gray-500">{String(tour.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
  
        {/* Recent Bookings */}
        <section className="glass-card flex-1">
          <h2 className="section-title text-teal-600">
            <Users className="w-6 h-6 text-teal-500" /> {t('overview.recentBookings')}
          </h2>
          {fineshedTour.length === 0 ? (
            <p className="empty-text">{t('overview.noRecentBookings')}</p>
          ) : (
            <ul className="space-y-4">
              {fineshedTour.map((tour: Tour) => (
                <li
                  key={String(tour._id)}
                  className="item-card from-teal-50 to-emerald-50"
                >
                  <p className="font-semibold text-gray-800">{tour.duration}</p>
                  <p className="text-sm text-gray-500">{tour.name}</p>
                  <p className="text-sm text-gray-500">{String(tour.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
  
        {/* Notifications */}
        <section className="glass-card flex-1">
          <h2 className="section-title text-amber-600">
            <Bell className="w-6 h-6 text-amber-500" /> {t('overview.notifications')}
          </h2>
          {notif.length === 0 ? (
            <p className="empty-text">{t('overview.noNotifications')}</p>
          ) : (
            <ul className="space-y-4">
              {notif.map(({ id, text, read }) => (
                <li
                  key={id}
                  onClick={() => markAsRead(id)}
                  className={`p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all ${
                    read
                      ? 'bg-amber-50 text-gray-700'
                      : 'bg-amber-100/90 text-gray-900 font-medium'
                  } hover:shadow-lg hover:scale-105`}
                >
                  <span>{text}</span>
                  {read ? (
                    <CheckCircle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
  
      {/* Quick Actions */}
      <footer className="mt-10 flex flex-wrap gap-5 justify-center">
        {[
          { label: t('overview.createNewTour'), colors: 'from-blue-500 to-indigo-500' },
          { label: t('overview.viewBookings'), colors: 'from-emerald-500 to-teal-500' },
          { label: t('overview.checkMessages'), colors: 'from-amber-400 to-yellow-500' },
        ].map(({ label, colors }) => (
          <button
            key={label}
            className={`bg-gradient-to-r ${colors} text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
            onClick={() => alert(`${label} (not implemented)`)}
          >
            {label}
          </button>
        ))}
      </footer>
    </div>
  );
  

/* Extra Tailwind classes */


  
}
