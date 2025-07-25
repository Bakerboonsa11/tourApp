'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const reviews = [
  {
    id: 1,
    tourName: 'Safari Adventure',
    date: '2024-07-10',
    rating: 5,
    comment: 'Amazing experience! Highly recommend.',
    status: 'Published',
  },
  {
    id: 2,
    tourName: 'Mountain Escape',
    date: '2024-07-05',
    rating: 4,
    comment: 'Beautiful scenery and great guide.',
    status: 'Pending',
  },
  {
    id: 3,
    tourName: 'City Lights Tour',
    date: '2024-07-01',
    rating: 2,
    comment: 'Too crowded, not what I expected.',
    status: 'Rejected',
  },
  {
    id: 4,
    tourName: 'Coastal Cruise',
    date: '2024-06-28',
    rating: 5,
    comment: 'Perfect weather and food!',
    status: 'Published',
  },
  
];

export default function ReviewsSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = reviews.filter((review) =>
    review.tourName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Add Review Card */}
      <Card className="bg-gradient-to-r from-emerald-100 via-white to-emerald-50 border-l-4 border-emerald-400 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Add a Review</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input placeholder="Tour name..." className="sm:w-1/3" />
          <Input placeholder="Your comment..." className="sm:flex-1" />
          <Input type="number" min={1} max={5} placeholder="Rating (1-5)" className="w-24" />
          <Button>Add Review</Button>
        </CardContent>
      </Card>

      {/* Search Input */}
      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Search by tour name..."
          className="w-full sm:max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Scrollable Review List */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              className={`border-l-4 shadow ${
                review.status === 'Published'
                  ? 'border-green-500'
                  : review.status === 'Pending'
                  ? 'border-yellow-500'
                  : 'border-red-500'
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{review.tourName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {review.date} &mdash;{' '}
                  <span className="capitalize">{review.status}</span>
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
