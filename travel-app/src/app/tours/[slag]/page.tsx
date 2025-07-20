'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ITour {
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
      filtered = filtered.filter(tour =>
        tour.typeOfTour.includes(selectedType.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTours(filtered);
  }, [selectedType, searchQuery, allTours]);

  const tourTypes = Array.from(
    new Set(allTours.flatMap(tour => tour.typeOfTour.map(type => type.toLowerCase())))
  );

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
      <section className="grid md:grid-cols-3 gap-6 text-center">
        {[
          { title: 'Local Experts', desc: 'Guided by locals who know every hidden gem.' },
          { title: 'Affordable Packages', desc: 'Experience amazing tours without breaking your budget.' },
          { title: 'Safe & Comfortable', desc: 'Well-planned tours with safety and comfort as a priority.' },
        ].map(({ title, desc }) => (
          <div key={title} className="bg-muted p-6 rounded-xl space-y-3 shadow">
            <h3 className="font-semibold text-xl">{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>

      {/* Filter Controls */}
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
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
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
            </CardContent>
            <CardFooter className="p-4">
              <Button asChild className="w-full">
                <Link href={`/detail/${tour._id}`}>View Tour</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      {/* Testimonials */}
      <section className="bg-green-50 p-6 rounded-xl space-y-6">
        <h2 className="text-3xl font-bold text-center">What Travelers Say 💬</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p>"Absolutely the best tour I’ve had. The guides were friendly, and I got to experience real Oromia."</p>
            <p className="text-right font-semibold mt-2">— Lensa D.</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p>"Everything was organized perfectly. Highly recommend for solo travelers."</p>
            <p className="text-right font-semibold mt-2">— Samuel A.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions ❓</h2>
        <div className="space-y-3">
          <div className="bg-muted p-4 rounded-xl">
            <h3 className="font-semibold">How do I book a tour?</h3>
            <p>Click on View Tour and proceed to booking, or contact us via the booking page.</p>
          </div>
          <div className="bg-muted p-4 rounded-xl">
            <h3 className="font-semibold">Are tours customizable?</h3>
            <p>Yes! We can tailor tours to your preferences — cultural, adventure, or relaxation.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black rounded-xl p-8 text-center text-white space-y-4 shadow-lg">
        <h2 className="text-3xl font-bold">Don’t Miss Out!</h2>
        <p>Join hundreds of travelers exploring Oromia’s hidden beauty.</p>
        <Button asChild className="bg-white text-black font-bold">
          <Link href="/bookings">Book Your Tour Today</Link>
        </Button>
      </section>

      {loading && <p className="text-center text-lg">Loading tours...</p>}
    </div>
  );
}
