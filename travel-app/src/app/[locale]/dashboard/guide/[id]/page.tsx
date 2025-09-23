'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl';

interface Tour {
  _id: string;
  name: string;
  startDates: string[];
  duration: number;
  guides: string[];
} 
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
};
   

// };
type Booking = {
  _id: string;
  tour: {
    _id: string;
    name: string;
    // Add other tour fields if needed
  };
  user: string; // reference to the User document (_id)
  email: string;
  price: number;
  paid: boolean;
  status: "confirmed" | "pending" | "cancelled"; // assuming other possible statuses
  transaction: string; // if you know the shape, define it more precisely
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export default function GuideDetailPage() {


  const { id } = useParams();
  const [guidedTours, setGuidedTours] = useState<Tour[]>([]);
  const [bookings, setbookings] = useState<Booking[]>([]);
  const [guide, setGuide] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations('guideDetail');

   useEffect(() => {
      const fetchAllData = async () => {
        try {
          const usersRes = await axios.get('/api/user');
          const filteredGuides = usersRes.data.instanceFiltered
            .filter((user: User) => user.role === 'guide' && user._id == id)
            .map((user: User) => ({
              id: user._id,
              name: user.name,
              email: user.email,
              photo: user.image,
              status: 'active',
            }));
          setGuide(filteredGuides[0]);
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllData();
    }, [id]);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await axios.get('/api/tours');
        const allTours: Tour[] = response.data.instanceFiltered;
           
        const finishedTours = allTours.filter((tour) => {
          const isGuide = tour.guides.includes(id as string);
          console.log('id is',id)
          console.log('Tour:', tour, 'isGuide:', isGuide);
          if (!isGuide || !tour.startDates[0]) return false;

          const startDate = new Date(tour.startDates[0]);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + tour.duration);

          const now = new Date();
          return now > endDate;
        });

        setGuidedTours(finishedTours);
      } catch (error) {
        console.error('Error fetching guide data:', error);
        setGuidedTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, [id]);

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        const response = await axios.get('/api/bookings');
        const allBookings= response.data.instanceFiltered;
        console.log('All Bookings:', allBookings);
        console.log('Guide ID:', id);
        console.log('user is is ',allBookings[0].user);
        const guideBookings = allBookings.filter((booking: Booking) => booking.user === id);
       console.log('Guide Bookings uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu:', guideBookings);
        setbookings(guideBookings);
      } catch (error) {
        console.error('Error fetching guide data:', error);
        setGuidedTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsData();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* GUIDE CARD */}
      <Card className="flex items-center gap-6 p-6 shadow-xl rounded-2xl border">
        <Image
          src={'/profile.png'} // Assuming you have a default image or can fetch it from the user object
          alt={"profile image"}
          width={100}
          height={100}
          className="rounded-full border object-cover"
        />
        <div>
          <h2 className="text-3xl font-semibold text-cyan-800">{guide?.name}</h2>
          <p className="text-sm text-muted-foreground">{guide?.email}</p>
          <span className="mt-2 inline-block text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full">
            {guide?.role}
          </span>
          <p className="text-xs text-gray-500 mt-1">{t('joined')}: {guide?.createdAt}</p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* FINISHED GUIDED TOURS */}
        <Card>
          <CardHeader>
            <CardTitle>{t('toursGuided')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </>
            ) : guidedTours.length > 0 ? (
              guidedTours.map((tour) => (
                <p key={tour._id} className="text-gray-600 text-sm">
                  {tour.name}

                </p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">{t('noFinishedTours')}</p>
            )}
          </CardContent>
        </Card>

        {/* DUMMY BOOKED TOURS */}
        <Card>
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-cyan-900">{t('toursBooked')}</CardTitle>
  </CardHeader>
  <CardContent className="grid gap-4">
    {loading ? (
      <>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </>
    ) : bookings.length > 0 ? (
      bookings.map((book, i) => (
        <Link
          href={`/${locale}/detail/${book.tour._id}`}
          key={i}
          className="block"
        >
          <div className="flex items-center gap-4 bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition cursor-pointer">
            <Image
              src="/harar.jpg"
              alt="Tour image"
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{book.tour.name}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium">{t('price')}:</span> ETB {book.price} &bull;{" "}
                <span className="font-medium">{t('status')}:</span> {book.status}
              </p>
              <p className="text-xs text-gray-400">
                {t('bookedOn')} {new Date(book.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                book.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : book.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {book.status}
            </span>
          </div>
        </Link>
      ))
    ) : (
      <p className="text-sm text-gray-500">{t('noBookings')}.</p>
    )}
  </CardContent>
       </Card>


      </div>
    </div>
  );
}
