'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, CalendarCheck2, Star, PlaneTakeoff, User } from 'lucide-react';
import Link from 'next/link';
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


export default function UserDashboardOverview() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [reviewLength,setReviewLength]=useState<number>(0)
  const [bookfineshed,setbookfineshed]=useState<number>(0)
  const [pendingTours, setPendingTours] = useState<{ _id: string; name: string; status: string }[]>([]);
  const [pendName,setNextTour]=useState<string>("")
  const [allUserBookings,setAllBooks]= useState< IBooking[]>([]);


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
       const filteredtourReview= tourResponse.data.instanceFiltered.filter((tour:Tour) => tour.comments.some((comment:Comment) => comment.userId === userData?._id));
        console.log('reviews are ',filteredtourReview)
        setReviewLength(filteredtourReview.length)
      
        // filter for tours completed

        const bookingResponse=await axios.get('/api/bookings')
        const allUserBooks=bookingResponse.data.instanceFiltered.filter(
          (book: IBooking) => book.user === userData?._id
        );
        setAllBooks(allUserBooks)
        console.log('bookings are',bookingResponse)


        const finishedTours = tourResponse.data.instanceFiltered.filter(
          (tour: Tour) => tour.status === 'finished'
        );

        const pendingTours = tourResponse.data.instanceFiltered.filter(
          (tour: Tour) => tour.status === 'pending'
        );
        
        // Get IDs of finished tours
        const finishedTourIds = finishedTours.map((tour: Tour) => tour._id);
        const pendTourId=pendingTours.map((tour: Tour) => tour._id);
        // Filter bookings for the current user and match finished tour IDs
        const filteredTourCompleted = bookingResponse.data.instanceFiltered.filter(
          (book: IBooking) =>
            book.user === userData?._id && finishedTourIds.includes(book.tour._id)
        );
        const toursPended = bookingResponse.data.instanceFiltered.filter(
          (book: IBooking) =>
            book.user === userData?._id && pendTourId.includes(book.tour._id)
        );
        const pendedingtour=tourResponse.data.instanceFiltered.filter(
          (tour: Tour) => tour._id === toursPended[0]?.tour._id
        );

        console.log('pended tours ',toursPended)
        console.log('pending first tou ',pendedingtour)
        const name=pendedingtour[0]?.name || "No Any "
        setNextTour(name)
        setbookfineshed(filteredTourCompleted.length)
        setPendingTours(toursPended)
        // console.log('tour pending is  is ',toursPended)
        // finishedTours.map((tour)=>console.log(tour)}
        
     
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [session]);
  

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 rounded-2xl shadow-lg animate-fadeIn">
      {/* Greeting */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-emerald-800">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
            {user?.name || "User"}
          </span>
          !
        </h1>
        <p className="text-gray-500 text-lg mt-2">
          Here’s what’s happening with your account today.
        </p>
      </div>
  
      {/* User Info */}
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-md rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-emerald-100">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback className="bg-emerald-500 text-white text-lg font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-bold">{user?.name || "Unknown User"}</CardTitle>
            <p className="text-sm text-gray-500">{user?.email || "unknown@example.com"}</p>
          </div>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>
            Member since:{" "}
            <strong className="text-emerald-700">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </strong>
          </p>
          <p>
            Last login:{" "}
            <span className="font-semibold text-emerald-600">
              {new Date().toLocaleDateString()}
            </span>
          </p>
        </CardContent>
      </Card>
  
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: `${pendingTours.length} Upcoming Trips`,
            subtitle: `Next: ${pendName} Tour`,
            icon: CalendarCheck2,
            color: "from-emerald-400 to-teal-500",
          },
          {
            title: `${reviewLength} Reviews Written`,
            subtitle: "Average Rating: 4.6",
            icon: Star,
            color: "from-blue-400 to-indigo-500",
          },
          {
            title: `${bookfineshed} Completed Tours`,
            subtitle: "Visited: 5 countries",
            icon: PlaneTakeoff,
            color: "from-yellow-400 to-amber-500",
          },
        ].map(({ title, subtitle, icon: Icon, color }) => (
          <Card
            key={title}
            className="border-none shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="flex items-center gap-5 py-6 px-5">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}
              >
                <Icon size={28} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
  
      {/* Recent Bookings */}
      <Card className="shadow-lg rounded-2xl border-none bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allUserBookings?.map((book: IBooking) => (
            <div
              key={book._id}
              className="flex justify-between items-center border-b pb-2 last:border-none hover:bg-emerald-50/50 rounded-lg px-2 transition-all"
            >
              <div>
                <p className="font-medium">{book.tour?.name || "Unnamed Tour"}</p>
                <p className="text-sm text-gray-500">
                  {new Date(book.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              {book.status === "confirmed" ? (
                <Badge className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-300">
                  <CheckCircle className="w-4 h-4" /> Confirmed
                </Badge>
              ) : (
                <Badge variant="outline" className="capitalize">
                  {book.status}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
  
      {/* Membership + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-500">Membership Status:</p>
          <p className="font-semibold text-emerald-700">Gold Member</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:scale-105 transition-transform">
            Upgrade Plan
          </Button>
          <Button
            asChild
            variant="secondary"
            className="shadow hover:scale-105 transition-transform"
          >
            <Link href="/edituser">Edit Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
  
}
