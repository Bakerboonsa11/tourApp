'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
const Map = dynamic(() => import('../../../components/customComponent/Map'), { ssr: false });
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
        <section className="relative">
  {/* === HERO COVER === */}
  <div className="relative w-full h-[70vh] md:h-[80vh]">
    <Image
      src={
        currentour?.coverImage
          ? `/toursphoto/${currentour.coverImage}`
          : '/default-cover.jpg'
      }
      alt={currentour?.name || 'Tour Cover'}
      fill
      className="object-cover"
      priority
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

    {/* Hero Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
      <Badge className="bg-red-600 text-white px-5 py-2 rounded-full shadow-lg mb-6 animate-bounce">
        Ethiopia 🌄
      </Badge>
      <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
        {currentour?.name}
      </h1>
      <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto">
        Discover the adventure of a lifetime in the heart of Ethiopia.
      </p>
      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        <Badge variant="outline" className="bg-emerald-100/90 text-emerald-800">
          {currentour?.region}
        </Badge>
        {currentour?.typeOfTour.map(type => (
          <Badge
            key={type}
            className="bg-emerald-100/90 text-emerald-800 capitalize"
          >
            {type}
          </Badge>
        ))}
      </div>
    </div>
  </div>

  {/* === TOUR DETAILS === */}
  <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
    <div className="text-center">
      <p className="text-3xl font-bold text-green-700">
        ETB Starting from {currentour?.price}
      </p>
      <p className="text-gray-600 mt-2">
        {currentour?.ratingsAverage} ★ ({currentour?.ratingsQuantity} reviews)
      </p>
    </div>

    {/* Highlights */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-xl transition">
        <h4 className="text-lg font-bold text-emerald-700">⏳ Duration</h4>
        <p className="text-gray-600">{currentour?.duration || '5 days'}</p>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-xl transition">
        <h4 className="text-lg font-bold text-emerald-700">👥 Group Size</h4>
        <p className="text-gray-600">{currentour?.maxGroupSize || '10 people'}</p>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-xl transition">
        <h4 className="text-lg font-bold text-emerald-700">⚡ Difficulty</h4>
        <p className="text-gray-600">{currentour?.difficulty || 'Moderate'}</p>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-xl transition">
        <h4 className="text-lg font-bold text-emerald-700">📍 Location</h4>
        <p className="text-gray-600">{currentour?.region}</p>
      </div>
    </div>

    {/* === COMMENTS / REVIEWS === */}
    <div className="max-w-3xl mx-auto mt-12">
      <h2 className="text-3xl font-bold text-emerald-800 text-center mb-6">
        User Comments 💬
      </h2>
      <div className="h-64 overflow-y-auto bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-inner px-4 py-3 space-y-4 border border-emerald-200">
        {Array.isArray(allComments) && allComments.length > 0 ? (
          allComments.map((comment, index) => (
            <div
              key={index}
              className="flex items-start gap-3 text-left bg-white/90 hover:bg-white transition rounded-xl px-4 py-3 shadow-sm border border-emerald-100"
            >
              <Image
                src={comment.userImage ? `/userimages/${comment.userImage}` : '/pro.png'}
                alt="User"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex flex-col flex-1">
                <p className="text-sm text-gray-800 font-medium mb-1">{comment.message}</p>
                <p className="text-xs text-gray-500 italic">{comment.name || 'Anonymous'}</p>
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center">No comments yet.</p>
        )}
      </div>

      {/* Comment Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={() => {
            if (typeof id === 'string') {
              openCommentModal(id);
            }
          }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:scale-105 transition"
        >
          Leave a Comment ✨
        </Button>
      </div>
    </div>
  </div>

  {/* === COMMENT MODAL === */}
  {showCommentModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-200 p-6 sm:p-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => setShowCommentModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          ✕
        </button>

        <h2 className="text-center text-2xl font-bold text-green-700 mb-4">
          💬 Leave Your Thoughts
        </h2>

        <textarea
          className="w-full resize-none rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
          placeholder="Type your comment here..."
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            onClick={() => setShowCommentModal(false)}
            className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full py-2.5 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitComment}
            className="w-full sm:w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-full py-2.5 transition-all shadow-md hover:scale-105"
          >
            Post ✨
          </button>
        </div>
      </div>
    </div>
  )}
</section>



    {/* Description */}
<section className="space-y-6 bg-gradient-to-br from-emerald-50 to-green-100 p-8 rounded-3xl shadow-md">
  <h2 className="text-4xl font-extrabold text-emerald-900 flex items-center gap-2">
    🌍 About this Tour
  </h2>
  <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
    {currentour?.description}
  </p>
</section>

{/* Why Choose This Tour */}
<section className="space-y-6 p-8 rounded-3xl shadow-md bg-white border border-emerald-100">
  <h2 className="text-4xl font-extrabold text-emerald-900 flex items-center gap-2">
    ✨ Why Choose This Tour?
  </h2>
  <ul className="grid md:grid-cols-2 gap-4 text-gray-700 text-lg">
    <li className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl shadow-sm">
      <span className="text-emerald-600 text-2xl">✅</span>
      Guided by local experts who know the region inside out.
    </li>
    <li className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl shadow-sm">
      <span className="text-emerald-600 text-2xl">🦊</span>
      Get up close with unique wildlife like the Ethiopian wolf.
    </li>
    <li className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl shadow-sm">
      <span className="text-emerald-600 text-2xl">🌄</span>
      Perfect balance of adventure and relaxation.
    </li>
    <li className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl shadow-sm">
      <span className="text-emerald-600 text-2xl">🏛️</span>
      Includes cultural exposure to nearby communities.
    </li>
  </ul>
</section>

{/* Tour Highlights */}
<section className="space-y-6">
  <h2 className="text-4xl font-extrabold text-emerald-900 text-center">🌟 Tour Highlights</h2>
  <div className="grid md:grid-cols-4 gap-6">
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg hover:scale-105 transition rounded-2xl">
      <CardContent className="p-6 text-center">
        <p className="text-2xl font-bold text-emerald-900">{currentour?.duration} Days</p>
        <p className="text-gray-600">Tour Duration</p>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg hover:scale-105 transition rounded-2xl">
      <CardContent className="p-6 text-center">
        <p className="text-2xl font-bold text-emerald-900 capitalize">{currentour?.difficulty}</p>
        <p className="text-gray-600">Difficulty Level</p>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg hover:scale-105 transition rounded-2xl">
      <CardContent className="p-6 text-center">
        <p className="text-2xl font-bold text-emerald-900">{currentour?.maxGroupSize} People</p>
        <p className="text-gray-600">Group Size</p>
      </CardContent>
    </Card>
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg hover:scale-105 transition rounded-2xl">
      <CardContent className="p-6 text-center">
        <p className="text-2xl font-bold text-emerald-900">{currentour?.startDates.length} Dates</p>
        <p className="text-gray-600">Available Slots</p>
      </CardContent>
    </Card>
  </div>
</section>

{/* Upcoming Dates */}
<section className="space-y-6">
  <h2 className="text-4xl font-extrabold text-emerald-900 flex items-center gap-2">
    📅 Upcoming Start Dates
  </h2>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {currentour?.startDates.map(date => (
      <div
        key={date}
        className="bg-white border border-emerald-200 px-6 py-4 rounded-2xl text-center shadow hover:bg-emerald-50 transition"
      >
        <p className="text-lg font-semibold text-emerald-800">{new Date(date).toDateString()}</p>
      </div>
    ))}
  </div>
</section>

    
        {/* Image Gallery */}
      {/* Gallery */}
<section className="space-y-6">
  <h2 className="text-4xl font-extrabold text-emerald-900 text-center flex items-center justify-center gap-2">
    🖼️ Tour Gallery
  </h2>
  <div className="columns-2 md:columns-3 gap-4 space-y-4">
    {currentour?.images.map((img, index) => (
      <Image
        key={index}
        src={`/toursphoto/${img}`}
        alt={`Image ${index + 1}`}
        width={600}
        height={400}
        className="rounded-2xl w-full object-cover shadow-md hover:scale-105 transition duration-300"
      />
    ))}
  </div>
</section>

{/* What’s Included */}
<section className="space-y-6 mt-10">
  <h2 className="text-4xl font-extrabold text-emerald-900 text-center flex items-center justify-center gap-2">
    ✅ What’s Included
  </h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { icon: "🏨", text: "Accommodation & park entrance fees" },
      { icon: "🥗", text: "Daily breakfast, packed lunches, and water" },
      { icon: "🧭", text: "Professional local guides throughout the tour" },
      { icon: "🚌", text: "All transportation during the tour" },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl shadow-lg hover:shadow-xl transition"
      >
        <span className="text-4xl mb-3">{item.icon}</span>
        <p className="text-lg text-gray-800 font-medium">{item.text}</p>
      </div>
    ))}
  </div>
</section>

{/* Call To Action */}
<section className="relative mt-16">
  <div className="absolute inset-0 bg-[url('/cta-bg.jpg')] bg-cover bg-center rounded-3xl opacity-20"></div>
  <div className="relative text-center bg-emerald-800/90 p-12 rounded-3xl shadow-2xl space-y-6 text-white">
   <h2 className="text-5xl font-extrabold drop-shadow-lg mb-6">
  Ready to Explore <span className="text-yellow-300">{currentour?.name}</span>?
</h2>

<p className="text-lg max-w-2xl mx-auto">
  {`Book your ${currentour?.typeOfTour[0]} today and experience the raw beauty of Oromia like never before.`}
</p>

    <Button
      onClick={handlePayment}
      className="bg-yellow-400 hover:bg-yellow-500 text-emerald-900 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:scale-105 transition"
    >
      ✈️ Book Now
    </Button>
  </div>
</section>

{/* Map Section */}
<section className="space-y-6 mt-16">
  <h2 className="text-4xl font-extrabold text-emerald-900 text-center flex items-center justify-center gap-2">
    🗺️ {currentour?.name} Location
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
    📍 Exact location: {currentour?.location.address}
  </p>
</section>

      </div>
    );
    
}
