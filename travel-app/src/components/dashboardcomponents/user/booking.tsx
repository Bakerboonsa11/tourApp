"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export interface IBooking {
  _id: string;
  tour: string | { name: string }; // Simplified for display
  user: string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: unknown;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsSection() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredBookings = bookings.filter((booking) => {
    const name = typeof booking.tour === 'string' ? booking.tour : booking.tour?.name || '';
    const nameMatch = name.toLowerCase().includes(search.toLowerCase());
    const dateMatch = date ? format(new Date(booking.createdAt), 'yyyy-MM-dd') === date : true;
    return nameMatch && dateMatch;
  });

  useEffect(() => {
    if (!email) return;

    const fetchAllData = async () => {
      try {
        const res = await axios.get('/api/bookings');
        const allBookings = res.data.instanceFiltered || [];
        const userBookings = allBookings.filter((booking: IBooking) => booking.email === email);
        setBookings(userBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [email]);

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Search by tour name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading bookings...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBookings.length === 0 ? (
            <p className="text-center col-span-full text-muted-foreground">No bookings found.</p>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking._id} className="border shadow-sm hover:shadow-md transition">
                <CardHeader>
                  <CardTitle>
                    {typeof booking.tour === 'string' ? booking.tour : booking.tour.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <span className="font-medium">Price:</span> ${booking.price}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{' '}
                    {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={
                        booking.status === 'confirmed'
                          ? 'text-green-600 font-semibold'
                          : booking.status === 'pending'
                          ? 'text-yellow-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {booking.status}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
