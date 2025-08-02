'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";
import { Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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

export default function CardCarouselCH() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];

        // ✅ Sort by price: ascending
        const sortedTours = fetchedTours.sort((a, b) => a.price - b.price);

        // ✅ Set all sorted tours (no limit)
        setAllTours(sortedTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
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
    <div className="max-w-7xl mx-auto p-4 space-y-4 mt-12">
      <h2 className="text-3xl font-bold text-center">Top Cheapest Experiences</h2>
      <p className="text-center text-gray-600">Budget-friendly picks just for you</p>

      <div className="relative">
        <Carousel>
          <CarouselContent>
            {allTours.map((card, index) => {
              const userId = session?.user?.id || '';
              const isLiked = card.likes.includes(userId);

              return (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="bg-white rounded-xl shadow hover:shadow-xl flex flex-col overflow-hidden h-full">
                    <div className="relative h-56 md:h-64 w-full">
                      <Image
                        src={`/toursphoto/${card.coverImage}` || `/toursphoto/${card.images[0]}`}
                        alt={card.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 flex flex-col items-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleLike(card._id, card.likes)}
                          className={clsx(
                            "rounded-full p-3 transition-all duration-150",
                            clickedId === card._id && "scale-110",
                            isLiked
                              ? "bg-red-100 hover:bg-red-200"
                              : "bg-white/70 hover:bg-white"
                          )}
                        >
                          <Heart
                            className={clsx(
                              "w-6 h-6 transition-colors",
                              isLiked ? "text-white fill-red-500" : "text-red-500"
                            )}
                          />
                        </Button>
                        <span className="text-xs font-semibold bg-black/60 text-white px-2 py-0.5 rounded mt-1">
                          {card.likes?.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="font-bold text-lg">{card.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 flex-1">{card.description}</p>
                      <div className="flex justify-between items-center text-sm font-medium pt-3 border-t">
                        <span className="flex items-center gap-1 text-red-600">
                          <Heart size={16} stroke="currentColor" />
                          {card.likes?.length}
                        </span>
                        <span className="text-green-700 font-extrabold text-sm flex items-center gap-1">
                        💵 {card.price.toLocaleString()} BIRR
                      </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
}
