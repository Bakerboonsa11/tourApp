'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function CardCarousel() {
  const cards = [
    { title: "Explore Mountains", description: "Beautiful mountain trips with guided tours.", image: "/harar.jpg", rating: 4.7, price: "$120", likes: 1200 },
    { title: "Beach Holidays", description: "Relax at tropical beaches with crystal-clear water.", image: "/wanchi.jpg", rating: 4.5, price: "$99", likes: 980 },
    { title: "City Tours", description: "Discover exciting cities with cultural landmarks.", image: "/redfox.jpg", rating: 4.3, price: "$85", likes: 650 },
    { title: "Wildlife Safari", description: "See amazing wildlife in natural reserves.", image: "/langanno.jpg", rating: 4.8, price: "$150", likes: 2200 },
    { title: "Cultural Trips", description: "Experience diverse cultures and traditions.", image: "/redfox.jpg", rating: 4.6, price: "$110", likes: 1570 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center">Explore Experiences Near Addis Ababa</h2>
      <p className="text-center text-gray-600">Cant-miss picks near you</p>

      <div className="relative">
        <Carousel>
          <CarouselContent>
            {cards.map((card, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="bg-white rounded-xl shadow hover:shadow-xl flex flex-col overflow-hidden h-full">
                  <div className="relative h-56 md:h-64 w-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 flex flex-col items-center">
                      <Button size="icon" variant="ghost" className="bg-white/70 hover:bg-white rounded-full p-3">
                        <Heart className="text-red-500 w-6 h-6" />
                      </Button>
                      <span className="text-xs font-semibold bg-black/60 text-white px-2 py-0.5 rounded mt-1">{card.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="font-bold text-lg">{card.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex-1">{card.description}</p>
                    <div className="flex justify-between items-center text-sm font-medium pt-3 border-t">
                      <span>⭐ {card.rating}</span>
                      <span className="text-green-600">{card.price}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
}
