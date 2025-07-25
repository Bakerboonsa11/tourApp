'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const locations = [
  {
    name: "Lalibela",
    region: "Amhara",
    description: "Famous for its rock-hewn churches and cultural heritage.",
    toursCount: 3,
  },
  {
    name: "Simien Mountains",
    region: "Amhara",
    description: "Ideal for trekking and wildlife, including the Gelada baboon.",
    toursCount: 2,
  },
  {
    name: "Omo Valley",
    region: "Southern Nations",
    description: "Home to unique tribes and rich cultural diversity.",
    toursCount: 1,
  },
  {
    name: "Danakil Depression",
    region: "Afar",
    description: "One of the hottest and most fascinating places on Earth.",
    toursCount: 2,
  },
];

export default function GuideLocations() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">My Tour Locations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {locations.map((location, idx) => (
          <Card key={idx} className="shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                <MapPin className="w-5 h-5 text-green-600" />
                {location.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">{location.region}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{location.description}</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                {location.toursCount} {location.toursCount === 1 ? 'tour' : 'tours'}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
