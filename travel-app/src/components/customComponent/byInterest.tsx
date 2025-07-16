'use client';
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
export default function ByInterest() {
  const interests = [
    { name: "Adventure", href: "/interests/adventure", image: "/wanchi.jpg" },
    { name: "Culture", href: "/interests/culture", image: "/sof.jpg" },
    { name: "Relaxation", href: "/interests/relaxation", image: "/coffe.jpg" },
    { name: "Animal", href: "/interests/relaxation", image: "/harar.jpg" },
    // { name: "Culture", href: "/interests/culture", image: "/sof.jpg" },
    { name: "Forest", href: "/interests/relaxation", image: "/nyala.webp" },
    { name: "Water", href: "/interests/relaxation", image: "/langanno.jpg" },
  ];

  return (
    
    <>
      <div className="max-w-6xl mx-auto px-4 ">
      <h1 className="text-2xl md:text-2xl font-bold mt-20 pl-3">Find things to do by interest</h1>
      <p className="text-base md:text-lg mt-4 pl-4">Discover experiences tailored to your interests</p>

      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-6 gap-8">
        {interests.map((interest) => (
          <Link
            key={interest.name}
            href={interest.href}
            className="relative w-full md:w-[45%] lg:w-[30%] h-48 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${interest.image})` }}
            ></div>
            <div className="absolute bottom-0 left-0 bg-black/50 text-white p-3 text-lg font-bold w-full">
              {interest.name}
            </div>
          </Link>
        ))}
      </div>
    </div>

    <div className="flex flex-wrap md:flex-nowrap items-start justify-between mt-20 p-4 md:p-6 gap-6 bg-gray-100 max-w-6xl mx-auto rounded-xl mx-4">

{/* rotated image  */}
<div className="w-full md:w-auto flex justify-center md:justify-start">
  <Image
    src="/coffe.jpg"
    alt="Dynamic Travel Image"
    width={250}
    height={400}
    className="rounded-xl transition-all duration-700 rotate-6"
  />
</div>

{/* Text Section */}
<div className="flex flex-col justify-between text-black flex-1 h-full">

  {/* Heading */}
  <h2 className="text-xl md:text-3xl font-bold mb-2 text-center md:text-left">
    Find things to do for everything you are into
  </h2>

  {/* Description and Button Container */}
  <div className="flex flex-col justify-between h-full flex-1 mt-4">

    <p className="text-sm md:text-base text-gray-700 mb-3 text-center md:text-left">
      Browse 40,000+ experiences and book with us
    </p>

    <div className="flex justify-center md:justify-end mt-auto">
      <Button className="bg-black text-white hover:bg-neutral-800 text-sm md:text-base">
        Book Now
      </Button>
    </div>

  </div>
</div>

</div>



    <div className="max-w-6xl mx-auto px-4 ">
      <h1 className="text-2xl md:text-2xl font-bold mt-20 pl-3">Find things to do by interest</h1>
      <p className="text-base md:text-lg mt-4 pl-4">Discover experiences tailored to your interests</p>

      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-6 gap-8">
        {interests.map((interest) => (
          <Link
            key={interest.name}
            href={interest.href}
            className="relative w-full md:w-[45%] lg:w-[30%] h-48 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${interest.image})` }}
            ></div>
            <div className="absolute bottom-0 left-0 bg-black/50 text-white p-3 text-lg font-bold w-full">
              {interest.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}
