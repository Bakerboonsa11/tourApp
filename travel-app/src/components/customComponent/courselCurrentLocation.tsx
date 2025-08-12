'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';
import clsx from "clsx";

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
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function CardCarouselCurrent() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchToursNearUser = async (lat: number, lng: number) => {
      console.log("Fetching tours near user location:", lat, lng);
      setLoading(true);
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];
  
        const filteredTours = fetchedTours.filter(tour => {
          if (!tour.location?.coordinates) return false;
          const [tourLng, tourLat] = tour.location.coordinates;
          const dist = getDistanceFromLatLonInKm(lat, lng, tourLat, tourLng);
          return dist <= 200;
        });
  
        setAllTours(filteredTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
  
    const getLocationAndFetchTours = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported. Using fallback location.');
        fetchToursNearUser(7.15, 39.83); // fallback to Bale Robe for testing
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Geolocation success:", position.coords.latitude, position.coords.longitude);
          fetchToursNearUser(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation failed:', error.message);
          fetchToursNearUser(7.15, 39.83); // fallback to Bale Robe for testing
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };
  
    getLocationAndFetchTours();
  }, []);
  

  const handleLike = async (tourId: string, currentLikes: string[]) => {
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) return console.error('User not logged in');

      const userRes = await axios.get(`/api/user/${userEmail}`);
      const userId = userRes.data.data._id;

      const alreadyLiked = currentLikes.includes(userId);
      const updatedLikes = alreadyLiked
        ? currentLikes.filter(id => id !== userId)
        : [...currentLikes, userId];

      await axios.patch(`/api/tours/${tourId}`, { likes: updatedLikes });

      setAllTours(prev =>
        prev.map(tour =>
          tour._id === tourId ? { ...tour, likes: updatedLikes } : tour
        )
      );

      setClickedId(tourId);
      setTimeout(() => setClickedId(null), 200);
    } catch (error) {
      console.error('Failed to like tour:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 mt-20">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 text-transparent bg-clip-text drop-shadow-lg">
        Tours Near You
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-300 text-lg">
        Experiences within 300km of your current location
      </p>
  
      <div className="relative">
        <Carousel>
          <CarouselContent>
            {allTours.map((card, index) => {
              const userId = session?.user?.id || '';
              const isLiked = card.likes.includes(userId);
  
              return (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-3"
                >
                  <div
                    className="group bg-white dark:bg-gray-900 rounded-3xl shadow-md 
                               hover:shadow-[0_12px_30px_rgba(16,185,129,0.25)] 
                               transition-all duration-300 flex flex-col overflow-hidden h-full 
                               transform hover:-translate-y-1 hover:scale-[1.02]
                               border border-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(white, white), linear-gradient(to right, #10b981, #14b8a6)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    {/* Image Section */}
                    <div className="relative h-56 md:h-64 w-full overflow-hidden">
                      <Image
                        src={`/toursphoto/${card.coverImage}` || `/toursphoto/${card.images[0]}`}
                        alt={card.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  
                      {/* Like Button */}
                      <div className="absolute top-4 right-4 flex flex-col items-center space-y-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleLike(card._id, card.likes)}
                          className={clsx(
                            "rounded-full p-3 shadow-lg backdrop-blur-sm transition-transform duration-150",
                            clickedId === card._id && "scale-110",
                            isLiked
                              ? "bg-red-100 hover:bg-red-200"
                              : "bg-white/80 hover:bg-white dark:bg-gray-700 dark:hover:bg-gray-600"
                          )}
                          aria-label={isLiked ? "Unlike tour" : "Like tour"}
                        >
                          <Heart
                            className={clsx(
                              "w-6 h-6 transition-colors",
                              isLiked ? "text-red-600 fill-red-600" : "text-red-500"
                            )}
                          />
                        </Button>
                        <span className="text-xs font-semibold bg-black/60 text-white rounded-full px-2 py-0.5 shadow">
                          {card.likes?.length}
                        </span>
                      </div>
                    </div>
  
                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white truncate">
                        {card.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 flex-1 line-clamp-3 leading-relaxed">
                        {card.description}
                      </p>
  
                      <div className="flex justify-between items-center text-sm font-semibold mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <Heart size={16} stroke="currentColor" />
                          {card.likes?.length}
                        </span>
  
                        <span className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 font-bold px-3 py-1 rounded-full text-xs">
                          💵 {card.price.toLocaleString()} BIRR
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
  
          {/* Controls */}
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow-md hover:shadow-lg rounded-full p-2" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow-md hover:shadow-lg rounded-full p-2" />
        </Carousel>
      </div>
    </div>
  );
  
}
