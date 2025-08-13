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
  // const tour = {
  //   name: 'Bale Mountain Adventure',
  //   region: 'Bale',
  //   typeOfTour: ['adventure', 'forest'],
  //   description: `Explore the stunning Bale Mountains with breathtaking landscapes, rare wildlife, and unforgettable adventures. Enjoy hiking through dense forests, visiting Harenna forest, spotting Ethiopian wolves, and experiencing the beauty of the Sanetti Plateau. This tour is perfect for nature lovers and adventure seekers.`,
  //   price: 250,
  //   duration: 5,
  //   difficulty: 'medium',
  //   maxGroupSize: 12,
  //   images: Array(12).fill('wanchi.jpg'),
  //   coverImage: '/bale-main.jpg',
  //   location: {
  //     coordinates: [39.7631, 6.7081],
  //     address: 'Bale Mountains National Park, Oromia',
  //     description: 'Home to rare Ethiopian wolves and highland scenery',
  //   },
  //   startDates: ['2024-10-15', '2024-11-01'],
  //   ratingsAverage: 4.8,
  //   ratingsQuantity: 122,
  // };
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
    
        const tx_ref = `tx-${id}-${Date.now()}`;
        console.log("current tour is: ", currentour);
    
        const res = await fetch('/api/initiate-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tourId: id,
            amount: 200,
            userEmail: session.user.email,
            first_name: session.user.name || 'John',
            phone_number: '0912345678',
            tx_ref,
            return_url: `http://tour-app-smoky.vercel.app/payment-success?tx_ref=${tx_ref}`,
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
        <section className="space-y-6 text-center relative">
  <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
    <Image
      src={
        currentour?.coverImage
          ? `/toursphoto/${currentour.coverImage}`
          : '/default-cover.jpg'
      }
      alt={currentour?.name || 'Tour Cover'}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 1200px"
      priority
    />
    <div className="absolute top-4 left-4">
      <Badge className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
        Ethiopia 🌄
      </Badge>
    </div>
  </div>

  <h1 className="text-5xl font-bold text-emerald-900">{currentour?.name}</h1>

  <div className="flex justify-center gap-3 flex-wrap">
    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
      {currentour?.region}
    </Badge>
    {currentour?.typeOfTour.map(type => (
      <Badge
        key={type}
        className="bg-emerald-100 text-emerald-800 capitalize"
      >
        {type}
      </Badge>
    ))}
  </div>

  <p className="text-2xl font-bold text-green-700">
    Starting from   💵 {currentour?.price}
  </p>
  <p className="text-gray-600">
    {currentour?.ratingsAverage} ★ ({currentour?.ratingsQuantity} reviews)
  </p>

  {/* Comments Section */}
  <div className="max-w-3xl mx-auto mt-8">
  <h2 className="text-2xl font-semibold text-emerald-800 mb-4">User Comments 💬</h2>

  <div className="h-60 overflow-y-auto bg-white rounded-xl shadow-inner px-4 py-3 space-y-3 border border-emerald-200">
  {Array.isArray(allComments) && allComments.length > 0 ? (
    <>
      {allComments.map((comment, index) => (
        <div
          key={index}
          className="flex items-start gap-3 text-left bg-emerald-50 hover:bg-emerald-100 transition rounded-md px-4 py-3 shadow-sm"
        >
          <Image
            src={`/userimages/${comment.userImage}` || '/pro.png'}
            alt="User"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border"
            />
          <div className="flex flex-col">
            <p className="text-sm text-gray-800 font-semibold mb-1">{comment.message}</p>
            <p className="text-xs text-gray-500 italic">{comment.name || 'Anonymous'}</p>
          </div>
          <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </>
  ) : (
    <p className="text-sm text-gray-400">No comments yet.</p>
    
  )}
</div>
{showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-200 p-6 sm:p-8 animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setShowCommentModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-center text-2xl font-bold text-green-700 mb-4">
              💬 Leave Your Thoughts
            </h2>

            {/* Textarea */}
            <textarea
              className="w-full resize-none rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
              placeholder="Type your comment here..."
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Buttons */}
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


{/* Place the button *outside* the scrollable container */}
<div className="mt-4">
  <Button onClick={() => {
    if (typeof id === 'string') {
      openCommentModal(id);
    }
    
  }}>
    Leave a Comment
  </Button>
</div>

</div>

</section>


        {/* Description */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-emerald-900">About this Tour</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{currentour?.description}</p>
        </section>
    
        {/* Why Choose This Tour */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-emerald-900">Why Choose This Tour?</h2>
          <ul className="space-y-3 text-gray-700 text-lg list-disc pl-6">
            <li>Guided by local experts who know the region inside out.</li>
            <li>Get up close with unique wildlife like the Ethiopian wolf.</li>
            <li>Perfect balance of adventure and relaxation.</li>
            <li>Includes cultural exposure to nearby communities.</li>
          </ul>
        </section>
    
        {/* Tour Highlights */}
        <section className="grid md:grid-cols-4 gap-4 text-center">
          <Card className="bg-emerald-50 p-4">
            <CardContent>
              <p className="text-xl font-bold text-emerald-900">{currentour?.duration} Days</p>
              <p className="text-gray-600">Tour Duration</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 p-4">
            <CardContent>
              <p className="text-xl font-bold text-emerald-900 capitalize">{currentour?.difficulty}</p>
              <p className="text-gray-600">Difficulty Level</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 p-4">
            <CardContent>
              <p className="text-xl font-bold text-emerald-900">{currentour?.maxGroupSize} People</p>
              <p className="text-gray-600">Group Size</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 p-4">
            <CardContent>
              <p className="text-xl font-bold text-emerald-900">{currentour?.startDates.length} Dates</p>
              <p className="text-gray-600">Available Slots</p>
            </CardContent>
          </Card>
        </section>
    
        {/* Upcoming Dates */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-emerald-900">Upcoming Start Dates</h2>
          <ul className="flex flex-col md:flex-row gap-4 text-lg font-medium text-gray-700">
            {currentour?.startDates.map(date => (
              <li key={date} className="bg-emerald-100 px-6 py-3 rounded-xl text-center shadow">
                {new Date(date).toDateString()}
              </li>
            ))}
          </ul>
        </section>
    
        {/* Image Gallery */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-emerald-900">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentour?.images.map((img, index) => (
              <Image key={index} src={`/toursphoto/${img}`} alt={`Image ${index + 1}`} width={500} height={300} className="rounded-xl w-full h-48 object-cover" />
            ))}
          </div>
        </section>
    
        {/* Included */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-emerald-900">What’s Included</h2>
          <ul className="space-y-2 list-disc text-lg text-gray-700 pl-6">
            <li>Accommodation and park entrance fees.</li>
            <li>Daily breakfast, packed lunches, and water.</li>
            <li>Professional local guides throughout the tour.</li>
            <li>All transportation during the tour.</li>
          </ul>
        </section>
    
        {/* CTA */}
        <section className="text-center bg-emerald-700 p-8 rounded-xl space-y-4 text-white">
          <h2 className="text-4xl font-bold">{`Ready to Explore the ${currentour?.name}?`}</h2>
          <p className="text-lg">{`Book your ${currentour?.typeOfTour[0]} today and experience the raw beauty of Oromia.`}</p>
          <Button
            onClick={handlePayment}
            className="bg-white text-emerald-800 font-bold text-lg px-8 py-4 rounded-xl"
          >
            Book Now
          </Button>
        </section>
    
        {/* Map Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-emerald-900">{currentour?.name} Location</h2>
           {/* map */}
           {currentour?.location?.coordinates?.length === 2 && currentour?.name && (
  <Map
    coordinates={[currentour.location.coordinates[0], currentour.location.coordinates[1]]}
    address={currentour.name}
  />
)}


          <p className="text-gray-700 text-center">Exact location: {currentour?.location.address}</p>
        </section>
      </div>
    );
    
}
