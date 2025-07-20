'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ITour {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  region: string;
  typeOfTour: string[];
  images: { coverImage: string }[];
}

export default function ToursPage() {
  const [allTours, setAllTours] = useState<ITour[]>([]);
  const [filteredTours, setFilteredTours] = useState<ITour[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentCommentTour, setCurrentCommentTour] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/tours');
        const fetchedTours: ITour[] = res.data.instanceFiltered || [];
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

  const handleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const openCommentModal = (id: string) => {
    setCurrentCommentTour(id);
    setComment('');
    setShowCommentModal(true);
  };

  const handleSubmitComment = () => {
    console.log(`Comment for Tour ID ${currentCommentTour}: ${comment}`);
    setShowCommentModal(false);
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
        {filteredTours.map((tour) => (
          <Card key={tour.slug} className="hover:shadow-xl transition">
            <CardHeader className="p-0">
              <Image
                src={tour.images[0]?.coverImage || '/wanchi.jpg'}
                alt={tour.name}
                width={500}
                height={300}
                className="rounded-t-xl object-cover h-56 w-full"
              />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <CardTitle>{tour.name}</CardTitle>
              <CardDescription>{tour.description.slice(0, 80)}...</CardDescription>
              <Badge variant="outline">${tour.price}</Badge>
              <div className="flex justify-between items-center pt-2 gap-2">
                <Button variant="secondary" onClick={() => handleLike(tour._id)}>
                  ❤️ {likes[tour._id] || 0} Likes
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
        ))}
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
      <section className="p-10 bg-slate-100 rounded-xl space-y-4 shadow">
        <h2 className="text-3xl font-bold">Frequently Asked Questions ❓</h2>
        <ul className="list-disc space-y-2 px-5">
          <li>How to book tours?</li>
          <li>Can I get a refund?</li>
          <li>How early should I book?</li>
          <li>Do you offer private tours?</li>
        </ul>
      </section>

      <section className="p-10 bg-blue-100 rounded-xl space-y-4 shadow">
        <h2 className="text-3xl font-bold">Customer Testimonials 💬</h2>
        <p>“Amazing experience with Oromia Tours. Highly recommend!”</p>
        <p>“Everything was smooth and well organized.”</p>
      </section>

      <section className="p-10 bg-purple-100 rounded-xl space-y-4 shadow">
        <h2 className="text-3xl font-bold">About Oromia Tours</h2>
        <p>Oromia Tours was founded by passionate locals to showcase the beauty of Oromia to the world.</p>
      </section>

      <section className="p-10 bg-gray-200 rounded-xl space-y-4 shadow text-center">
        <h2 className="text-3xl font-bold">Contact Us 📞</h2>
        <p>For any queries, call us at +251-912-345-678 or email at info@oromiatours.com</p>
      </section>

    </div>
  );
}
