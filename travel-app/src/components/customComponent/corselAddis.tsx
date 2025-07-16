'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function CardCarousel() {
  const cards = [
    { 
      title: "Explore Mountains", 
      description: "Beautiful mountain trips with guided tours.",
      image: "/harar.jpg",
      rating: 4.7,
      price: "$120",
      likes: 1200
    },
    { 
      title: "Beach Holidays", 
      description: "Relax at tropical beaches with crystal-clear water.",
      image: "/wanchi.jpg",
      rating: 4.5,
      price: "$99",
      likes: 980
    },
    { 
      title: "City Tours", 
      description: "Discover exciting cities with cultural landmarks.",
      image: "/redfox.jpg",
      rating: 4.3,
      price: "$85",
      likes: 650
    },
    { 
      title: "Wildlife Safari", 
      description: "See amazing wildlife in natural reserves.",
      image: "/langanno.jpg",
      rating: 4.8,
      price: "$150",
      likes: 2200
    },
    { 
      title: "Cultural Trips", 
      description: "Experience diverse cultures and traditions.",
      image: "/redfox.jpg",
      rating: 4.6,
      price: "$110",
      likes: 1570
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">

        <h2 className="text-3xl md:text-2xl font-bold text-center">Explore expereiances near Addis Ababa</h2>
          <p className="text-base md:text-md text-center text-black/80 p-5">
            Cant miss picks neer you
          </p>
      <Carousel className="w-full">
        <CarouselContent>
          {cards.map((card, index) => (
            <CarouselItem 
              key={index} 
              className="basis-3/4 md:basis-1/3 lg:basis-1/4"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col h-full">

                {/* Image Section */}
                <div className="relative h-80 w-full">
                  <Image 
                    src={card.image} 
                    alt={card.title} 
                    fill 
                    className="object-cover"
                  />
                  
                  {/* Like Button with Count */}
                  <div className="absolute top-3 right-3 flex flex-col items-center space-y-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="bg-white/80 hover:bg-white rounded-full p-3"
                    >
                      <Heart className="w-6 h-6 text-red-500" />
                    </Button>
                    <span className="text-white text-xs font-semibold bg-black/60 px-2 py-0.5 rounded">
                      {card.likes.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{card.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t pt-3 text-sm font-semibold">
                    <span>⭐ {card.rating}</span>
                    <span className="text-green-600">{card.price}</span>
                  </div>
                </div>

              </div>
            </CarouselItem>
            
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      
      
    </div>
  );
}
