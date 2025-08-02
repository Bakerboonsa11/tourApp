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
import { HelpCircle, Quote, Info, PhoneCall } from 'lucide-react';




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
        <p className="text-gray-800 text-lg italic">“Amazing experience with Oromia Tours. Highly recommend!”</p>
        <p className="text-gray-800 text-lg italic">“Everything was smooth and well organized.”</p>
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







export interface ITour {
  _id: string;
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
const testimonials = [
  { id: 1, name: 'Amina', avatar: '/avatars/amina.jpg', text: 'Amazing experience with Oromia Tours. Highly recommend!' },
  { id: 2, name: 'Dawit', avatar: '/avatars/dawit.jpg', text: 'Everything was smooth and well organized.' },
];
type Comment = {
  message: string;
  userId: string; // or userId
  userImage: Date;
};


// FAQ questions and answers
const faqs = [
  { question: 'How to book tours?', answer: 'You can book tours easily by selecting your preferred tour and clicking the Book Now button.' },
  { question: 'Can I get a refund?', answer: 'Refund policies vary by tour. Please check the tour details or contact support for info.' },
  { question: 'How early should I book?', answer: 'It is recommended to book at least 2 weeks in advance to secure your spot.' },
  { question: 'Do you offer private tours?', answer: 'Yes, we offer private tours. Contact us to customize your experience.' },
];



export default function ToursPage() {
  const pathname = usePathname();
  console.log("PATHNAME:", pathname);


  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 220, friction: 20 },
    delay: 100,
  });

  // State for which FAQ is open (-1 means all closed)
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };
  
  const parts = pathname.split('/');
  const initialType = parts.length > 2 ? parts[2] : 'All';
  console.log("Initial Type from URL:", initialType);
// const initialType = searchParams.get('slag') || 'All';
console.log("Initial Type from URL:", initialType);
const [selectedType, setSelectedType] = useState(initialType);
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [filteredTours, setFilteredTours] = useState<ITour[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<Record<string, { userId: string }[]>>({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentCommentTour, setCurrentCommentTour] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours = res.data.instanceFiltered.map((tour:ITour) => ({
          ...tour,
          likes: tour.likes.map((like: string) => like.toString()), // convert ObjectIds to strings
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
    let filtered = [...allTours];
    if (selectedType !== 'All') {
      filtered = filtered.filter(tour => tour.typeOfTour.includes(selectedType.toLowerCase()));
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(tour => tour.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredTours(filtered);
  }, [selectedType, searchQuery, allTours]);

  const tourTypes = Array.from(
    new Set(allTours.flatMap(tour => tour.typeOfTour.map(type => type.toLowerCase())))
  );


  
  const handleLike = async (tourId: string, currentLikes: string[]) => {
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) return console.error('User not logged in');
  
      const userRes = await axios.get(`/api/user/${userEmail}`);
      const userId = userRes.data.data._id;
  
      const alreadyLiked = currentLikes.includes(userId);
  
      const updatedLikes = alreadyLiked
        ? currentLikes.filter(id => id !== userId)
        : [...currentLikes, userId];
  
      await axios.patch(`/api/tours/${tourId}`, { likes: updatedLikes });
  
      setLikes(prev => ({ ...prev, [tourId]: updatedLikes }));
    } catch (error) {
      console.error('Failed to like tour:', error);
    }
  };
  
  
  
  

  const openCommentModal = (id: string) => {
    setCurrentCommentTour(id);
    setComment('');
    setShowCommentModal(true);
  };

  const handleSubmitComment = async () => {
    console.log(`Comment for Tour ID ${currentCommentTour}: ${comment}`);
    //  find tour by the id 
    try {
      console.log("Fetching tour with ID: llllllllllllllllllllllllllllllllllllll", currentCommentTour);
      const res = await axios.get(`/api/tours/${currentCommentTour}`);
      const user=await axios.get(`/api/user/${session?.user?.email}`);
      const fetchedTour: ITour = res.data.data;
      const newComment = {
        message: comment,
        userId: session?.user.id, // get this from session or context
        userImage: session?.user.image || '', // get this from session or context
        name: session?.user.name || `${user.data.first_name}`, // get this from session or context
      };
      const updatedComments = [...fetchedTour.comments, newComment];
       const dataAfterResponse=await axios.patch(`/api/tours/${currentCommentTour}`, { comments: updatedComments });
      console.log("Fetched Tour:mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",newComment);
      // setCurrentTour(fetchedTour);
      
      console.log("Fetched Tours:", fetchedTour);
      // setFilteredTours(fetchedTours);
    } catch (err) {
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
    // update the comments array of the tour
    setShowCommentModal(false);
  };

  const getTourStatus = (startDates: string[], endDate?: string) => {
    if (!endDate || !startDates || startDates.length === 0) 
      return { label: 'No Date', color: 'bg-gray-500' };
    
    const today = new Date();
    const end = new Date(endDate);
    const starts = startDates.map(dateStr => new Date(dateStr)).sort((a, b) => a.getTime() - b.getTime());
  
    // If tour is finished
    if (today > end) {
      return { label: 'Finished', color: 'bg-red-500' };
    }
  
    // If today is before the earliest start date
    if (today < starts[0]) {
      const diffDays = Math.ceil((starts[0].getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { label: `Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'bg-green-500' };
    }
  
    // If today is between any start date and end date => Ongoing
    for (const start of starts) {
      if (today >= start && today <= end) {
        const diffDaysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDaysLeft === 0) {
          return { label: 'Last Day', color: 'bg-yellow-500' };
        }
        return { label: `${diffDaysLeft} day${diffDaysLeft > 1 ? 's' : ''} left`, color:'bg-red-100' };
      }
    }
  
    // If today is after all start dates but before end date (unlikely, but fallback)
    const diffDaysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { label: `${diffDaysLeft} day${diffDaysLeft > 1 ? 's' : ''} left`, color: 'bg-green-500' };
  };
  
  

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">

      {/* Hero Section */}
      <section className="text-center space-y-4 bg-green-200 p-10 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-black">Explore Oromia 🌍</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto">
          Discover breathtaking destinations, unique cultural spots, and relaxing escapes — all curated by locals.
        </p>
        <Button asChild className="bg-black text-white font-bold px-6 py-3 rounded-md">
          <Link href="/bookings">Start Your Journey</Link>
        </Button>
      </section>

      {/* Why Choose Us */}
      <section className="grid md:grid-cols-4 gap-6 text-center">
        {[ 
          { title: 'Local Experts', desc: 'Guided by locals who know every hidden gem.' },
          { title: 'Affordable Packages', desc: 'Experience amazing tours without breaking your budget.' },
          { title: 'Safe & Comfortable', desc: 'Well-planned tours with safety and comfort as a priority.' },
          { title: 'Flexible Bookings', desc: 'Easily change or cancel your bookings hassle-free.' },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-muted p-6 rounded-xl space-y-3 shadow">
            <h3 className="font-semibold text-xl">{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>

      {/* Seasonal Deals */}
      <section className="text-center p-8 bg-yellow-100 rounded-xl shadow space-y-3">
        <h2 className="text-3xl font-bold">Seasonal Special Deals 🌞</h2>
        <p className="text-lg">Check out our hand-picked seasonal tour packages and save up to 30% on selected tours.</p>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search tours by name..."
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded w-full md:w-1/4"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Types</option>
          {tourTypes.map((type) => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </section>

      {/* Tour Cards */}
      <section className="grid md:grid-cols-3 gap-6">
      {filteredTours.map((tour) => {
        // alert(tour.endDate);
        console.log("tour is ", tour);
        console.log( "end date is ",tour.endDate);
        const { label, color } = getTourStatus(tour.startDates, tour.endDate);

  
  return (
    <Card key={tour.slug} className="hover:shadow-xl transition">
      <CardHeader className="p-0">
        <Image
          src={`/toursphoto/${tour?.coverImage}` || '/wanchi.jpg'}
          alt={tour.name}
          width={500}
          height={300}
          className="rounded-t-xl object-cover h-56 w-full"
        />
      </CardHeader>
      
      <CardContent className="p-4 space-y-2">
        <CardTitle>{tour.name}</CardTitle>
        <CardDescription>{tour.description.slice(0, 80)}...</CardDescription>

        {/* ✅ Now color and label are accessible */}
        <Badge className={`${color} text-white font-bold w-fit`}>
          {label}
        </Badge>

        <Badge variant="outline">${tour.price}</Badge>
        <div className="flex justify-between items-center pt-2 gap-2">
        <Button variant="secondary" onClick={() => handleLike(tour._id, tour.likes)}>
  ❤️❤️ {likes[tour._id]?.length ?? tour.likes.length} Likes

</Button>

          <Button variant="outline" onClick={() => openCommentModal(tour._id)}>
            Leave a Comment
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild className="w-full">
          <Link href={`/detail/${tour._id}`}>View Tour</Link>
        </Button>
      </CardFooter>
    </Card>
  );
})}

      </section>

      {loading && <p className="text-center text-lg">Loading tours...</p>}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-center">Leave a Comment</h2>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Your comment..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setShowCommentModal(false)}>Cancel</Button>
              <Button onClick={handleSubmitComment}>Post</Button>
            </div>
          </div>
        </div>
      )}

      {/* Static Sections */}
       <div className="max-w-7xl mx-auto p-6 space-y-16">
      {/* Your existing tour hero, filters, tour cards, modals... */}

      {/* Static Sections with animation */}
      <div className="max-w-6xl mx-auto p-6 space-y-10">

{/* FAQ Section */}
<animated.section
  style={fadeIn}
  className="bg-green-50 rounded-xl p-10 shadow-md hover:shadow-xl transition transform hover:scale-[1.02] duration-300"
>
  <div className="flex items-center gap-3 mb-6">
    <HelpCircle className="text-green-700 w-6 h-6" />
    <h2 className="text-3xl font-extrabold text-green-900">Frequently Asked Questions ❓</h2>
  </div>

  <ul className="divide-y divide-green-200">
    {faqs.map(({ question, answer }, i) => (
      <li
        key={i}
        className="py-3 cursor-pointer select-none"
        onClick={() => openFaqIndex === i ? setOpenFaqIndex(-1) : setOpenFaqIndex(i)}
        aria-expanded={openFaqIndex === i}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') {
          openFaqIndex === i ? setOpenFaqIndex(-1) : setOpenFaqIndex(i);
        }}}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-900">{question}</h3>
          <span
            className="text-2xl transition-transform duration-300 text-green-700"
            style={{ transform: openFaqIndex === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
          >
            +
          </span>
        </div>
        {openFaqIndex === i && (
          <p className="mt-2 text-green-800">{answer}</p>
        )}
      </li>
    ))}
  </ul>
</animated.section>

{/* Testimonials Section */}
<animated.section
  style={fadeIn}
  className="bg-amber-50 rounded-xl p-10 shadow-md hover:shadow-xl transition transform hover:scale-[1.02] duration-300"
>
  <div className="flex items-center gap-3 mb-6">
    <Quote className="text-amber-700 w-6 h-6" />
    <h2 className="text-3xl font-extrabold text-amber-900">Customer Testimonials 💬</h2>
  </div>

  <div className="flex flex-col divide-y divide-amber-300">
    {testimonials.map(({ id, name, avatar, text }) => (
      <div key={id} className="py-4 flex items-start gap-4">
        <img
          src={'/pro.avif'}
          alt={`${name} avatar`}
          className="w-12 h-12 rounded-full object-cover border-2 border-amber-600 flex-shrink-0"
        />
        <div>
          <h4 className="font-semibold text-amber-900">{name}</h4>
          <p className="text-amber-700 italic mt-1">{text}</p>
        </div>
      </div>
    ))}
  </div>
</animated.section>

{/* About Section */}
<animated.section
  style={fadeIn}
  className="bg-green-100 rounded-xl p-10 shadow-md hover:shadow-xl transition transform hover:scale-[1.02] duration-300"
>
  <div className="flex items-center gap-3 mb-6">
    <Info className="text-green-800 w-6 h-6" />
    <h2 className="text-3xl font-extrabold text-green-900">About Oromia Tours</h2>
  </div>
  <p className="text-green-800 text-lg leading-relaxed">
    Oromia Tours was founded by passionate locals to showcase the beauty of Oromia to the world.
    Our mission is to provide authentic and unforgettable travel experiences while supporting local communities.
  </p>
</animated.section>

{/* Contact Section */}
<animated.section
  style={fadeIn}
  className="bg-amber-100 rounded-xl p-10 shadow-md hover:shadow-xl transition transform hover:scale-[1.02] duration-300 text-center"
>
  <div className="flex items-center justify-center gap-3 mb-6">
    <PhoneCall className="text-amber-700 w-6 h-6" />
    <h2 className="text-3xl font-extrabold text-amber-900">Contact Us 📞</h2>
  </div>
  <p className="text-amber-800 text-lg max-w-xl mx-auto">
    For any queries, call us at <strong>+251-912-345-678</strong> or email at{' '}
    <a href="mailto:info@oromiatours.com" className="text-amber-700 underline hover:text-amber-900 transition">
      info@oromiatours.com
    </a>
  </p>
</animated.section>

</div>

    </div>

    </div>
  );
}
