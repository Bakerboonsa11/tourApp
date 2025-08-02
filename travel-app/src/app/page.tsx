'use client';
import Slideshow from "./../components/ui/slideshow";
import Navbar from "@/components/customComponent/navigation";
import { Button } from "@/components/ui/button";
import ByInterest from "@/components/customComponent/byInterest";
import Carousel from "@/components/customComponent/corselAddis";
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
      <h1 className="text-4xl md:text-6xl font-bold text-center mt-10">Where to?</h1>
      <p className="text-center text-base md:text-lg mt-4">Explore the beauty of Oromia</p>

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
     <div className="mt-20 p-4 md:p-6 max-w-6xl mx-auto rounded-xl bg-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
          {/* Rotated Image */}
          <div className="md:shrink-0">
            <Image
              src="/static/relaxation2.webp"
              alt="Dynamic Travel Image"
              width={250}
              height={400}
              className="rounded-xl rotate-6 shadow-lg transition-transform duration-500"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-between h-full text-black flex-1">
            {/* Heading */}
            <h2 className="text-2xl md:text-4xl font-bold text-center md:text-left mb-4">
              Find things to do for everything youre into
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-sm md:text-base text-center md:text-left mb-6">
              Browse 40,000+ experiences and book with us
            </p>

            {/* Call to Action Button */}
            <div className="flex justify-center md:justify-start">3
            <Link href='/tours'>

              <Button className="bg-black hover:bg-neutral-800 text-white text-sm md:text-base px-6 py-2 rounded-full shadow-md transition duration-300">
                Book Now
              </Button>
             </Link>
            </div>
          </div>
        </div>

     {/* rotateimage */}
     <div className="relative isolate max-w-6xl mx-auto p-6 md:p-10 mt-20 bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-3xl shadow-xl backdrop-blur-sm border border-gray-300/50 mx-4">
          {/* Rotated image with shadow */}
          <div className="flex flex-wrap md:flex-nowrap gap-8 items-center">
            
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <Image
                src="/static/adventure2.webp"
                alt="Dynamic Travel"
                width={250}
                height={400}
                className="rounded-2xl shadow-xl rotate-6 hover:rotate-3 transition-transform duration-500 ease-in-out"
              />
            </div>

            {/* Text content */}
            <div className="flex flex-col justify-between text-black flex-1 h-full">
              
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-center md:text-left">
                Discover your next adventure
              </h2>

              <p className="mt-4 text-base md:text-lg text-gray-700 text-center md:text-left max-w-prose">
                Over <span className="font-semibold text-black">40,000+ experiences</span> are waiting for you. Explore caves, mountains, lakes and more — all curated for your next journey.
              </p>

              <div className="flex justify-center md:justify-start mt-6">
              
              <Link href="/tours/all">
              <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-full px-6 py-2 text-sm md:text-base shadow-lg transition-transform hover:scale-105">
                Book Now
              </Button>
            </Link>

              
              </div>
            </div>
          </div>
        </div>

     <Carousel/>
     <Carousel/>
  

     {/* imagerightflex */}
     <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10 gap-8">
  
  {/* Left Text Section */}
  <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
    <h2 className="text-3xl md:text-5xl font-bold text-black">Discover Oromia</h2>
    <p className="text-gray-700 text-base md:text-lg">
      Find breathtaking destinations and unique experiences tailored for you.
    </p>
    <button className="bg-black text-white font-semibold px-6 py-3 rounded-md hover:bg-green-700 transition">
      learn more
    </button>
  </div>

  {/* Right Image Section */}
  <div className="w-full md:w-1/2 flex justify-center">
   
     <Image
         src="/wanchi.jpg"
         alt="Dynamic Travel Image"
         width={250}
         height={400}
     className="rounded-xl w-[300px] md:w-[450px] object-cover"
       />
  </div>
     </div>

          {/* iconic  */}
     <div className="max-w-6xl mx-auto px-4 ">
      <h1 className="text-2xl md:text-2xl font-bold mt-20 pl-3">Iconic place you need to see</h1>

      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center mt-6 gap-8">
        {interests.map((interest) => (
          <Link
            key={interest.name}
            href={`/tours/${interest.name.toLowerCase()}`}
            className="relative w-full md:w-[45%] lg:w-[20%] h-78 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
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
