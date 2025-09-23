'use client';

import { useState,useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Form from './formt';
import axios from 'axios';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
export interface Tour {
  _id: string;
  status:string
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[]; // e.g., ['adventure', 'forest', 'mountain']
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[]; // image paths or URLs
  coverImage: string;
  location: {
    type?: string;
    coordinates?: number[];
    description?: string;
    address?: string;
  };
  startDates: string[]; // ISO date strings
  endDate: string; // ISO date string
  likes: string[]; // user IDs who liked
  comments: {
    user: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string; // ISO date string
  guides: string[]; // guide user IDs
  __v: number;
}




const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
};

export default function ToursManagement() {
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [iseditting, setIsEditing] = useState(false);
    const [tours, setTours] = useState<Tour[]>([]);
  const t = useTranslations('admin');
  const [loading, setLoading] = useState(true);

  const handleSearch = (query: string) => {
    setSearch(query);
    const filtered = tours.filter((tour) =>
      tour.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTours(filtered);
  };

  useEffect(() => {
      const fetchAllData = async () => {
        try {
          const usersRes = await axios.get('/api/tours');
          const filteredTours = usersRes.data.instanceFiltered
            setTours(usersRes.data.instanceFiltered);
          setFilteredTours(filteredTours);
        } catch (err) {
          console.error('Error fetching guides:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllData();
    }, []);

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <section className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen flex flex-col">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-6">{t('toursManagement.title')}</h2>

        {/* Search Bar */}
        <div className="mb-6 max-w-sm">
          <Input
            type="text"
            placeholder="Search tours by name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Cards Grid or Edit Form */}
        <div className="flex-1 overflow-y-auto">
  {iseditting ? (
    <div className="max-w-4xl mx-auto">
      <Form />
    </div>
  ) : (
    <>
      {/* Moved Tour Statistics Above */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white shadow-md border border-indigo-200 col-span-full">
          <CardHeader>
            <CardTitle className="text-indigo-700">{t('toursManagement.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <span className="font-semibold">{t('toursManagement.statistics.total')}</span> {tours.length}
              </li>
              <li>
                <span className="font-semibold">{t('toursManagement.statistics.pending')}</span>{' '}
                {tours.filter((t) => t.status === 'pending').length}
              </li>
              <li>
                <span className="font-semibold">{t('toursManagement.statistics.inactive')}</span>{' '}
                {tours.filter((t) => t.status === 'finished').length}
              </li>
              <li>
                <span className="font-semibold">{t('toursManagement.statistics.active')}</span>       {tours.filter((t) => t.status === 'active').length}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Tours List */}
        <Card className="bg-white shadow-md border border-cyan-200">
          <CardHeader>
            <CardTitle className="text-cyan-700">{t('toursManagement.allTours.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 max-h-164 overflow-y-auto">
              {filteredTours.length === 0 && (
                <p className="text-gray-500 text-center">{t('toursManagement.allTours.noTours')}</p>
              )}
              {filteredTours.map((tour) => (
                <li
                  key={tour._id}
                  className="p-3 border border-gray-200 rounded-md hover:shadow-lg transition-shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">{tour.name}</h3>
                    <p className="text-sm text-gray-500">{tour.region}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tour.typeOfTour.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-700">ETB {tour.price}</p>
                    <Badge
                      className={`${statusColors['active' as keyof typeof statusColors]} mt-1 capitalize`}
                    >
                      {'active'}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card 2: Add New Tour (Spans 2 Columns for Width) */}
        <Card className="bg-white shadow-md border border-green-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-green-700">{t('toursManagement.addNewTour.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form />
          </CardContent>
        </Card>

        {/* Card 3: Tour Actions */}
        <Card className="bg-white shadow-md border border-rose-200 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-rose-700">{t('toursManagement.actions.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTours.map((tour) => (
              <div key={tour._id} className="mb-4 border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">{tour.name}</h3>
                  <Badge
                    className={`${statusColors['active' as keyof typeof statusColors]} text-xs`}
                  >
                    {'active'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                <Link href={`/${locale}/edit/${tour._id}`}>
                <Button size="sm" variant="outline">
                {t('toursManagement.actions.edit')}
                </Button>
              </Link>
                  <Button size="sm" variant="destructive" disabled>
                  {t('toursManagement.actions.delete')}
                  </Button>
                  <Button size="sm" variant="ghost" >
                  {t('toursManagement.actions.archive')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )}
</div>


        {/* Footer Tip */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-2">{t('toursManagement.footer.title')}</h3>
            <p className="text-base leading-relaxed">
            {t('toursManagement.footer.text')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
