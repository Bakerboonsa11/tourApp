'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart, MapPin, Clock, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';
import clsx from "clsx";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export interface ITour {
  _id: string;
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
  comments: Comment[];
  createdAt: string;
  guides: string[];
  distance?: number; // Added for storing calculated distance
}

const ADDIS_ABABA_COORDS = {
  lat: 9.03,
  lng: 38.74,
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function CardCarousel() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations("addis");

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];

        const toursWithDistance = fetchedTours
          .map(tour => {
            if (!tour.location?.coordinates) return null;
            const [lng, lat] = tour.location.coordinates;
            const distance = getDistanceFromLatLonInKm(
              ADDIS_ABABA_COORDS.lat,
              ADDIS_ABABA_COORDS.lng,
              lat,
              lng
            );
            return { ...tour, distance };
          })
          .filter((tour): tour is ITour & { distance: number } => tour !== null && tour.distance <= 200)
          .sort((a, b) => a.distance - b.distance); // Sort by distance

        setAllTours(toursWithDistance);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleLike = async (tourId: string, currentLikes: string[]) => {
    if (!session?.user?.email) {
      console.error('User not logged in');
      // Here you might want to trigger a login modal
      return;
    }
    try {
      const userRes = await axios.get(`/api/user/${session.user.email}`);
      const userId = userRes.data.data._id;

      const isLiked = currentLikes.includes(userId);
      const updatedLikes = isLiked
        ? currentLikes.filter(id => id !== userId)
        : [...currentLikes, userId];

      // Optimistic UI update
      setAllTours(prev =>
        prev.map(tour =>
          tour._id === tourId ? { ...tour, likes: updatedLikes } : tour
        )
      );
      setClickedId(tourId);
      setTimeout(() => setClickedId(null), 300);

      // API call
      await axios.patch(`/api/tours/${tourId}`, { likes: updatedLikes });

    } catch (error) {
      console.error('Failed to like tour:', error);
      // Revert optimistic update on error if needed
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading nearby tours...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
          {t('header')}
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('subhead')}
        </p>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="relative">
        <CarouselContent className="-ml-4">
          {allTours.map((card) => {
            const userId = session?.user?.id || ""; // Ensure you have a reliable way to get the user ID
            const isLiked = card.likes.includes(userId);

            return (
              <CarouselItem key={card._id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  
                  <div className="relative h-64 w-full overflow-hidden">
                    <Link href={`/${locale}/detail/${card._id}`} className="block h-full w-full">
                      <Image
                        src={`/toursphoto/${card.coverImage}`}
                        alt={card.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-lg font-bold tracking-tight leading-tight">{card.name}</h3>
                        {card.distance !== undefined && (
                          <p className="text-sm font-medium text-gray-200 flex items-center gap-1.5 mt-1">
                            <MapPin size={14} />
                            {card.distance.toFixed(0)} km away
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="absolute top-3 right-3 z-10 flex flex-col items-center space-y-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleLike(card._id, card.likes)}
                        className={clsx(
                          "rounded-full h-10 w-10 transition-all duration-200 ease-in-out transform",
                          {
                            'bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-md': !isLiked,
                            'bg-red-500 shadow-lg': isLiked,
                            'scale-110': clickedId === card._id
                          }
                        )}
                      >
                        <Heart
                          size={20}
                          className={clsx("transition-all", {
                            'text-gray-700 dark:text-gray-200': !isLiked,
                            'text-white fill-white': isLiked
                          })}
                        />
                      </Button>
                      <span className="text-xs font-bold text-white bg-black/50 rounded-full px-2 py-0.5 select-none">
                        {card.likes.length}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {card.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">ETB {card.price.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{card.duration} days</span>
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/detail/${card._id}`}
                      className="mt-4 block w-full text-center bg-emerald-500 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800" />
      </Carousel>
    </div>
  );
}