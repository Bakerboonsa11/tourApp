'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

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
interface TourImageProps {
  type: string;
  className?: string; // optional
}

const getValidImage = async (type: string): Promise<string> => {
  const extensions = ['webp', 'avif', 'png'];
  for (const ext of extensions) {
    const res = await fetch(`/static/${type}.${ext}`);
    if (res.ok) return `/static/${type}.${ext}`;
  }
  return '/static/default.png';
};


const TourImage = ({ type, className }: TourImageProps) => {
  const [src, setSrc] = useState('/static/default.png');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getValidImage(type).then((validSrc) => {
      if (isMounted) {
        setSrc(validSrc);
        setIsLoaded(false);  // Reset when src changes
      }
    });
    return () => {
      isMounted = false;
    };
  }, [type]);

  return (
    <div className="relative w-full h-40 overflow-hidden rounded-xl">
      <Image
        src={src}
        alt="Tour Image"
        width={600}
        height={400}
        onLoadingComplete={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out
          ${isLoaded ? 'blur-0 scale-100' : 'blur-md scale-105'}`}
      />
    </div>
  );
};

const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
    <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
    <h2 className="text-xl font-semibold text-gray-700 animate-pulse">Please wait, loading...</h2>
  </div>
);

export default function ByInterest() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];
        setAllTours(fetchedTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const tourTypes = [
    ...new Set(allTours.flatMap(tour => tour.typeOfTour))
  ];
  
  console.log("Unique Tour Types:", tourTypes);
  
  

  

  const calculateEndDate = (startDate: string, duration: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return end.toISOString().split('T')[0];
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-16">
      {/* By Interest Section */}<section>
  <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-500 drop-shadow-lg tracking-tight mt-20 text-center">
    Find things to do by interest
  </h1>
  
  <p className="text-base md:text-lg mt-4 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
    Discover experiences tailored to your interests
  </p>

  <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-6 gap-6">
    {tourTypes.map((type) => (
    <Link
    key={type}
    href={`/tours/${type}`}
    className="relative w-full md:w-[45%] lg:w-[30%] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 bg-white dark:bg-gray-800"
  >
    <TourImage type={type} className="object-cover w-full h-56" />
    
    {/* Overlay on hover */}
    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
      <span className="text-3xl font-extrabold text-white capitalize drop-shadow-lg">
        {type}
      </span>
    </div>
  </Link>
  
    ))}
  </div>
</section>


      {/* Popular Tours */}
      <section className="max-w-7xl mx-auto mt-20 p-6 space-y-10">
  {/* Title */}
  <h2 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 drop-shadow-lg">
    Popular Tours
  </h2>

  {/* Scrollable List */}
  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent">
    <div className="flex gap-8 min-w-full px-2 py-4">
      {[...allTours]
        .sort((a, b) => {
          const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
          const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
          return bLikes - aLikes;
        })
        .slice(0, 5)
        .map((tour) => (
          <div
            key={tour._id}
            className="group flex flex-col min-w-[280px] max-w-[300px] rounded-2xl shadow-lg hover:shadow-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 transition-all transform hover:-translate-y-2 duration-300"
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-t-2xl">
              <Image
                src={`/toursphoto/${tour.coverImage}`}
                alt={tour.name}
                width={300}
                height={180}
                className="object-cover w-full h-[200px] transform group-hover:scale-110 transition duration-500"
              />
              {/* Likes badge */}
              <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                ❤️ {Array.isArray(tour.likes) ? tour.likes.length : 0}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col p-5 space-y-3">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-green-600 transition">
                {tour.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                {tour.description.slice(0, 100)}...
              </p>

              {/* Price */}
              <p className="flex items-center gap-1 text-green-700 dark:text-green-400 font-extrabold">
                💵 {tour.price.toLocaleString()} BIRR
              </p>

              {/* Dates */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                {tour.startDates.map((startDate) => (
                  <p key={startDate}>
                    {new Date(startDate).toISOString().split('T')[0]} →{" "}
                    {calculateEndDate(startDate, tour.duration)}
                  </p>
                ))}
              </div>

              {/* Button */}
              <Link
                href={`/detail/${tour._id}`}
                className="mt-3 inline-block text-center bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow hover:shadow-lg hover:scale-105 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
    </div>
  </div>
</section>

    </div>
  );
}
