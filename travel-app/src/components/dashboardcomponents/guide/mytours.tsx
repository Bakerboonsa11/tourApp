'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Calendar, MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const guideTours = [
  {
    id: '1',
    name: 'Mount Kilimanjaro Trek',
    location: 'Tanzania',
    startDate: '2025-08-10',
    duration: 7,
    image: '/images/kilimanjaro.jpg',
    status: 'Active',
  },
  {id: '9',
  name: 'Mount Kilimanjaro Trek',
  location: 'Tanzania',
  startDate: '2025-08-10',
  duration: 7,
  image: '/images/kilimanjaro.jpg',
  status: 'Active',
},
  {
    id: '2',
    name: 'Nile River Cruise',
    location: 'Egypt',
    startDate: '2025-09-05',
    duration: 5,
    image: '/images/nile.jpg',
    status: 'Upcoming',
  },
  {
    id: '3',
    name: 'Safari Adventure',
    location: 'Kenya',
    startDate: '2025-09-20',
    duration: 10,
    image: '/images/safari.jpg',
    status: 'Active',
  },
];

export default function GuideMyTours() {
  const [tours] = useState(guideTours);

  return (
    <div className="min-h-screen p-8 bg-gray-900 flex flex-col">
      <h2 className="text-4xl font-extrabold text-amber-400 mb-10 text-center tracking-wide">
        🚩 My Tours
      </h2>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)] space-y-8">
        {tours.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-16">
            You currently have no assigned tours.
          </p>
        ) : (
          tours.map((tour) => (
            <div
              key={tour.id}
              className="flex flex-col md:flex-row bg-gray-800 rounded-2xl shadow-lg border-2 border-amber-600 hover:shadow-amber-500/50 transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative w-full md:w-1/3 aspect-[16/9]">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3 bg-amber-600 px-4 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-lg select-none">
                  {tour.status}
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-3xl font-bold text-amber-400 mb-3">{tour.name}</h3>

                  <div className="flex items-center gap-4 text-gray-300 text-lg mb-4">
                    <MapPin className="w-6 h-6" />
                    <span>{tour.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-300 text-lg mb-4">
                    <Calendar className="w-6 h-6" />
                    <span>
                      Starts on{' '}
                      {new Date(tour.startDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-gray-400 font-semibold text-lg mb-6">{tour.duration} days</p>
                </div>

                <Button
                  variant="default"
                  className="self-start bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg px-6 py-3 flex items-center gap-3"
                  onClick={() => alert(`Viewing details for ${tour.name}`)}
                >
                  <Edit2 className="w-6 h-6" /> View / Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
