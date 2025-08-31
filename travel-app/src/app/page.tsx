'use client';
import Slideshow from "./../components/ui/slideshow";
import Navbar from "@/components/customComponent/navigation";
import { Button } from "@/components/ui/button";
import ByInterest from "@/components/customComponent/byInterest";
import Carousel from "@/components/customComponent/corselAddis";
import CardCarouselCH from "@/components/customComponent/courselChipest";
import CardCarouselCurrent from "@/components/customComponent/courselCurrentLocation";
import GreenWaveFAQContact from './../components/customComponent/mostasked'
import MovingButton from "@/components/customComponent/movingbutton";
import Chatbot from "@/components/customComponent/Chatbot";
import Link from "next/link";
import Image from "next/image";


export default function Home() {



  
  const interests = [
    { name: "Adventure", href: "/interests/adventure", image: "/wanchi.jpg" },
    { name: "Culture", href: "/interests/culture", image: "/sof.jpg" },
    { name: "Relaxation", href: "/interests/relaxation", image: "/coffe.jpg" },
    { name: "Animal", href: "/interests/relaxation", image: "/harar.jpg" },
   
  ];
  
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* <Navbar /> */}

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mt-10 text-gray-900 dark:text-black">
  Where to?
</h1>
<Chatbot />

<p className="text-center text-base md:text-lg mt-4 text-gray-700 dark:text-gray-600">
  Explore the beauty of Ethiopia 🇪🇹🇪🇹🇪🇹🇪🇹
</p>
<MovingButton />

      {/* DYNAMIC IMAGE FLEXBOX */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-20 p-6 md:p-12 gap-10 bg-gradient-to-br from-green-400 via-emerald-500 to-lime-500 max-w-7xl mx-auto rounded-3xl shadow-xl backdrop-blur-xl mx-4">
  {/* Left: Slideshow or Image */}
  <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
    <Slideshow />
  </div>

  {/* Right: Content */}
  <div className="w-full md:w-1/2 space-y-6 text-white text-center md:text-left px-4 md:px-8">
    <h2 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
      Discover the Best <span className="text-black/90">Experiences</span><br />
      for Every Interest
    </h2>
    <p className="text-lg md:text-xl text-white/80 font-light">
      Choose from over <span className="font-semibold text-white">40,000+</span> unforgettable adventures — book instantly.
    </p>
    <div className="flex justify-center md:justify-start">
      <Link
        href={"/tours/all"}
        className="bg-black text-white hover:bg-white hover:text-black transition px-6 py-3 rounded-full font-medium shadow-md"
      >
        Book Now
      </Link>
    </div>
  </div>
</div>

     <ByInterest />
     <Carousel/>

     {/* rotateimage */}
     <div className="mt-16 p-4 md:p-6 max-w-6xl mx-auto rounded-2xl bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-lg border border-green-100/60">
  
  {/* Image with subtle hover effect */}
  <div className="md:shrink-0">
    <Image
      src="/static/relaxation3.webp"
      alt="Relaxation Travel"
      width={240}
      height={360}
      className="rounded-2xl shadow-xl rotate-3 hover:rotate-0 hover:scale-105 transition-transform duration-500 ease-out"
    />
  </div>

  {/* Text Content */}
  <div className="flex flex-col justify-center text-black flex-1">
    
    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-extrabold leading-snug text-center md:text-left text-emerald-800">
      Find Experiences Tailored <span className="bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">Just for You</span>
    </h2>

    {/* Description */}
    <p className="text-green-700 text-base md:text-lg text-center md:text-left mt-3 mb-6 leading-relaxed">
      Explore <span className="font-semibold text-green-900">40,000+ unique adventures</span> — from hidden waterfalls to vibrant cultural festivals — all curated for your passions.
    </p>

    {/* Call to Action Button */}
    <div className="flex justify-center md:justify-start">
      <Link href="/tours">
        <button className="bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 text-white font-medium rounded-full px-7 py-2.5 text-sm md:text-base shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          Book Now
        </button>
     
      </Link>
    </div>
  </div>
</div>


     {/* rotateimage */}
     <div className="relative isolate max-w-6xl mx-auto p-4 md:p-8 mt-14 bg-gradient-to-br from-emerald-50 via-green-50 to-green-100 rounded-3xl shadow-2xl border border-green-200/60 overflow-hidden">
  {/* Soft radial background glow */}
  <div className="absolute inset-0 bg-gradient-radial from-green-200/40 via-transparent to-transparent blur-2xl pointer-events-none" />

  <div className="flex flex-wrap md:flex-nowrap gap-6 items-center relative z-10">
    
    {/* Image */}
    <div className="w-full md:w-auto flex justify-center md:justify-start">
      <Image
        src="/static/adventure.webp"
        alt="Dynamic Travel"
        width={220}
        height={360}
        className="rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out hover:scale-105"
      />
    </div>

    {/* Text content */}
    <div className="flex flex-col justify-center text-black flex-1 h-full p-6 md:p-8 bg-gradient-to-b from-green-100 via-green-50 to-emerald-50 rounded-2xl shadow-md border border-green-200/40">
      
      <h2 className="text-3xl md:text-5xl font-extrabold leading-snug text-center md:text-left text-emerald-800 tracking-tight">
        Discover Your Next <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Adventure</span> 🌿
      </h2>

      <p className="mt-3 text-base md:text-lg text-green-700 text-center md:text-left max-w-prose mx-auto md:mx-0 leading-relaxed">
        Over <span className="font-semibold text-green-900">40,000+ experiences</span> are waiting for you.  
        Explore caves, mountains, lakes, and more — all curated for your next journey.
      </p>

      <div className="flex justify-center md:justify-start mt-5">
        <Link href="/tours/all">
          <button className="bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 text-white font-semibold rounded-full px-8 py-2.5 text-sm md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            Book Now
          </button>
        </Link>
      </div>
    </div>

  </div>
      </div>


     <CardCarouselCurrent/>
     <CardCarouselCH/>
  

     {/* imagerightflex */}
     <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10 gap-8 mt-30">
  
  {/* Left Text Section */}
  <div className="w-full md:w-1/2 space-y-4 text-center md:text-left ">
    <h2 className="text-3xl md:text-5xl font-bold text-black">Discover Ethiopia 🇪🇹🇪🇹</h2>
    <p className="text-gray-700 text-base md:text-lg">
      Find breathtaking destinations and unique experiences tailored for you.
    </p>
    <button className="bg-green-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out ring-2 ring-green-400 hover:ring-green-300">
  Learn More
</button>

  </div>

  {/* Right Image Section */}
  <div className="w-full md:w-1/2 flex justify-center">
   
     <Image
         src="/static/ethio.avif"
         alt="Dynamic Travel Image"
         width={250}
         height={400}
     className="rounded-xl w-[300px] md:w-[450px] object-cover"
       />
  </div>
     </div>

          {/* iconic  */}
          <div className="max-w-7xl mx-auto px-6 mt-24">
  <h1 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-gray-900">
    Iconic Places You Need to See
  </h1>

  <div
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    aria-label="Iconic places grid"
  >
    {interests.map((interest) => (
      <Link
        key={interest.name}
        href={`/tours/${interest.name.toLowerCase()}`}
        className="relative group overflow-hidden rounded-2xl border-4 border-green-300 shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:brightness-110 hover:shadow-2xl"
        style={{ height: "14rem" }} // ~224px height
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${interest.image})` }}
          aria-hidden="true"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />

        {/* Text content */}
        <div className="relative p-4 flex items-end h-full">
          <h3 className="text-white text-xl font-semibold drop-shadow-lg">
            {interest.name}
          </h3>
        </div>
      </Link>
    ))}
  </div>
</div>
<GreenWaveFAQContact/>

    <div className="w-full bg-emerald-950 py-12 px-4 md:px-16 my-10 rounded-xl shadow-md">
  <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-10">

    {/* Left Section with Logo and Text */}
    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
      
      {/* Logo */}
      <Image
        src="/globe.svg"
        alt="Logo"
        width={80}
        height={80}
        className="mb-2"
      />
      
      {/* Heading */}
      <h2 className="text-3xl md:text-6xl font-bold text-white pt-2 leading-tight">Travelers Choice Awards Best of the Best</h2>
      
      {/* Paragraph */}
      <p className="text-gray-300 text-base md:text-lg max-w-md">
        Find breathtaking destinations and unique experiences tailored for you.
      </p>
      
      {/* Button */}
      <button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-green-700 hover:text-white transition">
         See the Winners
      </button>
    </div>

    {/* Right Image */}
    <div className="w-full md:w-1/2 flex justify-center">
      <div className="w-full md:w-[90%] h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
        <Image
          src="/wanchi.jpg"
          alt="Travel Destination"
          width={600}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
    </div>

  </div>
</div>



    </div>
  );
}
