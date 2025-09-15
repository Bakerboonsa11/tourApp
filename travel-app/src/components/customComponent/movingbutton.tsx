


"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';


export default function FloatingAdLink() {
  const [position, setPosition] = useState({ top: "0%", left: "0%" });
  const [visible, setVisible] = useState(true);
    const pathname = usePathname();
  
  const lang = pathname.split('/')[1]; // "en" or "am" or "om"

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        const randomTop = Math.floor(Math.random() * 80) + 10;
        const randomLeft = Math.floor(Math.random() * 80) + 10;
        setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
        setVisible(true);
      }, 5000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`fixed ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      }}
      drag
      dragConstraints={{
        top: 0,
        left: 0,
        right: typeof window !== "undefined" ? window.innerWidth - 80 : 0,
        bottom: typeof window !== "undefined" ? window.innerHeight - 80 : 0,
      }}
      dragElastic={0.2}
      dragMomentum={false}
    >
   <Link
  href={`/${lang}/itinerary`}
  className="relative flex items-center justify-center w-16 h-16 rounded-full bg-yellow-300 text-gray-800 font-bold shadow-lg hover:scale-110 transition-transform"
>
  🚀
  <span className="absolute text-sm font-semibold px-2 py-1 bg-black/70 text-white rounded-md whitespace-nowrap animate-pulse -top-12 left-1/2 -translate-x-1/2 shadow-lg">
  ✨ AI Trip Planner
  </span>
</Link>

    </motion.div>
  );
}
