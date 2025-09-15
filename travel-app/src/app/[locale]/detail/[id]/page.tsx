'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { Currency } from 'lucide-react';
import { useTranslations } from 'next-intl';
const Map = dynamic(() => import('../../../../components/customComponent/Map'), { ssr: false });
// 



export interface ITour {
  _id: string;
  status: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[]; // assuming it's an array of categories like ['nature', 'cave', 'hiking']
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[]; // array of image filenames or URLs
  coverImage: string;
  location: {
    type?: string;
    coordinates?: number[];
    description?: string;
    address?: string;
  };
  startDates: string[]; // ISO date strings
  endDate: string; // ISO date string
  likes: string[]; // array of user IDs or emails
  comments: Comment[]; // you can define Comment type separately
  createdAt: string; // ISO date string
  guides: string[]; // array of guide user IDs
}

export interface Comment {
  message: string;
  userId: string;
  userImage: string;
  name:string;
  createdAt: string; // ISO date string
}


export default function TourDetailPage() {

    const t=useTranslations('detail')
    const { data: session } = useSession();
    console.log("Session Data: user", session?.user);
    
  const params = useParams();
  const id = params?.id;
  console.log("Tour ID when it is in the page:", id);
  console.log('session usser', session?.user);
  const [currentour, setCurrentTour] = useState<ITour | null>(null);
   const [showCommentModal, setShowCommentModal] = useState(false);
    const [currentCommentTour, setCurrentCommentTour] = useState<string | null>(null);
    const [comment, setComment] = useState('');
   const [loading, setLoading] = useState(false);
   const [paymentLoading, setPaymentLoading] = useState(false);
    
    const [allComments, setAllComments] = useState<Comment[]>([]);
     const openCommentModal = (id: string) => {
        setCurrentCommentTour(id);
        setComment('');
        setShowCommentModal(true);
      };
    
      const handleSubmitComment = async () => {
        try {
          const user = await axios.get(`/api/user/${session?.user?.email}`);
          console.log('user is looooooooooooooooooo[ ', user);
          const userId = session?.user?.id;
          const newComment: Comment = {
            message: comment,
            userId: userId || session?.user?.id || '',
            userImage: user.data.data.image || '',
            name: session?.user.name || user.data.first_name,
            createdAt: new Date().toISOString(),
          };
        
          const updatedComments = [...(currentour?.comments ?? []), newComment];
        
          // Sort comments descending by createdAt (newest first)
          updatedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
          const res = await axios.patch(`/api/tours/${id}`, {
            comments: updatedComments,
          });
        
          setAllComments(updatedComments);
          console.log("Comment successfully updated:", res.data);
        } 
         catch (err) {
          console.error('Error submitting comment:', err);
        } finally {
          setLoading(false);
          setShowCommentModal(false);
        }
      };
      

    const handlePayment = async () => {
      if (!session || !session.user) {
        alert("Please log in first to book a tour.");
        return;
      }
    
      if (!id || !currentour) {
        alert("Tour data is missing.");
        return;
      }
    
      // ⛔️ Stop if tour is finished
      if (currentour?.status === 'finished') {
        alert("This tour has already finished. You cannot book it.");
        return;
      }
    
      // ⛔️ Stop if tour is active but not pending
      if (currentour.status === 'active') {
        alert("This tour is already booked or process.");
        return;
      }
    
      try {
        setPaymentLoading(true);
    
        // const tx_ref = `tx-${id}-${Date.now()}`;
        console.log("current tour is: ", currentour);
    
        const res = await fetch('/api/initiate-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tourId: id,
            amount: currentour.price,
            userEmail: session.user.email,
            first_name: session.user.name || 'John',
            phone_number: '0912345678',
          
            // return_url: `http://${process.env.NEXTAUTH_URL}/payment-success?tx_ref=${tx_ref}`,
          }),
        });
    
        const data = await res.json();
    
        if (res.ok && data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          console.error("Payment error:", data);
          alert(data.message || "Payment initiation failed.");
        }
    
      } catch (err) {
        console.error("Payment exception:", err);
        alert("An unexpected error occurred.");
      } finally {
        setPaymentLoading(false);
      }
    };
    
    
  
    useEffect(() => {
      const fetchTours = async () => {
        setLoading(true);
        try {
          console.log("Fetching tour with ID:", id);
          const res = await axios.get(`/api/tours/${id}`);
          const fetchedTour: ITour = res.data.data;
          setCurrentTour(fetchedTour);
          setAllComments(fetchedTour.comments || []);
          
          console.log("current tour is vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv ",fetchedTour)
          // setFilteredTours(fetchedTours);
        } catch (err) {
          console.error('Error fetching tours:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTours();
      
    }, []);

   const findImage= async ()=>{

    try {
      console.log("Fetching tour with ID:", id);
      const res = await axios.get(`/api/tours/${id}`);
      const fetchedTour: ITour = res.data.data;
      setCurrentTour(fetchedTour);
      setAllComments(fetchedTour.comments || []);
      
      console.log("current tour is vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv ",fetchedTour)
      // setFilteredTours(fetchedTours);
    } catch (err) {
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
   }

    return (
      <div className="max-w-7xl mx-auto p-6 space-y-16">
        {/* Hero Section */}
        <section className="relative font-sans">
  {/* === HERO COVER === */}
  <div className="relative w-full h-[80vh] md:h-[90vh] lg:h-[95vh] overflow-hidden rounded-b-[4rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
    <Image
      src={
        currentour?.coverImage
          ? `/toursphoto/${currentour.coverImage}`
          : '/default-cover.jpg'
      }
      alt={currentour?.name || 'Tour Cover'}
      fill
      className="object-cover scale-105 hover:scale-110 transition-transform duration-[1200ms] ease-out"
      priority
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 backdrop-blur-[3px]" />

    {/* Hero Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
      <Badge className="bg-gradient-to-r from-emerald-400 to-green-600 text-white px-8 py-2 rounded-full shadow-2xl backdrop-blur-sm mb-6 animate-pulse">
        {t('badge')}
      </Badge>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold drop-shadow-[0_10px_40px_rgba(0,0,0,0.7)] leading-tight tracking-tight">
        {currentour?.name}
      </h1>
      <p className="mt-6 text-lg md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto font-light drop-shadow-lg">
        {t('heroText')}
      </p>
      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        <Badge variant="outline" className="bg-white/20 text-white px-5 py-2 rounded-full shadow-md backdrop-blur-md">
          {currentour?.region}
        </Badge>
        {currentour?.typeOfTour.map((type) => (
          <Badge
            key={type}
            className="bg-white/20 text-white capitalize px-5 py-2 rounded-full shadow-md backdrop-blur-md"
          >
            {type}
          </Badge>
        ))}
      </div>
    </div>
  </div>

  {/* === TOUR DETAILS === */}
  <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20 space-y-16">
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-500 to-green-700 bg-clip-text text-transparent drop-shadow-lg">
        💵 {t('startingFrom')} {currentour?.price}
      </p>
      <p className="text-gray-600 mt-4 text-lg">
        {currentour?.ratingsAverage} ★ ({currentour?.ratingsQuantity} {t('reviews')})
      </p>
    </div>

    {/* Highlights */}
   {/* Highlights */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
  {[
    { label: t('duration'), value: currentour?.duration || '5 days' },
    { label: t('groupSize'), value: currentour?.maxGroupSize || '10 people' },
    { label: t('difficulty'), value: currentour?.difficulty || 'Moderate' },
    { label: t('location'), value: currentour?.region }
  ].map((item, idx) => (
    <div
      key={idx}
      className="bg-gradient-to-br from-white/80 to-green-50/70 
                 backdrop-blur-md shadow-lg hover:shadow-2xl 
                 rounded-3xl p-6 border border-green-100 
                 transition-all transform hover:-translate-y-2 hover:scale-105 
                 flex flex-col items-center justify-center min-h-[120px] max-w-full"
    >
      <h4 className="text-lg md:text-xl font-bold text-emerald-700 tracking-wide whitespace-normal break-words">
        {item.label}
      </h4>
      <p className="mt-2 text-sm md:text-lg text-gray-700 font-medium whitespace-normal break-words max-w-[10rem] md:max-w-[12rem] leading-snug">
        {item.value}
      </p>
    </div>
  ))}
</div>


    {/* === COMMENTS / REVIEWS === */}
    <div className="max-w-4xl mx-auto mt-20">
  <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent text-center mb-12">
    {t('userComments')}
  </h2>

  <div className="h-80 overflow-y-auto bg-white/60 backdrop-blur-md rounded-3xl shadow-inner px-4 md:px-6 py-5 space-y-5 border border-emerald-200">
    {Array.isArray(allComments) && allComments.length > 0 ? (
      allComments.map((comment, index) => (
        <div
          key={index}
          className="flex items-start gap-4 bg-white/80 hover:bg-white rounded-2xl px-4 md:px-6 py-4 shadow-md border border-emerald-100 transition-all hover:scale-[1.01]"
        >
          {/* User Image */}
          <Image
            src={comment.userImage ? `/userimages/${comment.userImage}` : '/pro.png'}
            alt="User"
            width={48}
            height={48}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-green-200 shadow-sm flex-shrink-0"
          />

          {/* Comment Content */}
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm md:text-base text-gray-800 font-medium mb-1 whitespace-normal break-words leading-relaxed">
              {comment.message}
            </p>
            <p className="text-xs text-gray-500 italic truncate">
              {comment.name || 'Anonymous'}
            </p>
          </div>

          {/* Date */}
          <p className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 text-center">{t('noComments')}</p>
    )}
  </div>

  {/* Comment Button */}
  <div className="mt-10 text-center">
    <Button
      onClick={() => {
        if (typeof id === 'string') {
          openCommentModal(id);
        }
      }}
      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-full px-8 md:px-10 py-3 md:py-4 shadow-xl hover:scale-105 transition-all duration-300"
    >
      {t('leaveComment')}
    </Button>
  </div>
</div>

  </div>

  {/* === COMMENT MODAL === */}
  {showCommentModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="relative w-full max-w-lg rounded-3xl bg-white/95 shadow-2xl border border-gray-200 p-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => setShowCommentModal(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition text-xl"
        >
          ✕
        </button>

        <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-6">
          {t('leaveYourThoughts')}
        </h2>

        <textarea
          className="w-full resize-none rounded-2xl border border-green-300 bg-green-50/80 px-5 py-4 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
          placeholder="Type your comment here..."
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:justify-between">
          <button
            onClick={() => setShowCommentModal(false)}
            className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full py-3 transition-all shadow-sm"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmitComment}
            className="w-full sm:w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-full py-3 transition-all shadow-md hover:scale-105"
          >
            {t('post')}
          </button>
        </div>
      </div>
    </div>
  )}
</section>






    {/* Description */}
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-green-100 rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 space-y-8 overflow-hidden">
  {/* Background Glow */}
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-green-200/30 via-emerald-100/20 to-transparent blur-2xl" />

  {/* Title */}
  <h2 className="relative text-4xl md:text-5xl font-extrabold text-emerald-900 flex items-center gap-3 justify-center drop-shadow-sm">
    <span className="inline-block w-2 h-10 bg-gradient-to-b from-green-500 to-emerald-700 rounded-full shadow-md"></span>
    {t('aboutTour')}
  </h2>

  {/* Description */}
  <p className="relative text-gray-700 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto text-center sm:text-justify backdrop-blur-sm bg-white/70 px-6 py-4 rounded-2xl shadow-inner border border-green-100">
    {currentour?.description}
  </p>
</section>


{/* Why Choose This Tour */}
<section className="p-8 md:p-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 rounded-3xl shadow-inner">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center text-emerald-900 mb-12 tracking-tight">
    {t('whyChoose')}
  </h2>

  <ul className="space-y-8 max-w-4xl mx-auto">
    <li className="flex items-start gap-4 md:gap-6">
      <span className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-2xl shadow-lg flex-shrink-0">
        ✅
      </span>
      <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed border-l-4 border-emerald-300 pl-4">
        {t('why1')}
      </p>
    </li>

    <li className="flex items-start gap-4 md:gap-6">
      <span className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white text-2xl shadow-lg flex-shrink-0">
        🦊
      </span>
      <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed border-l-4 border-orange-300 pl-4">
        {t('why2')}
      </p>
    </li>

    <li className="flex items-start gap-4 md:gap-6">
      <span className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-2xl shadow-lg flex-shrink-0">
        🌄
      </span>
      <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed border-l-4 border-blue-300 pl-4">
        {t('why3')}
      </p>
    </li>

    <li className="flex items-start gap-4 md:gap-6">
      <span className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white text-2xl shadow-lg flex-shrink-0">
        🏛️
      </span>
      <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed border-l-4 border-purple-300 pl-4">
        {t('why4')}
      </p>
    </li>
  </ul>
</section>


{/* Tour Highlights */}
<section className="space-y-10">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-900 bg-clip-text text-transparent drop-shadow-md">
    {t('tourHighlights')}
  </h2>

  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    {/* Duration */}
    <Card className="group bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 shadow-lg rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-green-200/50">
      <CardContent className="p-8 text-center relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-200/50 rounded-full blur-2xl"></div>
        <p className="text-3xl font-extrabold text-emerald-900 drop-shadow">{currentour?.duration} Days</p>
        <p className="text-gray-700 mt-3 group-hover:text-emerald-900 transition">{t('highlightDuration')}</p>
      </CardContent>
    </Card>

    {/* Difficulty */}
    <Card className="group bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 shadow-lg rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-emerald-200/50">
      <CardContent className="p-8 text-center relative overflow-hidden">
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-green-200/50 rounded-full blur-3xl"></div>
        <p className="text-3xl font-extrabold text-emerald-900 capitalize">{currentour?.difficulty}</p>
        <p className="text-gray-700 mt-3 group-hover:text-green-900 transition">{t('highlightDifficulty')}</p>
      </CardContent>
    </Card>

    {/* Group Size */}
    <Card className="group bg-gradient-to-br from-emerald-100 via-green-200 to-emerald-300 shadow-lg rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-green-300/50">
      <CardContent className="p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 bg-emerald-200/40 rounded-full blur-3xl"></div>
        <p className="text-3xl font-extrabold text-emerald-900">{currentour?.maxGroupSize} People</p>
        <p className="text-gray-700 mt-3 group-hover:text-emerald-900 transition">{t('highlightGroup')}</p>
      </CardContent>
    </Card>

    {/* Slots */}
    <Card className="group bg-gradient-to-br from-green-100 via-emerald-200 to-green-300 shadow-lg rounded-3xl hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-emerald-300/50">
      <CardContent className="p-8 text-center relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-green-300/40 rounded-full blur-2xl"></div>
        <p className="text-3xl font-extrabold text-emerald-900">{currentour?.startDates.length} Dates</p>
        <p className="text-gray-700 mt-3 group-hover:text-green-900 transition">{t('highlightSlots')}</p>
      </CardContent>
    </Card>
  </div>
</section>


{/* Upcoming Dates */}
<section className="space-y-10">
  <h2 className="text-4xl md:text-5xl font-extrabold flex items-center gap-3 text-center justify-center bg-gradient-to-r from-emerald-600 to-green-800 bg-clip-text text-transparent drop-shadow">
    📅 {t('upcoming')}
  </h2>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {currentour?.startDates.map((date) => (
      <div
        key={date}
        className="group relative bg-gradient-to-br from-white via-emerald-50 to-green-100 border border-emerald-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-500 hover:scale-105"
      >
        {/* Decorative orb */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-200/50 rounded-full blur-2xl group-hover:scale-125 transition"></div>

        <p className="text-xl font-bold text-emerald-900 relative z-10">
          {new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

        <p className="mt-2 text-sm text-gray-600 relative z-10">
          {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </div>
    ))}
  </div>
</section>


    
        {/* Image Gallery */}
      {/* Gallery */}
      <section className="space-y-10">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-green-800 bg-clip-text text-transparent drop-shadow">
    🖼️ {t('gallery')}
  </h2>

  <div className="columns-2 md:columns-3 gap-5 [column-fill:_balance] space-y-5">
    {currentour?.images.map((img, index) => (
      <div
        key={index}
        className="relative overflow-hidden rounded-3xl shadow-lg group hover:shadow-2xl transition-all duration-500 break-inside-avoid"
      >
        {/* Floating gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-green-500/20 opacity-0 group-hover:opacity-100 transition duration-500"></div>

        <Image
          src={`/toursphoto/${img}`}
          alt={`Image ${index + 1}`}
          width={600}
          height={400}
          className="w-full h-auto rounded-3xl object-cover transform group-hover:scale-110 transition duration-700"
        />

        {/* Fancy overlay text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-white font-semibold text-lg tracking-wide transition duration-500">
         tour image
        </div>
      </div>
    ))}
  </div>
</section>


{/* What’s Included */}
<section className="relative space-y-10 mt-12 px-6 md:px-12">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-800 drop-shadow-lg flex items-center justify-center gap-3">
    ✅ {t('included.title')}
  </h2>

  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[
      { icon: "🏨", text: t('included.accommodation') },
      { icon: "🥗", text: t('included.meals') },
      { icon: "🧭", text: t('included.guides') },
      { icon: "🚌", text: t('included.transportation') },
    ].map((item, idx) => (
      <div
        key={idx}
        className="relative flex flex-col items-center text-center p-6 rounded-3xl shadow-2xl hover:scale-105 hover:-translate-y-2 transition-transform duration-500 group bg-gradient-to-tr from-white/80 via-green-50/60 to-green-100/80 border border-emerald-200"
      >
        {/* Floating Circle behind icon */}
        <div className="absolute -top-5 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 opacity-30 animate-pulse blur-xl group-hover:opacity-50 transition"></div>

        {/* Icon */}
        <span className="relative text-5xl z-10">{item.icon}</span>

        {/* Text */}
        <p className="mt-5 relative z-10 text-lg md:text-xl font-semibold text-gray-800">{item.text}</p>
      </div>
    ))}
  </div>
</section>


{/* Call To Action */}
<section className="relative mt-16">
  <div className="absolute inset-0 bg-[url('/cta-bg.jpg')] bg-cover bg-center rounded-3xl opacity-20"></div>
  <div className="relative text-center bg-emerald-800/90 p-12 rounded-3xl shadow-2xl space-y-6 text-white">
    <h2 className="text-5xl font-extrabold drop-shadow-lg">
      {t('ready')}<span className="text-yellow-300">{currentour?.name}</span>?
    </h2>
    <p className="text-lg max-w-2xl mx-auto">
      {` ${currentour?.typeOfTour[0]} ${t('book')}`}
    </p>
    <Button
      onClick={handlePayment}
      className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:scale-105 transition"
    >
      ✈️   {t('bookNow')} - {currentour?.price} <Currency className="inline-block mb-1" size={16} />
    </Button>
  </div>
</section>
{/* tour tips */}
<section className="py-16 px-6 max-w-6xl mx-auto">
  <h2 className="text-3xl font-bold text-center text-green-800 mb-10">
    Travel Tips ✈️
  </h2>
  <div className="grid md:grid-cols-3 gap-8">
    {[
      { title: "Pack Light", desc: "Carry essentials only. A light backpack makes your trip easier." },
      { title: "Stay Hydrated", desc: "Always keep a water bottle with you while exploring." },
      { title: "Respect Culture", desc: "Learn basic local greetings and respect traditions." },
    ].map((tip, i) => (
      <div
        key={i}
        className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl border-t-4 border-green-500 transition"
      >
        <h3 className="text-xl font-semibold text-green-700">{tip.title}</h3>
        <p className="mt-2 text-gray-600">{tip.desc}</p>
      </div>
    ))}
  </div>
</section>
{/* Map Section */}
<section className="space-y-6 mt-16">
  <h2 className="text-4xl font-extrabold text-emerald-900 text-center flex items-center justify-center gap-2">
    🗺️ {currentour?.name} {t('location')}
  </h2>
  {currentour?.location?.coordinates?.length === 2 && currentour?.name && (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-200">
      <Map
        coordinates={[
          currentour.location.coordinates[0],
          currentour.location.coordinates[1],
        ]}
        address={currentour.name}
      />
    </div>
  )}
  <p className="text-gray-700 text-center text-lg italic">
    📍{t('exactLocation')} {currentour?.location.address}
  </p>
</section>

      </div>
    );
    
}