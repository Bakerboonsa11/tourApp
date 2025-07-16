// components/Slideshow.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = ["/coffe.jpg","/harar.jpg","/langanno.jpg","/nyala.webp","/redfox.jpg","/sof.jpg","/wanchi.jpg"];

export default function Slideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Image
      src={images[current]}
      alt="Dynamic Travel Image"
      width={600}
      height={400}
      className="rounded-xl transition-all duration-700 w-full"
    />
  );
}
