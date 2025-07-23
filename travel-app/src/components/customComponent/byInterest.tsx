'use client';

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
}

export default function ByInterest() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [loading, setLoading] = useState(false);

  const typeBackgrounds: Record<string, string> = {
    adventure: '/images/adventure.jpg',
    water: '/images/water.jpg',
    forest: '/images/forest.jpg',
    culture: '/images/culture.jpg',
    wildlife: '/images/wildlife.jpg',
    city: '/images/city.jpg',
    mountain: '/images/mountain.jpg',
    religious: '/images/religious.jpg',
  };

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

  const tourTypes = Array.from(
    new Set(
      allTours.flatMap(tour => tour.typeOfTour.map(type => type.toLowerCase()))
    )
  );
 console.log("Tour Types:", tourTypes);
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
                <Image
                  src={ '/redfox.jpg'}
                  alt={type}
                  width={500}
                  height={250}
                  className="w-full object-cover h-40"
                />
                <div className="p-4 flex items-center justify-center">
                  <span className="text-2xl font-bold capitalize">{type}</span>
                </div>
              </Link>
            ))}
          </div>
</section>


      {/* Scrollable Tours by Type Section */}
      <section className="max-h-[400px] overflow-y-auto space-y-8 pr-4 m-20 mt-7">
        {tourTypes.map((type, index) => (
          <div key={type} className="space-y-6">
            <h2 className="text-3xl font-bold capitalize">{type} Tours</h2>
            <div className="space-y-4">
              {allTours.filter(t => t.typeOfTour.map(tt => tt.toLowerCase()).includes(type)).map((tour) => (
                <div
                  key={tour._id}
                  className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-xl shadow p-4 hover:shadow-md transition"
                >
                  <Image
                    src={ '/wanchi.jpg'}
                    alt={tour.name}
                    width={250}
                    height={150}
                    className="rounded-xl object-cover"
                  />
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-bold">{tour.name}</h3>
                    <p className="text-gray-700 text-sm">{tour.description.slice(0, 100)}...</p>
                    <p className="font-semibold text-black">Price: ${tour.price}</p>
                    <div className="text-sm text-gray-600">
                      {tour.startDates.map((startDate) => (
                        <p key={startDate}>
                          Start: {new Date(startDate).toISOString().split('T')[0]} → End: {calculateEndDate(startDate, tour.duration)}
                        </p>
                      ))}
                    </div>
                    <Button className="bg-black text-white">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {loading && <p className="text-center text-lg">Loading tours...</p>}
      </section>
    </div>
  );
}
