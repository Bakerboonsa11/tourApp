'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';
import { useTranslations } from "next-intl";

interface Comment {
  message: string;
  userId: string;
  userImage: string;
  name: string;
  createdAt: string;
}

interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: string;
  description: string;
}

interface Tour {
  _id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  coverImage: string;
  location: Location;
  startDates: string[];
  endDate: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  guides: string[];
  status: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'guide';
  password?: string;
  createdAt: string;
}

export default function GuideLocations() {
  const [toursOfGuide, setToursOfGuide] = useState<Tour[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();
   const t = useTranslations('guideDashboard');

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${encodeURIComponent(email)}`);
        const userData: User = response.data.data;
        setUser(userData);

        const tourResponse = await axios.get(`/api/tours`);
        const filteredTours = tourResponse.data.instanceFiltered.filter(
          (tour: Tour) => tour.guides.includes(userData._id)
        );
        setToursOfGuide(filteredTours);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session]);

  // Group tours by location description
  const groupedLocations = toursOfGuide.reduce((acc: Record<string, { region: string; description: string; count: number }>, tour) => {
    const desc = tour.location.description || 'no description for this tour Location';
    if (!acc[desc]) {
      acc[desc] = {
        region: tour.region,
        description: desc,
        count: 1,
      };
    } else {
      acc[desc].count += 1;
    }
    return acc;
  }, {});

  const locationEntries = Object.entries(groupedLocations);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">{t("loc.myTourLocations")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {locationEntries.map(([description, data], idx) => (
          <Card key={idx} className="shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                <MapPin className="w-5 h-5 text-green-600" />
                {description}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {data.region}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{data.description}</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                {data.count} {data.count === 1 ? t("loc.tour") : t("loc.tours")}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
}
