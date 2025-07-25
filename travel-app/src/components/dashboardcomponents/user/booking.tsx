'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Booking {
  id: string;
  name: string;
  tour: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const bookingsData: Booking[] = [
  {
    id: '1',
    name: 'John Doe',
    tour: 'African Safari',
    date: '2025-07-10',
    status: 'confirmed',
  },
  {
    id: '2',
    name: 'Alice Smith',
    tour: 'Ethiopian Highlands',
    date: '2025-07-12',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    tour: 'Blue Nile Falls',
    date: '2025-07-15',
    status: 'cancelled',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    tour: 'Simien Mountains',
    date: '2025-07-18',
    status: 'confirmed',
  },
];

export default function BookingsSection() {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');

  const filteredBookings = bookingsData.filter((booking) => {
    const nameMatch = booking.name.toLowerCase().includes(search.toLowerCase());
    const dateMatch = date ? booking.date === date : true;
    return nameMatch && dateMatch;
  });

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Search by name"
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBookings.length === 0 ? (
          <p className="text-center col-span-full text-muted-foreground">No bookings found.</p>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="border shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle>{booking.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Tour:</span> {booking.tour}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {format(new Date(booking.date), 'MMM d, yyyy')}
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
    </div>
  );
}
