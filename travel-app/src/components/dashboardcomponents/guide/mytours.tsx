'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guide';
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
  status: string;
};

export interface Comment {
  message: string;
  userId: string;
  userImage: string;
  name: string;
  createdAt: string; // ISO date string
}

export default function GuideMyTours() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [toursOfGuide, setToursOfGuide] = useState<Tour[]>([]);

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
        const userData: User = response.data.data;
        setUser(userData);

        const tourResponse = await axios.get(`/api/tours`);
        console.log(tourResponse.data);

        const filteredtourGuided = tourResponse.data.instanceFiltered.filter(
          (tour: Tour) => tour.guides.some((guide: string) => guide === userData._id)
        );
        console.log('guideds are  are ', filteredtourGuided);
        setToursOfGuide(filteredtourGuided);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session]);

  // Helper function to get status style classes
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'finished':
        return 'bg-red-600 text-white';
      case 'pending':
        return 'bg-green-600 text-white';
      case 'active':
        return 'bg-green-300 text-green-900';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-tr from-white via-green-50 to-green-100 flex flex-col">
      {/* Sticky Header */}
      <div className="p-6 bg-white shadow-md sticky top-0 z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center">🌿 My Guided Tours</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {toursOfGuide.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">You currently have no assigned tours.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-10">
            {toursOfGuide.map((tour) => (
              <div
                key={tour._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={`/toursphoto/${tour.coverImage}` || '/redfox.jpg'}
                    alt={tour.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={`absolute top-2 left-2 text-xs font-medium px-3 py-1 rounded-full shadow ${getStatusClass(
                      tour.status
                    )}`}
                  >
                    {tour.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-green-800 mb-1">{tour.name}</h3>

                <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {/* {tour.location} */}
                </div>

                <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                  {new Date(tour.startDates[0]).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                <p className="text-sm text-gray-500 mb-4">Duration: {tour.duration} days</p>

                <Link href={`/detail/${tour._id}`}>
                  <Button
                    variant="default"
                    className="mt-auto bg-green-600 hover:bg-green-700 text-white rounded-md text-sm py-2 px-4 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
