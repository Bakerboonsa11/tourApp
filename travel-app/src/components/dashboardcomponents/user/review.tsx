'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
export interface Tour {
  _id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  typeOfTour: string[];
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  coverImage: string;
  location: {
    type?: string;
    coordinates?: number[];
    description?: string;
    address?: string;
  };
  startDates: string[];
  endDate: string;
  likes: string[];
  comments: {
    userId: string;
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
  guides: string[];
  __v: number;
}
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string;
  createdAt: string;
}
export default function ReviewsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [user, setUser] = useState<User | null>(null);
  const [reviewedTours, setReviewedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
 const t = useTranslations('user');
  const filteredReviews = reviewedTours.filter((tour) =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const borderColors = [
    'border-emerald-500',
    'border-indigo-500',
    'border-rose-500',
    'border-yellow-500',
    'border-blue-500',
    'border-orange-500',
    'border-cyan-500',
    'border-fuchsia-500',
  ];

  useEffect(() => {
    if (!email) return;

    const fetchAllData = async () => {
      try {
        const tourRes = await axios.get('/api/tours');
        const alltours = tourRes.data.instanceFiltered || [];

        const userRes = await axios.get(`/api/user/${encodeURIComponent(email)}`);
        const userData = userRes.data.data;
        setUser(userData);

        const userReviews = alltours.filter((tour: Tour) =>
          tour.comments?.some(comment => comment.userId === userData._id)
        );

        setReviewedTours(userReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [email]);

  return (
    <div className="flex flex-col gap-6">
      {/* Add Review Form */}
      <Card className="bg-gradient-to-tr from-emerald-100 via-white to-emerald-50 border-l-4 border-emerald-400 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-emerald-800">
            {t('review.addReviewTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input placeholder={t('review.tourNamePlaceholder')} className="sm:w-1/3" />
          <Input placeholder={t('review.commentPlaceholder')} className="sm:flex-1" />
          <Input
            type="number"
            min={1}
            max={5}
            placeholder={t('review.ratingPlaceholder')}
            className="w-24"
          />
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {t('review.submitButton')}
          </Button>
        </CardContent>
      </Card>
  
      {/* Search Input */}
      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder={t('review.searchPlaceholder')}
          className="w-full sm:max-w-sm rounded-lg border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
  
      {/* Review Cards */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <p className="text-center text-gray-500">{t('review.loadingReviews')}</p>
        ) : filteredReviews.length === 0 ? (
          <p className="text-center text-gray-500">{t('review.noReviews')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((tour, tourIdx) =>
              tour.comments
                .filter((c) => c.userId === user?._id)
                .map((comment, idx) => (
                  <Card
                    key={`${tour._id}-${idx}`}
                    className={`shadow-md border-l-4 rounded-xl bg-white p-3 ${
                      borderColors[(tourIdx + idx) % borderColors.length]
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {tour.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {comment.createdAt &&
                        !isNaN(Date.parse(comment.createdAt))
                          ? format(new Date(comment.createdAt), 'PPP')
                          : t('unknownDate')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
  
                      {/* Stylized User Comment */}
                      <div className="mb-3 border-l-4 border-emerald-400 bg-emerald-50/40 p-3 rounded-md text-gray-800 italic relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute top-2 left-2 w-4 h-4 text-emerald-400"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.854 5.146a.5.5 0 0 1 .146.354v5a.5.5 0 0 1-1 0V6.707L4.854 8.854a.5.5 0 1 1-.708-.708l2.5-2.5a.5.5 0 0 1 .708 0zM13 1.5A1.5 1.5 0 0 1 14.5 3v10A1.5 1.5 0 0 1 13 14.5H3A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h10zm-1 1H4a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5z" />
                        </svg>
                        <span className="pl-6 block">{comment.message}</span>
                      </div>
  
                      {/* Additional Tour Info */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>{t('review.region')}:</strong> {tour.region}</p>
                        <p><strong>{t('review.price')}:</strong> ETB {tour.price}</p>
                        <p><strong>{t('review.difficulty')}:</strong> {tour.difficulty}</p>
                        <p><strong>{t('review.duration')}:</strong> {tour.duration} {t('review.days')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
  
}
