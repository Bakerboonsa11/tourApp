'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, DollarSign, Calendar, Heart, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface ITour {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  region: string;
  typeOfTour: string[];
  images: string[];
  startDates: string[];
  duration: number;
  coverImage: string;
  likes?: string[];
}


type TourImageProps = {
  type: string;
  className?: string;
};

const getValidImage = async (type: string): Promise<string> => {
  const extensions = ['webp', 'avif', 'png', 'jpg'];
  for (const ext of extensions) {
    try {
      const res = await fetch(`/static/${type}.${ext}`);
      if (res.ok) return `/static/${type}.${ext}`;
    } catch (error) { /* ignore */ }
  }
  return '/static/default.png'; // A default placeholder
};

const TinyTourImage = ({ type, className }: TourImageProps) => {
  const [src, setSrc] = useState("/static/logoai.png"); // Default tiny placeholder

  useEffect(() => {
    let isMounted = true;
    getValidImage(type).then((validSrc) => {
      if (isMounted) setSrc(validSrc);
    });
    return () => {
      isMounted = false;
    };
  }, [type]);

  return (
    <Image
      src={src}
      alt={type}
      width={32}
      height={32}
      className={className ?? "w-8 h-8 rounded-full object-cover"}
    />
  );
};


const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
    <h2 className="text-xl font-semibold text-gray-700">Loading Tours...</h2>
  </div>
);

export default function ByInterest() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleTypesCount, setVisibleTypesCount] = useState(8);
  const locale = useLocale();
  const t = useTranslations("interest");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('/api/tours');
        setAllTours(res.data.instanceFiltered || []);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const tourTypes = [...new Set(allTours.flatMap(tour => tour.typeOfTour))];

  // const calculateEndDate = (startDate: string, duration: number) => {
  //   const start = new Date(startDate);
  //   end.setDate(start.getDate() + duration);
  //   return end.toISOString().split('T')[0];
  // };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 my-16">

      {/* By Interest Section */}
      <section>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
            {t("header")}
          </h1>
          <p className="mt-3 text-md text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t("subhead")}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {tourTypes.slice(0, visibleTypesCount).map((type) => (
            <Link
              key={type}
              href={`/${locale}/tours/${type}`}
              className="group flex items-center gap-2.5 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 hover:-translate-y-0.5 transition-all duration-200"
            >
              <TinyTourImage
                type={type}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-sm text-gray-700 dark:text-gray-200 capitalize group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {type}
              </span>
            </Link>
          ))}
        </div>
        {tourTypes.length > visibleTypesCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleTypesCount(tourTypes.length)}
              className="bg-emerald-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-emerald-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              seeMore
            </button>
          </div>
        )}
      </section>


      {/* Popular Tours Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
            {t('popular')}
          </h2>
        </div>
        <div className="relative">
          <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-transparent">
            <div className="flex gap-6">
              {[...allTours]
                .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                .slice(0, 5)
                .map((tour) => (
                  <div
                    key={tour._id}
                    className="group flex-shrink-0 w-[280px] bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="relative h-40">
                      <Image
                        src={`/toursphoto/${tour.coverImage}`}
                        alt={tour.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                     <div className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
  <Heart className="w-3.5 h-3.5 text-red-500" />
  <span>{tour.likes?.length || 0}</span>
</div>

                    </div>
                    <div className="p-4 flex flex-col h-[180px]">
                      <h3 className="font-bold text-md text-gray-800 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
                        {tour.name}
                      </h3>
                      <div className="mt-2 flex-grow flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{tour.price.toLocaleString()} {t('birr')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="font-medium text-sm">{tour.duration} Days</span>
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 h-9 line-clamp-2">
                            {tour.description}
                        </p>
                        <Link
                          href={`/${locale}/detail/${tour._id}`}
                          className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          {t('viewDetails')} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
