'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, MapPin, Clock } from 'lucide-react';

const wishlistItems = [
  {
    id: '1',
    name: 'Beautiful Bali Retreat',
    region: 'Indonesia',
    price: 899,
    image: '/images/bali.jpg',
    duration: 7,
  },
  {
    id: '2',
    name: 'Safari Adventure',
    region: 'Kenya',
    price: 1299,
    image: '/images/kenya.jpg',
    duration: 10,
  },
  {
    id: '3',
    name: 'Northern Lights Quest',
    region: 'Iceland',
    price: 1099,
    image: '/images/iceland.jpg',
    duration: 5,
  },
];

export default function Wishlist() {
  return (
    <div className="p-6 bg-gradient-to-tr from-sky-50 via-white to-blue-100 min-h-screen">
      <h2 className="text-4xl font-extrabold text-slate-700 mb-10 text-center">💙 My Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden relative flex flex-col border border-gray-100"
          >
            <div className="relative h-56 w-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow text-pink-600 hover:bg-pink-100 cursor-pointer">
                <Heart className="w-5 h-5 fill-pink-500" />
              </div>
              <div className="absolute bottom-3 left-3 bg-sky-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <Clock className="w-3 h-3" />
                {item.duration} Days
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{item.name}</h3>
                <div className="flex items-center text-sm text-slate-500 mt-1 gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  {item.region}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-sky-700">${item.price}</span>
              </div>

              <div className="mt-4 flex gap-3">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm">
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-300 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
