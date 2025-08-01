"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

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
  likes?: number;
}

const getValidImage = async (type: string): Promise<string> => {
  const extensions = ['webp', 'avif', 'png'];
  for (const ext of extensions) {
    const res = await fetch(`/static/${type}.${ext}`);
    if (res.ok) return `/static/${type}.${ext}`;
  }
  return '/static/default.png';
};

const TourImage = ({ type }: { type: string }) => {
  const [src, setSrc] = useState('/static/default.png');

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
      width={500}
      height={250}
      className="w-full object-cover h-40"
    />
  );
};

export default function ByInterest() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];
        console.log("Fetched Tours:llllllllllllllllllllllllllllll", fetchedTours);
        setAllTours(fetchedTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const tourTypes = Array.from(
    new Set(
      allTours.flatMap(tour => tour.typeOfTour.map(type => type.toLowerCase()))
    )
  );

  const calculateEndDate = (startDate: string, duration: number) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration);
    return end.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-16">
      {/* By Interest Section */}
      <section>
        <h1 className="text-2xl md:text-3xl font-bold mt-20">Find things to do by interest</h1>
        <p className="text-base md:text-lg mt-4">Discover experiences tailored to your interests</p>

        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-6 gap-6">
          {tourTypes.map((type) => (
            <Link
              key={type}
              href={`/tours/${type}`}
              className="relative w-full md:w-[45%] lg:w-[30%] rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
            >
              <TourImage type={type} />
              <div className="p-4 flex items-center justify-center">
                <span className="text-2xl font-bold capitalize">{type}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Scrollable Popular Tours */}
      <section className="max-w-7xl w-full overflow-y-auto mx-auto mt-20 p-6 space-y-8">
  <h2 className="text-3xl font-bold text-center text-green-700 mb-4">Popular Tours</h2>

  <div className="overflow-x-auto">
    <div className="flex gap-6 min-w-full px-2 py-4">
      {[...allTours]
        // Sort by number of likes (length of likes array)
        .sort((a, b) => {
          const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
          const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
          return bLikes - aLikes;
        })        .slice(0, 5)
        .map((tour) => (
          <div
            key={tour._id}
            className="flex flex-col bg-white min-w-[280px] max-w-[300px] rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all border border-gray-100"
          >
            <Image
              src={`/toursphoto/${tour.coverImage}`}
              alt={tour.name}
              width={300}
              height={180}
              className="rounded-xl object-cover w-full h-[180px]"
            />

            <div className="mt-4 space-y-2 text-left">
              <h3 className="text-lg font-semibold text-green-700 truncate">{tour.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{tour.description.slice(0, 100)}...</p>
              <p className="text-black text-sm font-bold">Price: ${tour.price}</p>

              <div className="text-xs text-gray-500 space-y-1">
                {tour.startDates.map((startDate) => (
                  <p key={startDate}>
                    {new Date(startDate).toISOString().split('T')[0]} → {calculateEndDate(startDate, tour.duration)}
                  </p>
                ))}
              </div>

              <Link
                href={`/detail/${tour._id}`}
                className="mt-2 inline-block bg-green-600 text-white text-sm px-3 py-2 rounded-md hover:bg-green-700 transition"
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
