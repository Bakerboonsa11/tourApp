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
          
          // Get IDs of finished tours
          // const finishedTourIds = finishedTours.map((tour: Tour) => tour._id);
          // const pendTourId=pendingTours.map((tour: Tour) => tour._id);
          // Filter bookings for the current user and match finished tour IDs
          // const filteredTourCompleted = bookingResponse.data.instanceFiltered.filter(
          //   (book: IBooking) =>
          //     book.user === userData?._id && finishedTourIds.includes(book.tour._id)
          // );
          // const toursPended = bookingResponse.data.instanceFiltered.filter(
          //   (book: IBooking) =>
          //     book.user === userData?._id && pendTourId.includes(book.tour._id)
          // );
          // const pendedingtour=tourResponse.data.instanceFiltered.filter(
          //   (tour: Tour) => tour._id === toursPended[0]?.tour._id
          // );
         setFineshedTours(finishedTours)
         setPendingTours(pendingTours)
       
          // const name=pendedingtour[0]?.name || "No Any "
          // setNextTour(name)
          // setbookfineshed(filteredTourCompleted.length)
          // setPendingTours(toursPended)
          // console.log('tour pending is  is ',toursPended)
          // finishedTours.map((tour)=>console.log(tour)}
          
       
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      fetchUserData();
    }, [session]);




  const markAsRead = (id: number) => {
    setNotif((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex flex-col min-h-screen max-h-screen p-6 bg-gray-50">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-1">Welcome Back, Guide!</h1>
        <p className="text-gray-600 text-lg">
          Here’s your activity summary and upcoming tours.
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-8 border-blue-500 hover:shadow-lg transition-shadow">
          <ClipboardList className="w-10 h-10 text-blue-600" />
          <div>
            <p className="text-2xl font-semibold text-blue-700">{guidedToursLength}</p>
            <p className="text-blue-600 font-medium">Tours Assigned</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-8 border-teal-500 hover:shadow-lg transition-shadow">
          <Calendar className="w-10 h-10 text-teal-600" />
          <div>
            <p className="text-2xl font-semibold text-teal-700">{bookingThisMonth}</p>
            <p className="text-teal-600 font-medium">Bookings This Month</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-8 border-yellow-400 hover:shadow-lg transition-shadow">
          <Star className="w-10 h-10 text-yellow-500" />
          <div>
            <p className="text-2xl font-semibold text-yellow-600">4.8 / 5</p>
            <p className="text-yellow-500 font-medium">Average Rating</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 max-h-[calc(100vh-320px)] overflow-hidden">
        {/* Upcoming Tours */}
        <section className="bg-white rounded-xl shadow-md p-6 flex-1 overflow-y-auto border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6" /> Upcoming Tours
          </h2>
          {pendingTours.length === 0 ? (
            <p className="text-gray-500">No upcoming tours assigned.</p>
          ) : (
            <ul className="space-y-4">
              {pendingTours.map((tour:Tour) => (
                <li
                  key={tour._id}
                  className="p-4 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <p className="font-semibold text-blue-800">{tour?.name}</p>
                  <p className="text-sm text-blue-600">{tour.createdAt}</p>
                  <p className="text-sm text-blue-600">{tour.location}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent Bookings */}
        <section className="bg-white rounded-xl shadow-md p-6 flex-1 overflow-y-auto border border-teal-200">
          <h2 className="text-2xl font-bold text-teal-700 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" /> Recent Bookings
          </h2>
          {fineshedTour.length === 0 ? (
            <p className="text-gray-500">No recent bookings.</p>
          ) : (
            <ul className="space-y-4">
              {fineshedTour.map((tour:Tour) => (
                <li
                  key={tour._id}
                  className="p-4 bg-teal-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <p className="font-semibold text-teal-800">{tour.duration}</p>
                  <p className="text-sm text-teal-600">{tour.name}</p>
                  <p className="text-sm text-teal-600">{tour.createdAt}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-md p-6 flex-1 overflow-y-auto border border-yellow-300">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications
          </h2>
          {notif.length === 0 ? (
            <p className="text-gray-500">No notifications.</p>
          ) : (
            <ul className="space-y-3">
              {notif.map(({ id, text, read }) => (
                <li
                  key={id}
                  className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                    read ? 'bg-yellow-50 text-yellow-900' : 'bg-yellow-100 text-yellow-800 font-semibold'
                  } hover:bg-yellow-200`}
                  onClick={() => markAsRead(id)}
                >
                  <span>{text}</span>
                  {read ? (
                    <CheckCircle className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-yellow-800" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick Actions */}
      <footer className="mt-8 flex flex-wrap gap-4 justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition"
          onClick={() => alert('Create new tour (not implemented)')}
        >
          Create New Tour
        </button>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition"
          onClick={() => alert('View bookings (not implemented)')}
        >
          View Bookings
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition"
          onClick={() => alert('Check messages (not implemented)')}
        >
          Check Messages
        </button>
      </footer>
    </div>
  );
}
