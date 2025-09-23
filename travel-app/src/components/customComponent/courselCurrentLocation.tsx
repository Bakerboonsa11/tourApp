'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart, MapPin, Clock, DollarSign, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
  distance?: number; // For storing calculated distance
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function CardCarouselCurrent() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Getting your location...");
  const [clickedId, setClickedId] = useState<string | null>(null);
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('near');

  useEffect(() => {
    const fetchToursNearUser = async (lat: number, lng: number) => {
      setStatusMessage("Finding tours near you...");
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];

        const toursWithDistance = fetchedTours
          .map(tour => {
            if (!tour.location?.coordinates || tour.location.coordinates.length < 2) return null;

            let tourLng, tourLat;
            // Heuristic to handle inconsistent [lon, lat] vs [lat, lon] formats.
            // For locations in Ethiopia, longitude is always greater than latitude.
            if (tour.location.coordinates[0] > tour.location.coordinates[1]) {
              // This is likely the correct [longitude, latitude] format
              [tourLng, tourLat] = tour.location.coordinates;
            } else {
              // This is likely an inverted [latitude, longitude] format, so we swap them
              [tourLat, tourLng] = tour.location.coordinates;
            }

            const distance = getDistanceFromLatLonInKm(lat, lng, tourLat, tourLng);
            return { ...tour, distance };
          })
          .filter((tour): tour is ITour & { distance: number } => tour !== null && tour.distance <= 300)
          .sort((a, b) => a.distance - b.distance);

        setAllTours(toursWithDistance);
        if (toursWithDistance.length === 0) {
          setStatusMessage("No tours found within 300km of your location.");
        }
      } catch (err) {
        console.error('Error fetching tours:', err);
        setStatusMessage("Could not fetch tours.");
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchToursNearUser(position.coords.latitude, position.coords.longitude);
        console.log('Geolocation success bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb:', position.coords);
      },
      (error) => {
        console.warn('Geolocation failed:', error.message);
        setStatusMessage("Could not get your location. Showing tours near Bale Robe as a fallback.");
        fetchToursNearUser(7.15, 39.83); // Fallback location
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleLike = async (tourId: string, currentLikes: string[]) => {
    if (!session?.user?.email) {
      console.error('User not logged in');
      return;
    }
    try {
      const userRes = await axios.get(`/api/user/${session.user.email}`);
      const userId = userRes.data.data._id;
      const isLiked = currentLikes.includes(userId);
      const updatedLikes = isLiked
        ? currentLikes.filter(id => id !== userId)
        : [...currentLikes, userId];

      setAllTours(prev => prev.map(tour => tour._id === tourId ? { ...tour, likes: updatedLikes } : tour));
      setClickedId(tourId);
      setTimeout(() => setClickedId(null), 300);

      await axios.patch(`/api/tours/${tourId}`, { likes: updatedLikes });
    } catch (error) {
      console.error('Failed to like tour:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
          {t('header')}
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('head')}
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">{statusMessage}</p>
        </div>
      )}

      {!loading && allTours.length === 0 && (
        <div className="text-center h-64 flex items-center justify-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">{statusMessage}</p>
        </div>
      )}

      {!loading && allTours.length > 0 && (
        <Carousel opts={{ align: "start", loop: allTours.length > 3 }} className="relative">
          <CarouselContent className="-ml-4">
            {allTours.map((card) => {
              const userId = session?.user?.id || "";
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
                            <p className="text-sm font-semibold text-white flex items-center gap-1.5 mt-1 bg-black/50 rounded-full px-2 py-1">
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
                          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400"> Br {card.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">/ person</span>
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
                        {t('detail')}
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
      )}
    </div>
  );
}