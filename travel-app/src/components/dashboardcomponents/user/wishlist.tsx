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
    <div className="p-8 bg-gradient-to-br from-blue-100 via-white to-sky-200 min-h-screen font-sans">
      <h2 className="text-5xl font-black text-slate-800 text-center mb-14 tracking-tight drop-shadow-lg">
        ✨ Wishlist Wonders
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="relative group rounded-3xl overflow-hidden backdrop-blur-md bg-white/40 shadow-xl border border-sky-100 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
          >
            {/* Image Section */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
              <div className="absolute top-4 right-4 z-10">
                <Heart className="w-6 h-6 text-pink-500 hover:scale-125 transition-transform fill-pink-300" />
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <Clock className="w-4 h-4" />
                {item.duration} Days
              </div>
              <div className="absolute bottom-4 right-4 bg-white/80 text-sky-800 font-bold px-4 py-1 rounded-full shadow text-sm">
                ${item.price}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-6 space-y-3 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">{item.name}</h3>
                <div className="flex items-center text-sm text-slate-600 mt-1 gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  {item.region}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button className="w-full bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-xl shadow hover:brightness-110">
                  Book Now
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 border border-red-200 rounded-xl"
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
