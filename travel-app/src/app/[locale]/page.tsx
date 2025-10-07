'use client';
import Slideshow from "../../components/ui/slideshow";
import ByInterest from "@/components/customComponent/byInterest";
import Carousel from "@/components/customComponent/corselAddis";
import CardCarouselCH from "@/components/customComponent/courselChipest";
import CardCarouselCurrent from "@/components/customComponent/courselCurrentLocation";
import MovingButton from "@/components/customComponent/movingbutton";
import Chatbot from "@/components/customComponent/Chatbot";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import clsx from "clsx";
import CardCarousel from '@/components/customComponent/carousalNearHarar';
import { useEffect, useState } from "react";
export default function Home() {

const t = useTranslations("home");
const [currentIndex, setCurrentIndex] = useState(0);

 const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const iconicPlaces = [
    { name: "Simien Mountains", href: "/tours/simien-mountains", image: "/static/mountain.webp", size: "large" },
    { name: "Lalibela", href: "/tours/lalibela", image: "/static/historic.avif", size: "small" },
    { name: "Danakil Depression", href: "/tours/danakil-depression", image: "/static/danakil9.jpg", size: "small" },
    { name: "Harar Jugol", href: "/tours/harar", image: "/harar.jpg", size: "wide" },
    { name: "Sof Omar Caves", href: "/tours/sof-omar", image: "/sof.jpg", size: "small" },
  ];

  const partners = [
    { name: "Partner 1", logo: "/static/agency1.png" },
    { name: "Partner 2", logo: "/static/agency2.jpg" },
    { name: "Partner 3", logo: "/static/agency3.png" },
    { name: "Partner 4", logo: "/static/agency4.jpg" },
    { name: "Partner 5", logo: "/static/agency5.jpg" },
    { name: "Partner 1", logo: "/static/agency1.png" }, // Duplicate for seamless scroll
    { name: "Partner 2", logo: "/static/agency2.jpg" },
    { name: "Partner 3", logo: "/static/agency3.png" },
    { name: "Partner 4", logo: "/static/agency4.jpg" },
    { name: "Partner 5", logo: "/static/agency5.jpg" },
  ];
    const images = [
    "/static/ethion1.webp",
    "/static/ethion2.jpg",
    "/static/ethion3.jpg",
    "/static/ethion4.jpg",
    "/static/ethion5.jpg",
    "/static/ethion6.jpg",
    "/static/ethion7.jpg",
       "/static/ethion7.jpg",
    "/static/ethion8.webp",
    "/static/ethion9.webp",
    "/static/ethion10.webp",
    "/static/ethion11.webp",
    "/static/ethion12.webp",
  ];

  const faqs = [
    { q: "What is the best time to visit Ethiopia?", a: "The best time to visit Ethiopia is during the dry season, which runs from October to June. This period offers pleasant temperatures and minimal rainfall, making it ideal for trekking and exploring historical sites." },
    { q: "Do I need a visa to travel to Ethiopia?", a: "Most nationalities require a visa to enter Ethiopia. You can obtain an e-VISA online before your travel through the official Ethiopian government website. It's recommended to check the latest visa policies for your specific nationality." },
    { q: "Is Ethiopia safe for tourists?", a: "Ethiopia is generally considered safe for tourists, especially in the main tourist areas. However, like any travel, it's wise to stay aware of your surroundings, avoid political demonstrations, and check your government's travel advisories for the latest information." },
    { q: "What currency is used in Ethiopia?", a: "The official currency is the Ethiopian Birr (ETB). While credit cards are accepted in some hotels and restaurants in Addis Ababa, it is highly recommended to carry enough cash, especially when traveling to more remote areas." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen overflow-x-hidden">
      <h1 className="text-4xl md:text-6xl font-bold text-center mt-10 text-gray-900 dark:text-white">
        {t('header')}
      </h1>
      <Chatbot />
      <p className="text-center text-base md:text-lg mt-4 text-gray-700 dark:text-gray-300">
        {t('explore')}
      </p>
      <MovingButton />

      <div className="flex flex-col md:flex-row items-center justify-between mt-20 p-6 md:p-12 gap-10 bg-gradient-to-br from-green-400 via-emerald-500 to-lime-500 max-w-7xl mx-auto rounded-3xl shadow-xl backdrop-blur-xl mx-4">
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
          <Slideshow />
        </div>
        <div className="w-full md:w-1/2 space-y-6 text-white text-center md:text-left px-4 md:px-8">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            {t('moveDiscover')} <span className="text-black/90">{t('moveexperiance')}</span><br />
            {t("moveIntrest")}
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-light">
            {t('40choose')} <span className="font-semibold text-white">40,000+</span> {t('40unforgetable')}
          </p>
          <div className="flex justify-center md:justify-start">
            <Link href={"/tours/all"} className="bg-black text-white hover:bg-white hover:text-black transition px-6 py-3 rounded-full font-medium shadow-md">
              {t('book')}
            </Link>
          </div>
        </div>
      </div>

      <ByInterest />
      <Carousel/>

      {/* Redesigned Discover Ethiopia Section */}
 <section className="relative max-w-7xl mx-auto mt-32 mb-20 px-6">
      <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] bg-black">

        {/* Dynamic background container */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-opacity duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: "contain", // prevents zoom/crop
            backgroundPosition: "center",
            opacity: 1,
          }}
        ></div>

        {/* Overlay gradients for cinematic look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>

        {/* Foreground content */}
        <div className="relative h-full flex items-center px-6 sm:px-10 md:px-16">
          <div className="max-w-xl text-white animate-fadeInUp">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-[0_5px_20px_rgba(0,0,0,0.8)]">
              {t("discoverEthiopiaTitle")}
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 mt-5 mb-10 leading-relaxed">
              {t("discoverEthiopiaDesc")}
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 ease-in-out">
              {t("learnMore")}
            </button>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>

      {/* Sub caption */}
      <p className="text-center text-gray-500 text-sm mt-6 italic">
        Explore the wonders of Ethiopia with us
      </p>
    </section>


      <CardCarouselCurrent/>
      <CardCarouselCH/>
    

      {/* Redesigned Iconic Places Section */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{t('iconicTitle')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            {iconicPlaces.map((place, i) => (
                <Link key={place.name} href={place.href} className={clsx(
                    "group relative overflow-hidden rounded-2xl shadow-lg",
                    {
                        'md:col-span-2 md:row-span-2': place.size === 'large',
                        'md:col-span-2': place.size === 'wide',
                    }
                )}>
                    <Image src={place.image} alt={place.name} layout="fill" objectFit="cover" className="transition-transform duration-500 ease-in-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-5">
                        <h3 className="text-xl font-bold text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1">{place.name}</h3>
                    </div>
                </Link>
            ))}
        </div>
      </section>
        <CardCarousel/>

      {/* Redesigned Trusted Partners Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 via-emerald-50/30 to-gray-50 dark:from-gray-900 dark:via-emerald-900/10 dark:to-gray-900 overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-400/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Title */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-green-500 to-green-100 bg-clip-text text-transparent drop-shadow-lg">
          Our Trusted Partners
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-3 text-base sm:text-lg">
          Collaborating with the most innovative brands worldwide
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        <div className="flex animate-marquee space-x-10 sm:space-x-16">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`partner-${i}`}
              className="flex-shrink-0 w-24 sm:w-32 md:w-40 lg:w-48 flex items-center justify-center transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-blue-500/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={100}
                  height={50}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-500 drop-shadow-md max-h-10 sm:max-h-12 md:max-h-14"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Gradient fade edges */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10"></div>

        {/* Marquee Animation */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
            width: max-content;
          }
        `}</style>
      </div>
    </section>

      {/* Redesigned FAQ Section */}
     <section className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-gray-50 via-emerald-50/30 to-gray-100 dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px]"></div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-start">
        {/* LEFT SIDE */}
        <div className="md:sticky top-28">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 via-green-500 to-green-100 bg-clip-text text-transparent leading-tight drop-shadow-md">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-md">
            Got questions? We’ve got you covered. Find all the details here — and if you still can’t find what you’re looking for, just{" "}
            <span className="text-emerald-500 font-semibold hover:underline cursor-pointer">
              contact us
            </span>.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              onClick={() => toggleFAQ(i)}
              className={`relative group cursor-pointer rounded-2xl border p-6 transition-all duration-500 
                ${
                  openIndex === i
                    ? "border-emerald-400/60 bg-white/90 dark:bg-gray-900/80 shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]"
                    : "border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800/60 hover:border-emerald-400/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.25)]"
                } backdrop-blur-md`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  {faq.q}
                </h3>
                <div
                  className={`transition-transform duration-300 ${
                    openIndex === i ? "rotate-45 text-emerald-400" : "text-gray-400"
                  }`}
                >
                  <Plus className="h-6 w-6" />
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === i ? "max-h-48 mt-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed border-l-4 border-emerald-400/40 pl-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    </div>
  );
}