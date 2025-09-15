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

export default function Home() {

const t = useTranslations("home");

  
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

  const faqs = [
    { q: "What is the best time to visit Ethiopia?", a: "The best time to visit Ethiopia is during the dry season, which runs from October to June. This period offers pleasant temperatures and minimal rainfall, making it ideal for trekking and exploring historical sites." },
    { q: "Do I need a visa to travel to Ethiopia?", a: "Most nationalities require a visa to enter Ethiopia. You can obtain an e-VISA online before your travel through the official Ethiopian government website. It's recommended to check the latest visa policies for your specific nationality." },
    { q: "Is Ethiopia safe for tourists?", a: "Ethiopia is generally considered safe for tourists, especially in the main tourist areas. However, like any travel, it's wise to stay aware of your surroundings, avoid political demonstrations, and check your government's travel advisories for the latest information." },
    { q: "What currency is used in Ethiopia?", a: "The official currency is the Ethiopian Birr (ETB). While credit cards are accepted in some hotels and restaurants in Addis Ababa, it is highly recommended to carry enough cash, especially when traveling to more remote areas." },
  ];
  
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
      <section className="max-w-7xl mx-auto mt-32 mb-20 px-6">
        <div className="relative bg-gray-800 rounded-3xl shadow-2xl overflow-hidden h-[500px]">
            <Image
                src="/static/ethio.avif"
                alt="Discover Ethiopia"
                layout="fill"
                objectFit="cover"
                className="opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="relative h-full flex items-center justify-start p-10 md:p-16">
                <div className="max-w-lg text-white">
                    <h2 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">{t('discoverEthiopiaTitle')}</h2>
                    <p className="text-lg text-gray-200 mt-4 mb-8">
                        {t('discoverEthiopiaDesc')}
                    </p>
                    <button className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all duration-300 ease-in-out">
                        {t('learnMore')}
                    </button>
                </div>
            </div>
        </div>
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

      {/* Redesigned Trusted Partners Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Trusted Partners</h2>
        </div>
        <div className="relative w-full overflow-hidden">
            <div className="flex animate-marquee">
                {partners.map((partner, i) => (
                    <div key={`p1-${i}`} className="flex-shrink-0 w-64 mx-8 flex items-center justify-center">
                        <Image src={partner.logo} alt={partner.name} width={150} height={60} className="object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
      </section>

      {/* Redesigned FAQ Section */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="md:sticky top-24">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">Frequently Asked Questions</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Have questions? Weve got answers. If you cant find what youre looking for, feel free to contact us.</p>
            </div>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <details key={i} className="group bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 cursor-pointer">
                        <summary className="flex items-center justify-between font-semibold text-lg text-gray-900 dark:text-white list-none">
                            {faq.q}
                            <div className="relative h-5 w-5 flex items-center justify-center ml-4">
                                <Plus className="h-5 w-5 transition-transform duration-300 group-open:rotate-45" />
                            </div>
                        </summary>
                        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.a}
                        </p>
                    </details>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}