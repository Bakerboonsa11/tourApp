'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSpring, animated } from '@react-spring/web';
import { 
  HelpCircle, 
  Quote, 
  Info, 
  PhoneCall, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Shield,
  Zap,
  X
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

function InfoSections() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 220, friction: 20 },
    delay: 100,
  });
}

const sections = [
  {
    title: 'Frequently Asked Questions ❓',
    bg: 'bg-slate-100',
    icon: <HelpCircle className="text-blue-600 w-6 h-6" />,
    content: (
      <ul className="list-disc space-y-2 px-5 text-gray-700 text-lg">
        <li>How to book tours?</li>
        <li>Can I get a refund?</li>
        <li>How early should I book?</li>
        <li>Do you offer private tours?</li>
      </ul>
    ),
  },
  {
    title: 'Customer Testimonials 💬',
    bg: 'bg-blue-100',
    icon: <Quote className="text-purple-600 w-6 h-6" />,
    content: (
      <>
        <p className="text-gray-800 text-lg italic">Amazing experience with Oromia Tours. Highly recommend!</p>
        <p className="text-gray-800 text-lg italic">Everything was smooth and well organized</p>
      </>
    ),
  },
  {
    title: 'About Oromia Tours',
    bg: 'bg-purple-100',
    icon: <Info className="text-indigo-600 w-6 h-6" />,
    content: (
      <p className="text-gray-700 text-lg">
        Oromia Tours was founded by passionate locals to showcase the beauty of Oromia to the world.
      </p>
    ),
  },
  {
    title: 'Contact Us 📞',
    bg: 'bg-gray-200',
    icon: <PhoneCall className="text-green-600 w-6 h-6" />,
    content: (
      <p className="text-gray-800 text-lg">
        For any queries, call us at <strong>+251-912-345-678</strong> or email at{' '}
        <a href="mailto:info@oromiatours.com" className="text-blue-600 underline">
          info@oromiatours.com
        </a>
      </p>
    ),
    centered: true,
  },
];

type FAQItem = {
  q: string;
  a: string;
};

export interface ITour {
  _id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  coverImage: string;
  location: {
    type?: string;
    coordinates?: number[];
    description?: string;
    address?: string;
  };
  startDates: string[];
  endDate: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  guides: string[];
}

const testimonials = [
  { id: 1, name: 'Amina', avatar: '/avatars/amina.jpg', text: 'Amazing experience with Oromia Tours. Highly recommend!' },
  { id: 2, name: 'Dawit', avatar: '/avatars/dawit.jpg', text: 'Everything was smooth and well organized.' },
];

type Comment = {
  message: string;
  userId: string;
  userImage: Date;
};

interface ToursPageProps {
  isDark?: boolean;
}

export default function ToursPage({ isDark = false }: ToursPageProps) {
  const pathname = usePathname();
  
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 220, friction: 20 },
    delay: 100,
  });

  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };
  
  const parts = pathname.split('/');
  const rawType = parts.length > 2 ? parts[3] : 'All';
  const initialType = decodeURIComponent(rawType);
  
  const [selectedType, setSelectedType] = useState(initialType);
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [filteredTours, setFilteredTours] = useState<ITour[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<Record<string, { userId: string }[]>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentCommentTour, setCurrentCommentTour] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations("tours");
  const faq = t.raw("faq.questions") as FAQItem[];  
    const [loginWarning, setLoginWarning] = useState<string | null>(null);

  const features = [
    { key: "localExperts", icon: Award },
    { key: "affordablePackages", icon: TrendingUp },
    { key: "safeComfortable", icon: Shield },
    { key: "flexibleBookings", icon: Zap }
  ];
  const [likedTours, setLikedTours] = useState<string[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/tours/`);
        const fetchedTours = res.data.instanceFiltered.map((tour:ITour) => ({
          ...tour,
          likes: tour.likes.map((like: string) => like.toString()),
        }));
        setAllTours(fetchedTours);
        setFilteredTours(fetchedTours);
      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/tours/`);
        const fetchedTours = res.data.instanceFiltered.map((tour: ITour) => ({
          ...tour,
          likes: tour.likes.map((like: string) => like.toString()),
        }));
        setAllTours(fetchedTours);
        setFilteredTours(fetchedTours);

        if (session?.user?.email) {
          const userRes = await axios.get(`/api/user/${session.user.email}`);
          const userId = userRes.data.data._id;
          const liked = fetchedTours
            .filter(tour => tour.likes.includes(userId))
            .map(tour => tour._id);
          setLikedTours(liked);
        }

      } catch (err) {
        console.error('Error fetching tours:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [session]);

  useEffect(() => {
    let filtered = [...allTours];
    if (selectedType !== 'All') {
      filtered = filtered.filter(tour => tour.typeOfTour.includes(selectedType));
    }
    if (selectedRegion !== 'All') {
      filtered = filtered.filter(tour => tour.region === selectedRegion);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(tour => tour.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredTours(filtered);
  }, [selectedType, selectedRegion, searchQuery, allTours]);

  const tourTypes = Array.from(
    new Set(allTours.flatMap(tour => tour.typeOfTour.map(type => type)))
  );

  const tourRegions = Array.from(
    new Set(allTours.map(tour => tour.region).filter(Boolean))
  );

const handleLike = async (tourId: string, currentLikes: string[]) => {
  try {
    const userEmail = session?.user?.email;
    if (!userEmail) {
      setLoginWarning("⚠️ Please login first to like this tour!");
      setTimeout(() => setLoginWarning(null), 3000); // hide after 3s
      return;
    }

    const userRes = await axios.get(`/api/user/${userEmail}`);
    const userId = userRes.data.data._id;

    const alreadyLiked = currentLikes.includes(userId);
    const updatedLikes = alreadyLiked
      ? currentLikes.filter((id) => id !== userId)
      : [...currentLikes, userId];

    await axios.patch(`/api/tours/${tourId}`, { likes: updatedLikes });

    setAllTours((prev) =>
      prev.map((tour) =>
        tour._id === tourId ? { ...tour, likes: updatedLikes } : tour
      )
    );

    setLikedTours((prev) =>
      alreadyLiked ? prev.filter((id) => id !== tourId) : [...prev, tourId]
    );
  } catch (error) {
    console.error("Failed to like tour:", error);
  }
};

  const openCommentModal = (id: string) => {
    setCurrentCommentTour(id);
    setComment('');
    setShowCommentModal(true);
  };

  const handleSubmitComment = async () => {
    try {
      const res = await axios.get(`/api/tours/${currentCommentTour}`);
      const user = await axios.get(`/api/user/${session?.user?.email}`);
      const fetchedTour: ITour = res.data.data;
      const newComment = {
        message: comment,
        userId: session?.user.id,
        userImage: session?.user.image || '',
        name: session?.user.name || `${user.data.first_name}`,
      };
      const updatedComments = [...fetchedTour.comments, newComment];
      const dataAfterResponse = await axios.patch(`/api/tours/${currentCommentTour}`, { comments: updatedComments });
    } catch (err) {
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
    setShowCommentModal(false);
  };

  const getTourStatus = (startDates: string[], endDate?: string) => {
    if (!endDate || !startDates || startDates.length === 0) 
      return { label: 'No Date', color: 'bg-gray-500' };
    
    const today = new Date();
    const end = new Date(endDate);
    const starts = startDates.map(dateStr => new Date(dateStr)).sort((a, b) => a.getTime() - b.getTime());
  
    if (today > end) {
      return { label: 'Finished', color: 'bg-red-500' };
    }
  
    if (today < starts[0]) {
      const diffDays = Math.ceil((starts[0].getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { label: `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'bg-emerald-500' };
    }
  
    for (const start of starts) {
      if (today >= start && today <= end) {
        const diffDaysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDaysLeft === 0) {
          return { label: 'Last Day', color: 'bg-amber-500' };
        }
        return { label: `${diffDaysLeft} day${diffDaysLeft > 1 ? 's' : ''} left`, color:'bg-orange-500' };
      }
    }
  
    const diffDaysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { label: `${diffDaysLeft} day${diffDaysLeft > 1 ? 's' : ''} left`, color: 'bg-emerald-500' };
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedRegion('All');
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'
    }`}>

      {loginWarning && (
  <div className="fixed top-6 right-6 z-[9999] animate-fade-in">
    <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 backdrop-blur-md border border-white/10">
      <span>⚠️</span>
      <span>{loginWarning}</span>
    </div>
  </div>
)}

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
          isDark 
            ? 'bg-gradient-to-br from-emerald-600/20 to-green-600/20' 
            : 'bg-gradient-to-br from-emerald-400/20 to-green-400/20'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
          isDark 
            ? 'bg-gradient-to-tr from-teal-600/20 to-emerald-600/20' 
            : 'bg-gradient-to-tr from-teal-400/20 to-emerald-400/20'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
          isDark 
            ? 'bg-gradient-to-r from-green-600/10 to-emerald-600/10' 
            : 'bg-gradient-to-r from-green-300/10 to-emerald-300/10'
        }`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-center py-16 px-8 rounded-3xl shadow-2xl text-white relative overflow-hidden mt-12 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600' 
              : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
          }`}
        >
          <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-black/10'}`}></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className={`inline-block p-4 rounded-full mb-6 ${
                isDark ? 'bg-white/30' : 'bg-white/20'
              }`}
            >
              <Sparkles className="w-12 h-12 text-yellow-300" />
            </motion.div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
              isDark 
                ? 'from-white to-emerald-100' 
                : 'from-white to-green-100'
            }`}>
              {t("seasonalDeals.title")}
            </h1>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
              isDark ? 'text-emerald-100' : 'text-green-100'
            }`}>
              {t("seasonalDeals.desc")}
            </p>
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="w-3 h-3 bg-white/30 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/10 rounded-full"></div>
        </motion.section>

        {/* Statistics Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: "Happy Travelers", value: "10,000+", icon: Users, color: "from-emerald-500 to-green-500" },
            { label: "Tour Destinations", value: "50+", icon: MapPin, color: "from-green-500 to-teal-500" },
            { label: "Years Experience", value: "15+", icon: Award, color: "from-teal-500 to-emerald-500" },
            { label: "Success Rate", value: "99%", icon: Star, color: "from-emerald-600 to-green-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8" />
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
              <p className="text-green-100 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Why Choose Us */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4 ${
              isDark 
                ? 'from-emerald-400 to-green-400' 
                : 'from-emerald-600 to-green-600'
            }`}>
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {features.map(({ key, icon: Icon }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`group backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800/80 border border-gray-700 hover:bg-gray-700/80' 
                    : 'bg-white/80 border border-green-100'
                }`}
              >
                <div className={`bg-gradient-to-r text-white w-16 h-16 mx-auto flex items-center justify-center rounded-2xl shadow-lg group-hover:rotate-12 transform transition duration-300 mb-6 ${
                  isDark 
                    ? 'from-emerald-600 to-green-600' 
                    : 'from-emerald-500 to-green-500'
                }`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>{t(`whyChooseUs.${key}.title`)}</h3>
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{t(`whyChooseUs.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Enhanced Filters */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <Card className={`backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden ${
            isDark 
              ? 'bg-gray-800/90 border border-gray-700' 
              : 'bg-white/90'
          }`}>
            <CardHeader className={`text-white p-8 ${
              isDark 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
                : 'bg-gradient-to-r from-emerald-500 to-green-500'
            }`}>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Search className="w-6 h-6" />
                Find Your Perfect Adventure
              </CardTitle>
              <CardDescription className={`text-lg ${
                isDark ? 'text-emerald-100' : 'text-green-100'
              }`}>
                Search and filter through our amazing collection of tours
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-500'
                  }`} />
                  <input
                    type="text"
                    placeholder={t('filters.searchPlaceholder')}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:ring-4 transition-all ${
                      isDark 
                        ? 'border-gray-600 focus:border-emerald-400 focus:ring-emerald-400/20 bg-gray-700/50 text-white placeholder-gray-400' 
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50 text-gray-800 placeholder-emerald-400'
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <Filter className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-500'
                  }`} />
                  <select
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:ring-4 transition-all appearance-none cursor-pointer ${
                      isDark 
                        ? 'border-gray-600 focus:border-emerald-400 focus:ring-emerald-400/20 bg-gray-700/50 text-white' 
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50 text-gray-800'
                    }`}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="All">{t('filters.allTypes')}</option>
                    {tourTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-500'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-500'
                  }`} />
                  <select
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 focus:ring-4 transition-all appearance-none cursor-pointer ${
                      isDark 
                        ? 'border-gray-600 focus:border-emerald-400 focus:ring-emerald-400/20 bg-gray-700/50 text-white' 
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200 bg-emerald-50/50 text-gray-800'
                    }`}
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="All">All Regions</option>
                    {tourRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <div className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-500'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Results:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    isDark 
                      ? 'bg-emerald-900/50 text-emerald-300' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {filteredTours.length}
                  </span>
                </div>

                <button
                  onClick={clearFilters}
                  className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all duration-200 font-medium hover:scale-105 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Tour Cards */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
              <p className={`text-xl font-medium mt-4 ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>{t('loading')}...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour, index) => {
                const { label, color } = getTourStatus(tour.startDates, tour.endDate);
                
                return (
                  <motion.div
                    key={tour.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`group backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden ${
                      isDark 
                        ? 'bg-gray-800/90 hover:bg-gray-700/90' 
                        : 'bg-white/90'
                    }`}>
                      <CardHeader className="p-0 relative overflow-hidden">
                        <div className="relative">
                          
                          <Image
                            src={`/toursphoto/${tour?.coverImage}` || '/wanchi.jpg'}
                            alt={tour.name}
                            width={500}
                            height={300}
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            isDark ? 'from-black/70' : 'from-black/50'
                          }`}></div>
                          <div className="absolute top-4 right-4">
                            <Badge className={`${color} text-white font-bold shadow-lg`}>
                              {label}
                            </Badge>
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge className={`font-bold shadow-lg ${
                              isDark 
                                ? 'bg-gray-900/90 text-emerald-400' 
                                : 'bg-white/90 text-emerald-700'
                            }`}>
                              ETB {tour.price.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <CardTitle className={`text-xl font-bold mb-2 line-clamp-2 ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}>
                            {tour.name}
                          </CardTitle>
                          <CardDescription className={`line-clamp-3 ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {tour.description}
                          </CardDescription>
                        </div>

                        <div className={`flex items-center justify-between text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{tour.duration} days</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{tour.region}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Max {tour.maxGroupSize}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{tour.ratingsAverage || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleLike(tour._id, tour.likes)}
                            className={`flex items-center space-x-2 transition-all duration-300 ${
                              isDark 
                                ? 'border-gray-600 hover:border-emerald-400 hover:bg-emerald-900/20 text-gray-300 hover:text-emerald-400' 
                                : 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50'
                            }`}
                          >
                            <motion.div
                              whileTap={{ scale: 0.8 }}
                              animate={{
                                scale: likedTours.includes(tour._id) ? [1, 1.2, 1] : 1,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Heart
                                className={`w-4 h-4 transition-all duration-300 ${
                                  likedTours.includes(tour._id)
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </motion.div>
                            <span className="text-sm">{tour.likes.length}</span>
                          </Button>

                          <Button
                            onClick={() => openCommentModal(tour._id)}
                            variant="outline"
                            className={`flex items-center gap-2 transition-all duration-300 ${
                              isDark 
                                ? 'border-gray-600 hover:border-emerald-400 hover:bg-emerald-900/20 text-gray-300 hover:text-emerald-400' 
                                : 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50'
                            }`}
                          >
                            <span className="text-sm">💬</span>
                            <span className="text-sm">{tour.comments?.length || 0}</span>
                          </Button>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-6 pt-0">
                        <Button asChild className={`w-full text-white font-medium py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                          isDark 
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' 
                            : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
                        }`}>
                          <Link href={`/${locale}/detail/${tour._id}`}>
                            {t('cards.viewTour')}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {filteredTours.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isDark 
                  ? 'bg-gray-700 text-emerald-400' 
                  : 'bg-emerald-100 text-emerald-500'
              }`}>
                <Search className="w-12 h-12" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>No tours found</h3>
              <p className={`max-w-md mx-auto mb-6 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Try adjusting your search criteria or clear the filters to see all available tours.
              </p>
              <Button onClick={clearFilters} className={`${
                isDark 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}>
                Clear Filters
              </Button>
            </div>
          )}
        </motion.section>

        {/* Comment Modal */}
        {showCommentModal && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4 py-6 ${
            isDark ? 'bg-black/70' : 'bg-black/50'
          }`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`relative w-full max-w-lg rounded-3xl shadow-2xl p-8 ${
                isDark 
                  ? 'bg-gray-800 border border-gray-600' 
                  : 'bg-white border border-emerald-200'
              }`}
            >
              <button
                onClick={() => setShowCommentModal(false)}
                className={`absolute top-4 right-4 transition-colors p-2 rounded-full ${
                  isDark 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-500'
                }`}>
                  <Quote className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {t('modal.title')}
                </h2>
              </div>

              <textarea
                className={`w-full resize-none rounded-2xl border-2 px-4 py-3 focus:ring-4 transition-all ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700/50 text-white focus:border-emerald-400 focus:ring-emerald-400/20 placeholder:text-gray-400' 
                    : 'border-emerald-200 bg-emerald-50/50 text-gray-800 focus:border-emerald-500 focus:ring-emerald-200 placeholder:text-emerald-400'
                }`}
                placeholder={t('modal.placeholder')}
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setShowCommentModal(false)}
                  variant="outline"
                  className={`flex-1 ${
                    isDark 
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {t('modal.cancel')}
                </Button>
                <Button
                  onClick={handleSubmitComment}
                  className={`flex-1 text-white ${
                    isDark 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' 
                      : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
                  }`}
                >
                  {t('modal.post')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Upcoming Events */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className={`py-16 px-8 rounded-3xl shadow-lg ${
            isDark 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
              : 'bg-gradient-to-r from-emerald-100 to-green-100'
          }`}
        >
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 flex items-center justify-center gap-3 ${
              isDark ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              <Calendar className="w-10 h-10" />
              Upcoming Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { 
                title: "Cultural Festival", 
                date: "Oct 15, 2025", 
                desc: "Celebrate local traditions with food, dance, and music.",
                icon: Sparkles,
                color: "from-emerald-500 to-green-500"
              },
              { 
                title: "Hiking Adventure", 
                date: "Nov 5, 2025", 
                desc: "Join fellow travelers for a guided trek in the Simien Mountains.",
                icon: MapPin,
                color: "from-green-500 to-teal-500"
              },
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + idx * 0.1 }}
                className={`group backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-emerald-500 ${
                  isDark 
                    ? 'bg-gray-800/80 hover:bg-gray-700/80' 
                    : 'bg-white/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${event.color} p-3 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300`}>
                    <event.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${
                      isDark ? 'text-emerald-300' : 'text-emerald-800'
                    }`}>{event.title}</h3>
                    <p className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </p>
                    <p className={`leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{event.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className={`backdrop-blur-sm rounded-3xl p-10 shadow-xl ${
            isDark 
              ? 'bg-gray-800/80 border border-gray-700' 
              : 'bg-white/80 border border-emerald-100'
          }`}
        >
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-bold mb-4 flex items-center justify-center gap-3 ${
              isDark ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              <HelpCircle className={`w-10 h-10 ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`} />
              {t('faq.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faq.map(({ q, a }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.1 }}
                className={`rounded-2xl overflow-hidden ${
                  isDark 
                    ? 'bg-gray-700/50 border border-gray-600' 
                    : 'bg-emerald-50/50 border border-emerald-100'
                }`}
              >
                <button
                  className={`w-full px-8 py-6 text-left flex justify-between items-center transition-colors duration-200 ${
                    isDark 
                      ? 'hover:bg-gray-600/50' 
                      : 'hover:bg-emerald-100/50'
                  }`}
                  onClick={() => toggleFaq(i)}
                >
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-emerald-200' : 'text-emerald-900'
                  }`}>{q}</h3>
                  <motion.div
                    animate={{ rotate: openFaqIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-2xl font-bold ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`}
                  >
                    +
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaqIndex === i ? "auto" : 0,
                    opacity: openFaqIndex === i ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6">
                    <p className={`leading-relaxed ${
                      isDark ? 'text-emerald-300' : 'text-emerald-800'
                    }`}>{a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}