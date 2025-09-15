'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Edit2, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
type Tour = {
  _id: string;
  name: string;
  coverImage: string;
  location: location;
  startDates: string[];
  duration: number;
  status: string;
};

type location = {
  address?: string;
}

export default function GuideMyTours() {
  const { data: session } = useSession();
  const [toursOfGuide, setToursOfGuide] = useState<Tour[]>([]);
  const t = useTranslations('guideDashboard');

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      try {
        const userRes = await axios.get(`/api/user/${encodeURIComponent(session.user.email)}`);
        const userId = userRes.data.data._id;

        const tourRes = await axios.get('/api/tours');
        const filteredTours = tourRes.data.instanceFiltered.filter((tour: Tour & { guides: string[] }) =>
          tour.guides.includes(userId)
        );
        setToursOfGuide(filteredTours);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [session]);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'finished':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-400 text-gray-800';
      case 'active':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-700 to-green-500 text-white py-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">🌿 {t("tour.MyGuidedTours")}</h1>
          <p className="text-lg md:text-xl opacity-90">
            {toursOfGuide.length} {t("tour.ActiveTours")}
          </p>
        </div>
      </header>
  
      {/* Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {toursOfGuide.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 text-lg font-medium">
            {t("tour.Youcurrentlyhavenoassignedtours")}
          </div>
        ) : (
          toursOfGuide.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={tour.coverImage ? `/toursphoto/${tour.coverImage}` : '/redfox.jpg'}
                  alt={tour.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full shadow ${getStatusClass(
                    tour.status
                  )}`}
                >
                  {tour.status.toUpperCase()}
                </span>
              </div>
  
              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{tour.name}</h2>
  
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span>{tour.location?.address || t("tour.UnknownLocation")}</span>
                </div>
  
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span>
                    {new Date(tour.startDates[0]).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
  
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Users className="w-5 h-5 text-green-500" />
                  <span>
                    {t("tour.Duration")}: {tour.duration} {t("tour.days")}
                  </span>
                </div>
  
                {/* Action Button */}
                <Link href={`/detail/${tour._id}`} className="mt-auto">
                  <button className="w-full py-3 bg-gradient-to-r from-green-600 to-lime-500 text-white font-semibold rounded-2xl shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <Edit2 className="w-5 h-5" /> {t("tour.ViewTour")}
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
  
}
