'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Types } from 'mongoose';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface IBooking {
  _id: Types.ObjectId;
  tour: Types.ObjectId | string;
  user: Types.ObjectId | string;
  email: string;
  price: number;
  paid: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  transaction: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const statusColors = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BookingsSection() {
  const [emailSearch, setEmailSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axios.get('/api/bookings');
        setBookings(res.data.instanceFiltered || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredBookings = bookings
    .filter((b) => {
      const matchesEmail = b.email.toLowerCase().includes(emailSearch.toLowerCase());
      const matchesDate =
        !dateSearch ||
        new Date(b.createdAt).toISOString().slice(0, 10) === dateSearch;
      return matchesEmail && matchesDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <section className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-cyan-800 text-2xl">Bookings Management</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Search by email or date, and sort bookings by date.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input
              type="text"
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="w-52"
            />
            <Input
              type="date"
              placeholder="Search by date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              className="w-44"
            />
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-500 px-4 py-6">Loading bookings...</p>
          ) : (
            <table className="w-full border-collapse mt-2">
              <thead className="bg-cyan-100 text-cyan-800 text-sm">
                <tr>
                  <th className="p-3 text-left">Booking ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Tour ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b._id.toString()} className="border-b hover:bg-cyan-50 transition">
                      <td className="p-3 font-mono text-xs text-gray-700">
                        {b._id.toString().slice(-6)}
                      </td>
                      <td className="p-3 text-sm text-gray-800">{b.email}</td>
                      <td className="p-3 text-sm text-gray-600">{b.tour.toString().slice(-6)}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Badge className={`${statusColors[b.status]} capitalize`}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold text-green-700">${b.price}</td>
                      <td className="p-3 space-x-2">
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-6">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
