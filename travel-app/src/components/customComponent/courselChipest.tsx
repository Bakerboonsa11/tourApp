'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";
import { Heart, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export default function CardCarouselCH() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const { data: session } = useSession();
  const t = useTranslations('cheap');
  const locale = useLocale();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];
        const sortedTours = fetchedTours.sort((a, b) => a.price - b.price);
        setAllTours(sortedTours.slice(0, 10)); // Get top 10 cheapest
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const handleLike = async (tourId: string, currentLikes: string[]) => {
    if (!session?.user?.email) return console.error('User not logged in');
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

  if (loading) {
    return <div className="text-center py-20">Finding best value tours...</div>;
  }

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

      <div className="relative">
        <div className="flex space-x-8 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {allTours.map((card, index) => {
            const userId = session?.user?.id || '';
            const isLiked = card.likes.includes(userId);

            return (
              <div key={card._id} className="group relative flex-shrink-0 w-[360px] h-[220px] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2">
                {/* Background Image */}
                <Image
                  src={`/toursphoto/${card.coverImage}`}
                  alt={card.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

                {/* Rank Number */}
                <div className="absolute top-0 left-0 text-[120px] font-black text-white/10 -translate-x-4 -translate-y-6 select-none">
                  {(index + 1).toString().padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full p-5 text-white">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight truncate">{card.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-300 font-medium">
                      <div className="flex items-center gap-1.5"><Clock size={14} /> {card.duration} days</div>
                      <div className="flex items-center gap-1.5"><Heart size={14} /> {card.likes.length} likes</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-300">Price</p>
                      <p className="text-3xl font-bold text-emerald-400 leading-tight">Br {card.price.toLocaleString()}</p>
                    </div>
                    <Link href={`/${locale}/detail/${card._id}`} className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                      Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Like Button */}
                <div className="absolute top-4 right-4 z-20">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleLike(card._id, card.likes)}
                    className={clsx(
                      "rounded-full h-10 w-10 transition-all duration-200 ease-in-out transform",
                      {
                        'bg-white/20 backdrop-blur-sm': !isLiked,
                        'bg-red-500': isLiked,
                        'scale-110': clickedId === card._id
                      }
                    )}
                  >
                    <Heart
                      size={20}
                      className={clsx("transition-all", {
                        'text-white': !isLiked,
                        'text-white fill-white': isLiked
                      })}
                    />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}