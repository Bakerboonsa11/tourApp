'use client';
import Slideshow from "./../components/ui/slideshow";
import Navbar from "@/components/customComponent/navigation";
import { Button } from "@/components/ui/button";
import ByInterest from "@/components/customComponent/byInterest";
import Carousel from "@/components/customComponent/corselAddis";
import Image from "next/image";
export default function Home() {
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
     
    </div>
  );
}
