'use client'

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Params } from "next/dist/server/request/params";
import { ITour } from "./../../../model/tours";
const tours = [
  {
    name: "Bale Mountain Adventure",
    slug: "bale-mountain-adventure",
    description: "Trek Bale’s beautiful highlands and explore unique wildlife.",
    price: "$250",
    image: "/bale-cover.jpg",
  },
  {
    name: "Langano Lake Relaxation",
    slug: "langano-lake-relaxation",
    description: "Unwind by the peaceful Langano lake with local guides.",
    price: "$180",
    image: "/langano-cover.jpg",
  },
  {
    name: "Harar Cultural Exploration",
    slug: "harar-cultural-exploration",
    description: "Discover centuries-old history and vibrant culture in Harar.",
    price: "$200",
    image: "/harar-cover.jpg",
  },
];

export default function ToursPage() {
    const [slug, setSlug] = useState<string | null>(null);

    const router = useRouter();
  
    const params = useParams<Params>();
    
  useEffect(() => {
    if (params?.slug) {
        setSlug(Array.isArray(params.slug) ? params.slug[0] : params.slug);
    }
  }, [params]);

  const [tour, setTours] = useState<ITour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchKit = async () => {
        try {
          const res = await axios.get(`/api/kits/${slug}`);
          setTours(res.data.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
              setError(err.response.data?.message || 'Something went wrong');
            } else {
              setError('Something went wrong');
            }
          } finally {
          setLoading(false);
        }
      };

      fetchKit();
    }
  }, [slug]);
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Discover Oromias Hidden Wonders 🌍</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          From mountain peaks to peaceful lakes, join curated adventures that highlight Oromias culture and beauty.
        </p>
        <Button asChild>
          <Link href="/bookings">Book Your Tour</Link>
        </Button>
      </section>

      {/* Informational Section */}
      <section className="grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-muted p-6 rounded-xl space-y-2">
          <h3 className="font-semibold text-xl">Local Experiences</h3>
          <p className="text-sm text-muted-foreground">Tours designed by locals for authentic experiences.</p>
        </div>
        <div className="bg-muted p-6 rounded-xl space-y-2">
          <h3 className="font-semibold text-xl">Affordable & Safe</h3>
          <p className="text-sm text-muted-foreground">Budget-friendly tours with professional guidance.</p>
        </div>
        <div className="bg-muted p-6 rounded-xl space-y-2">
          <h3 className="font-semibold text-xl">Adventure Awaits</h3>
          <p className="text-sm text-muted-foreground">Choose from adventure, cultural, or relaxation packages.</p>
        </div>
      </section>

      {/* Tour Cards */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Top Tours</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.slug} className="hover:shadow-xl transition">
              <CardHeader className="p-0">
                <Image
                  src={'/redfox.jpg'} // Placeholder image, replace with tour.image
                  alt={tour.name}
                  width={500}
                  height={300}
                  className="rounded-t-xl object-cover h-56 w-full"
                />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <CardTitle>{tour.name}</CardTitle>
                <CardDescription>{tour.description}</CardDescription>
                <Badge variant="outline" className="w-fit">{tour.price}</Badge>
              </CardContent>
              <CardFooter className="p-4">
                <Button asChild className="w-full">
                  <Link href={`/tours/${tour.slug}`}>View Tour</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-muted rounded-xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Start Your Journey?</h2>
        <p className="text-muted-foreground">Book unforgettable experiences tailored to your interests.</p>
        <Button asChild className="bg-black text-white">
          <Link href="/bookings">Book Now</Link>
        </Button>
      </section>
      
    </div>
  );
}
