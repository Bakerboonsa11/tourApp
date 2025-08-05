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
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-700">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here’s what’s happening with your account today.
        </p>
      </div>

      {/* User Info */}
      <Card className="border-emerald-100 shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user?.name || 'Unknown User'}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {user?.email || 'unknown@example.com'}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Member since:{' '}
            <strong>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Unknown'}
            </strong>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Last login:{' '}
            <span className="font-semibold text-emerald-600">
              {new Date().toLocaleDateString()} {/* You could replace this with real last login if available */}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-none shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <CalendarCheck2 className="text-emerald-700" size={32} />
            <div>
              <h3 className="text-lg font-semibold">{pendingTours.length} Upcoming Trips</h3>
              <p className="text-muted-foreground text-sm mt-3 ">
                Next: <span className="text-primary font-semibold bg-primary/10 px-2 py-1 rounded-lg ml-1">{pendName} Tour</span>
            </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-none shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <Star className="text-blue-600" size={32} />
            <div>
              <h3 className="text-lg font-semibold">{reviewLength} Reviews Written</h3>
              <p className="text-muted-foreground text-sm">Average Rating: 4.6</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-none shadow-sm">
          <CardContent className="flex items-center gap-4 py-6">
            <PlaneTakeoff className="text-yellow-500" size={32} />
            <div>
              <h3 className="text-lg font-semibold">{bookfineshed } Completed Tours</h3>
              <p className="text-muted-foreground text-sm">Visited: 5 countries</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
  <CardHeader>
    <CardTitle>Recent Bookings</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {allUserBookings?.map((book:IBooking) => (
      <div
        key={book._id}
        className="flex justify-between items-center border-b pb-2 last:border-none"
      >
        <div>
          <p className="font-medium">
            {book.tour?.name || 'Unnamed Tour'}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(book.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        {book.status === 'confirmed' ? (
          <Badge className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-300">
            <CheckCircle className="w-4 h-4" />
            Confirmed
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
          <p className="text-muted-foreground text-sm">Membership Status:</p>
          <p className="font-semibold text-emerald-700">Gold Member</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default">Upgrade Plan</Button>
          <Button asChild variant="secondary">
  <Link href="/edituser">Edit Profile</Link>
</Button>      
          
           </div>
      </div>
    </div>
  );
}
