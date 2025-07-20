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
const Map = dynamic(() => import('../../../components/customComponent/Map'), { ssr: false });
// 

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

export default function TourDetailPage() {
  const tour = {
    name: 'Bale Mountain Adventure',
    region: 'Bale',
    typeOfTour: ['adventure', 'forest'],
    description: `Explore the stunning Bale Mountains with breathtaking landscapes, rare wildlife, and unforgettable adventures. Enjoy hiking through dense forests, visiting Harenna forest, spotting Ethiopian wolves, and experiencing the beauty of the Sanetti Plateau. This tour is perfect for nature lovers and adventure seekers.`,
    price: 250,
    duration: 5,
    difficulty: 'medium',
    maxGroupSize: 12,
    images: Array(12).fill('wanchi.jpg'),
    coverImage: '/bale-main.jpg',
    location: {
      coordinates: [39.7631, 6.7081],
      address: 'Bale Mountains National Park, Oromia',
      description: 'Home to rare Ethiopian wolves and highland scenery',
    },
    startDates: ['2024-10-15', '2024-11-01'],
    ratingsAverage: 4.8,
    ratingsQuantity: 122,
  };
  const params = useParams();
  const id = params?.id;
  const [currentour, setCurrentTour] = useState<ITour[]>([]);
    // const [filteredTours, setFilteredTours] = useState<ITour[]>([]);
    // const [searchQuery, setSearchQuery] = useState('');
    // const [selectedType, setSelectedType] = useState('All');
    const [loading, setLoading] = useState(false);
    const [paymentloading, setPaymentLoading] = useState(false);

    const handlePayment = async () => {
      setPaymentLoading(true);
  
      const tx_ref = `tx-${Date.now()}`;
      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 200,
          email: 'example@gmail.com',
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '0912345678',
          tx_ref,
          return_url: 'http://localhost:3000/payment-success',
        }),
      });
  
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
      else alert('Payment failed, please try again.');
  
      setLoading(false);
    };
  
    useEffect(() => {
      const fetchTours = async () => {
        setLoading(true);
        try {
          console.log("Fetching tour with ID:", id);
          const res = await axios.get(`/api/tours/${id}`);
          const fetchedTours: ITour[] = res.data.data || [];
          setCurrentTour(fetchedTours);
          console.log("Fetched Tours:", fetchedTours);
          // setFilteredTours(fetchedTours);
        } catch (err) {
          console.error('Error fetching tours:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTours();
      
    }, []);
  
    // useEffect(() => {
    //   let filtered = [...allTours];
  
    //   if (selectedType !== 'All') {
    //     filtered = filtered.filter(tour =>
    //       tour.typeOfTour.includes(selectedType.toLowerCase())
    //     );
    //   }
  
    //   if (searchQuery.trim()) {
    //     filtered = filtered.filter(tour =>
    //       tour.name.toLowerCase().includes(searchQuery.toLowerCase())
    //     );
    //   }
  
    //   setFilteredTours(filtered);
    // }, [selectedType, searchQuery, allTours]);
  
    // const tourTypes = Array.from(
    //   new Set(allTours.flatMap(tour => tour.typeOfTour.map(type => type.toLowerCase())))
    // );


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">

      {/* Hero Section */}
      <section className="space-y-6 text-center relative">
        <div className="relative">
          <Image
            src={'/wanchi.jpg'}
            alt={tour.name}
            width={1200}
            height={500}
            className="rounded-xl object-cover w-full h-[400px]"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
              Oromia 🌄
            </Badge>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-emerald-900">{tour.name}</h1>
        <div className="flex justify-center gap-3 flex-wrap">
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800">{tour.region}</Badge>
          {tour.typeOfTour.map(type => (
            <Badge key={type} className="bg-emerald-100 text-emerald-800 capitalize">{type}</Badge>
          ))}
        </div>
        <p className="text-2xl font-bold text-green-700">Starting from ${tour.price}</p>
        <p className="text-gray-600">{tour.ratingsAverage} ★ ({tour.ratingsQuantity} reviews)</p>
      </section>

      {/* Description */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-emerald-900">About this Tour</h2>
        <p className="text-gray-700 text-lg leading-relaxed">{tour.description}</p>
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
            <p className="text-xl font-bold text-emerald-900">{tour.duration} Days</p>
            <p className="text-gray-600">Tour Duration</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 p-4">
          <CardContent>
            <p className="text-xl font-bold text-emerald-900 capitalize">{tour.difficulty}</p>
            <p className="text-gray-600">Difficulty Level</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 p-4">
          <CardContent>
            <p className="text-xl font-bold text-emerald-900">{tour.maxGroupSize} People</p>
            <p className="text-gray-600">Group Size</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 p-4">
          <CardContent>
            <p className="text-xl font-bold text-emerald-900">{tour.startDates.length} Dates</p>
            <p className="text-gray-600">Available Slots</p>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Dates */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-emerald-900">Upcoming Start Dates</h2>
        <ul className="flex flex-col md:flex-row gap-4 text-lg font-medium text-gray-700">
          {tour.startDates.map(date => (
            <li key={date} className="bg-emerald-100 px-6 py-3 rounded-xl text-center shadow">{new Date(date).toDateString()}</li>
          ))}
        </ul>
      </section>

      {/* Image Gallery */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-emerald-900">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tour.images.map((img, index) => (
            <Image key={index} src={`/${img}`} alt="Gallery image" width={500} height={300} className="rounded-xl w-full h-48 object-cover" />
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
        <h2 className="text-4xl font-bold">Ready to Explore the Bale Mountains?</h2>
        <p className="text-lg">Book your adventure today and experience the raw beauty of Oromia.</p>
        <Button
        onClick={handlePayment}
        className="bg-white text-emerald-800 font-bold text-lg px-8 py-4 rounded-xl"
      >
        Book Now
      </Button>

        
      </section>

      {/* Map Section */}
      <section className="space-y-4">
  <h2 className="text-3xl font-bold text-emerald-900">Tour Location</h2>
  <Map coordinates={tour.location.coordinates} address={tour.location.address} />
  <p className="text-gray-700 text-center">Exact location: {tour.location.address}</p>
</section>

    </div>
  );
}
