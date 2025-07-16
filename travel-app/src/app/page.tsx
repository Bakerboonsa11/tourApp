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
      <Navbar />

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mt-10">Where to?</h1>
      <p className="text-center text-base md:text-lg mt-4">Explore the beauty of Oromia</p>

      {/* DYNAMIC IMAGE FLEXBOX */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-20 p-6 md:p-10 gap-8 bg-green-500 max-w-6xl mx-auto rounded-xl mx-4">
        <div className="w-full md:w-1/2">
          <Slideshow />
        </div>

        <div className="w-full md:w-1/2 space-y-4 text-black text-center md:text-left pl-4 md:pl-8">
          <h2 className="text-3xl md:text-6xl font-bold text-center">Find things to do for everything you are into</h2>
          <p className="text-base md:text-md text-center text-white/80">
            Browse over 40,000+ experiences and book with us
          </p>
          <div className="flex justify-center md:justify-center">
            <Button className="bg-black text-white hover:bg-neutral-800">Book Now</Button>
          </div>
        </div>
      </div>
     <ByInterest />
     <Carousel/>

     {/* rotateimage */}
     <div className="flex flex-wrap md:flex-nowrap items-start justify-between mt-20 p-4 md:p-6 gap-6 bg-gray-100 max-w-6xl mx-auto rounded-xl mx-4">
     
     {/* rotated image  */}
     <div className="w-full md:w-auto flex justify-center md:justify-start">
       <Image
         src="/harar.jpg"
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
     {/* rotateimage */}
     <div className="flex flex-wrap md:flex-nowrap items-start justify-between mt-20 p-4 md:p-6 gap-6 bg-gray-100 max-w-6xl mx-auto rounded-xl mx-4">
     
     {/* rotated image  */}
     <div className="w-full md:w-auto flex justify-center md:justify-start">
       <Image
         src="/redfox.jpg"
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
            href={interest.href}
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
